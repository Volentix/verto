<template>
  <div v-if="item">
    <q-item dense class="q-px-none">
      <q-item-section side @click.prevent="" class="q-pr-sm">
        <q-avatar class="cursor-pointer" size="2.2rem">
          <img :src="avatar"/>
        </q-avatar>
      </q-item-section>

      <q-item-section @click.prevent="">
        <q-item-label class="text-dark text-subtitle2">
          <span class="cursor-pointer">
            {{header}}
          </span>
        </q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-item-label caption>
          <span class="q-pr-xs">
            {{item_date}}
          </span>
          <q-btn
            flat
            icon="more_horiz"
            size="sm"
            padding="none"
            :loading="loading_delete"
            v-if="user && item.user_id === user.address">
              <q-menu
                fit
                anchor="bottom left"
                self="top left"
                transition-show="scale"
                transition-hide="scale"
                auto-close
                no-refocus
                >
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section>
                      <q-item-label caption>
                        <q-icon name="create" ></q-icon> Edit
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="deleteItem()">
                    <q-item-section>
                      <q-item-label caption>
                        <q-icon name="delete"></q-icon> Delete
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
          </q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item dense>
      <q-item-section class="q-pl-lg text-subtitle2 text-dark q-py-sm">
        <q-item-label lines="2">
          {{item.title}}
        </q-item-label>
      </q-item-section>
    </q-item>
    <template v-if="actions">
      <q-item dense>
        <q-item-section class="q-pl-lg text-subtitle2 text-dark q-py-sm">
          <q-item-label
            class="q-pt-sm row q-gutter-x-sm item-actions">
            <div
              class="cursor-pointer col col-shrink"
              @click.stop.prevent="user ? upvoteItem(item) : $q.notify({message:'Connect a wallet to upvote', position:'center'})">
              <q-icon
                size="xs"
                :color="upvoted ? 'red' : 'grey'"
                name="play_arrow"
                class="relative-position"
                style="transform: rotateZ(270deg)"/>
              Upvote
              <span v-if="item_upvotes.length">
                {{'('+item_upvotes.length+')'}}
              </span>
            </div>
            <div
              class="cursor-pointer col col-shrink"
              @click="user ? reply_comment = !reply_comment : $q.notify({message:'Connect a wallet to reply', position:'center'})">
              <q-icon
                size="xs"
                color="grey"
                name="reply"
                class="relative-position"
                style="top:-2px;"/>
              Reply
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>

      <div
        v-if="is_limit && comment_replies.length > reply_limit"
        class="q-pt-sm fit row wrap justify-center items-start content-start">
        <div class="text-primary q-pl-sm text-lowercase text-subtitle2 cursor-pointer" @click="is_limit=false" >
          <span class="text-capitalize">
            View
          </span> {{(reply_limit === 0 ? 'replies' : (comment_replies.length - reply_limit)+' more replies' )}}
        </div>
      </div>
      <div class="row q-mb-md q-px-lg">
        <div
          class="col-12 reply-item"
          v-for="(rep,index) in comment_replies"
          :key="rep.reply_id">
          <template v-if="(is_limit ? index < reply_limit : true)">
            <div class="q-px-sm" :class="index == 0 ? 'q-pt-sm' : 'q-pt-md'">
              <ReplyItem
                @mentionReply="mentionReply"
                :actions="actions"
                :feed="feed"
                :item="rep" />
            </div>
          </template>
        </div>
      </div>
      <div class="row" v-if="reply_comment && user">
        <form
          class="col-md-12"
          @submit.prevent="user ? submitReply(item) : $q.notify({message:'Connect a wallet to reply', position:'center'})"
        >
          <q-item dense class="q-px-none q-ml-lg">
            <q-item-section side top @click.prevent="" class="q-pr-sm">
              <q-avatar class="cursor-pointer" size="2.2rem">
                <img
                  :src="'https://ui-avatars.com/api/?name='+(user ? user.address.charAt(2) : 'u')" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-input
                ref="reply_input"
                dense
                outlined
                v-model="reply"
                autogrow
                @keypress.enter.prevent.stop="submitReply(item)"
                placeholder="Add reply"/>
              <q-item-label
                caption
                class="cursor-pointer text-dark q-mt-sm"
                @click="reply_comment = false;reply = ''">
                Cancel
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn
                color="primary"
                label="Send"
                :loading="loading"
                :disable="!user"
                type="submit"/>
            </q-item-section>
          </q-item>
        </form>
      </div>
    </template>
  </div>
</template>

<script>
import Formatter from '@/mixins/Formatter'
import { mapState } from 'vuex'
import ReplyItem from './ReplyItem.vue'
export default {
  mixins: [Formatter],
  props: {
    feed: {
      type: Object,
      default () {
        return null
      }
    },
    item: {
      type: Object,
      default () {
        return null
      }
    },
    reply_limit: {
      type: Number,
      default () {
        return 2
      }
    },
    actions: {
      type: Boolean,
      default () {
        return true
      }
    }
  },

  components: {
    ReplyItem
  },

  data () {
    return {
      reply: '',
      loading: false,
      reply_comment: false,
      is_limit: true,
      loading_delete: false,
      loading_upvote: false
    }
  },

  computed: {
    ...mapState('currentwallet', ['user']),
    ...mapState('settings', ['upvotes', 'replies']),
    avatar () {
      return this.item.image ? this.item.image : 'https://ui-avatars.com/api/?name=' + this.item.user_id.charAt(2)
    },
    header () {
      if (!this.item) return ''
      const header = this.item.custom_title ? this.item.custom_title : this.item.user_id.substring(0, 6) + '...' + this.item.user_id.substring(this.item.user_id.length - 5, this.item.user_id.length)
      return header
    },
    item_upvotes () {
      if (!this.feed || !this.item) return []
      const arr = this.$store.getters['settings/feed_upvotes']('comment', this.item.comment_id.toString())
      return arr
    },
    comment_replies () {
      if (!this.feed || !this.item) return []
      const arr = this.$store.getters['settings/comment_replies'](this.item.comment_id)
      return arr.reverse()
    },
    upvoted () {
      if (!this.user || !this.item) return null
      const index = this.item_upvotes.findIndex((x) => x.user_id === this.user.address)
      if (index >= 0) return this.item_upvotes[index]
      return null
    },
    item_date () {
      if (!this.item) return ''
      return this.getTimeAgo(this.item.comment_id, false, 1, 1)
    }
  },

  watch: {
    reply_comment (val) {
      if (val) {
        setTimeout(() => {
          this.$refs.reply_input.focus()
        }, 100)
      }
    }
  },

  created () {

  },

  mounted () {

  },

  methods: {
    async deleteItem (item) {
      try {
        if (this.loading_delete) return
        this.loading_delete = !this.loading_delete
        await this.item.obj.destroy()
        this.loading_delete = !this.loading_delete
      } catch (error) {
        console.log(error)
      }
    },
    mentionReply (item) {
      if (item.user_id !== this.user.address) this.reply = '@' + item.user_id + ' '
      this.reply_comment = true
    },
    submitReply (item) {
      if (this.loading || !this.user || this.reply.length === 0) return
      this.loading = true
      const obj = {
        title: this.reply,
        reply_id: new Date().getTime(),
        type: item.type,
        type_id: item.type_id,
        comment_id: item.comment_id,
        user_id: this.user.address
      }
      this.$store.dispatch('settings/addReply', obj)
        .then((response) => {
          this.loading = false
          this.reply = ''
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    upvoteItem (item) {
      if (this.loading_upvote || !this.user) return
      this.loading_upvote = true
      if (this.upvoted) {
        this.upvoted.obj.destroy()
        this.$store.commit('settings/removeUpvote', this.upvoted)
        this.loading_upvote = false
      } else {
        const time = new Date().getTime()
        const obj = {
          upvote_id: time,
          type: 'comment',
          type_id: item.comment_id.toString(),
          user_id: this.user.address
        }
        this.$store.dispatch('settings/addUpvote', obj)
          .then((response) => {
            this.loading_upvote = false
          })
          .catch((error) => {
            console.log(error)
            this.loading_upvote = false
          })
      }
    }
  },
  beforeDestroy () {

  }
}
</script>

<style scoped>
.item-actions{
  font-size: 0.80rem;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.03333em;
}
.reply-item{
  border-left: 1px solid #c5bcbc;
}
</style>
