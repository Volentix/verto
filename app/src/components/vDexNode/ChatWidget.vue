<template>
<div class="row">

    <!-- Room dialog -->
    <q-dialog v-model="roomDialog">
        <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
            <q-card-section>
                <div class="text-h6">Join room</div>
                <q-separator dark />
            </q-card-section>
            <q-card-section>
                <q-input dense rounded outlined dark v-on:keyup.enter="joinRoom()" color="vgreen" v-model="roomToJoin"></q-input>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn outline rounded color="vgold" label="Join" @click="joinRoom()" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <div class="col-4 text-vgrey bg-vdark">
        <q-banner dense class="text-vgrey bg-vdark q-px-md q-pt-md">
            <div class="text-uppercase">
                Chat
                <q-btn color="vgreen" size="sm" rounded style="float: right;" @click="roomDialog = true" outline label="Join room" />
            </div>
        </q-banner>
        <q-separator dark />
        <div class="col scroll q-px-md text-vgrey" style="min-height: 30vh; max-height: 30vh">
            <q-list v-for="room in rooms" :key="room">
                <q-item clickable @click="setActive(room)">
                    <q-item-section>
                        <q-item-label>{{ room }}</q-item-label>
                    </q-item-section>
                    <q-item-section top side>
                        <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="leaveRoom(room)" />
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>
    <div class="col-8 bg-vdarker">
        <div class="column">
            <div id="chat" top class="col scroll q-px-md text-vgrey" style="min-height: 30vh; max-height: 30vh">
                <div v-for="message in messages" :key="message.id" top>
                    <q-chat-message v-bind:id="message.id" v-bind:name="message.author" v-if="message.author != nodeId" bg-color="vdark" text-color="white" v-bind:text="message.body" />
                    <q-chat-message v-bind:id="message.id" name="me" v-if="message.author == nodeId" bg-color="vgrey" sent v-bind:text="message.body" />
                </div>
            </div>
            <div class="col q-px-md q-my-md">
                <q-input dense rounded outlined dark color="vgreen" v-on:keyup.enter="sendMessage()" v-model="messageToSend">
                    <template v-slot:after>
                        <q-btn round dense flat icon="send" @click="sendMessage()" />
                    </template>
                </q-input>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'ChatWidget',
  data () {
    return {
      nodeId: '',
      roomDialog: false,
      selectedRoom: '',
      roomToJoin: '',
      messageToSend: '',
      streamData: null,
      isSending: false,
      messages: [], // Store messages to show
      storage: {}, // Store current known messages
      rooms: [],
      streamsController: []
    }
  },
  mounted () {
    this.getNodeId()
  },
  watch: {
    messages: function (val, oldVal) {
      this.$nextTick(function () {
        var container = this.$el.querySelector('#chat')
        container.scrollTop = container.scrollHeight
      })
    }
  },
  methods: {
    async joinRoom () {
      if (this.roomToJoin === '') return
      if (!this.rooms.includes(this.roomToJoin)) {
        this.rooms.push(this.roomToJoin)
      }
      let room = this.roomToJoin
      this.setActive(room)
      this.roomToJoin = ''
      this.roomDialog = false
      const controller = new AbortController()
      const signal = controller.signal
      this.streamsController[room] = controller
      try {
        // This streams will get new messages and is stopped whenever controller is aborted
        await fetch(this.$vDexNodeConfigManager.getEndpoint('nodes_api') + '/room/' + room, {
          method: 'get',
          signal: signal
        })
          .then(response => {
            const reader = response.body.getReader()
            var read = function (result) {
              let chunk = result.value.filter(ignoreZero)

              function ignoreZero (value, index, array) {
                return value > 0
              }
              if (chunk.length !== 0) {
                let messages = String.fromCharCode.apply(null, chunk).split('\n')
                messages.forEach(message => {
                  try {
                    let json = JSON.parse(message)
                    if (!this.storage[room]) {
                      this.storage[room] = []
                    }
                    this.storage[room].push({
                      'id': 'message_' + this.storage[room].length,
                      'author': json.author,
                      'body': [json.body]
                    })
                  } catch (e) {
                    // ignore
                  }
                })
              }
              return reader.read().then(read.bind(this))
            }.bind(this)
            return reader.read().then(read)
          })
      } catch (e) {
        // console.log('Stop streaming: ' + room)
      }
    },
    leaveRoom (room) {
      this.rooms.splice(this.rooms.indexOf(room), 1)
      if (room === this.selectedRoom) {
        this.selectedRoom = ''
        this.messages = []
      }
      this.streamsController[room].abort()
      this.storage[room] = []
    },
    setActive (room) {
      this.selectedRoom = room
      if (!this.storage[room]) {
        this.storage[room] = []
      }
      this.messages = this.storage[room]
    },
    sendMessage () {
      if (this.isSending) return
      if (this.selectedRoom === '' || this.messageToSend === '') return
      this.isSending = true
      this.$axios
        .post(this.$vDexNodeConfigManager.getEndpoint('nodes_api') + '/room/' + this.selectedRoom, {
          'message': this.messageToSend
        })
        .then((response) => {
          this.messageToSend = ''
          this.isSending = false
        }, (error) => {
          this.$userError(error, 'Get location data action')
          // console.log(error)
        })
    },
    getNodeId () {
      this.$axios
        .get(this.$vDexNodeConfigManager.getEndpoint('nodes_api'))
        .then((response) => {
          this.nodeId = response.data.public_key
        }, (error) => {
          this.$userError(error, 'Get node id')
          // console.log(error)
        })
    }
  } // end of methods
}
</script>

<style scoped>
</style>
