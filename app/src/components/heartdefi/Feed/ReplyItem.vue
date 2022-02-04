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
            round
            icon="more_horiz"
            size="sm"
            padding="xs"
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
              @click.stop.prevent="user ? upvoteItem(item) : $q.notify({message:'Connect a wallet to reply', position:'center'})">
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
              @click="user ? $emit('mentionReply',item) : $q.notify({message:'Connect a wallet to reply', position:'center'})">
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
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Formatter from '@/mixins/Formatter'
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
    actions: {
      type: Boolean,
      default () {
        return true
      }
    }
  },

  components: {

  },

  data () {
    return {
      reply: '',
      loading: false,
      reply_comment: false,
      loading_delete: false,
      loading_upvote: false
    }
  },

  computed: {
    ...mapState('currentwallet', ['user']),
    ...mapState('settings', ['upvotes']),
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
      const arr = this.$store.getters['settings/feed_upvotes']('reply', this.item.reply_id.toString())
      return arr
    },
    upvoted () {
      if (!this.user || !this.item) return null
      const index = this.item_upvotes.findIndex((x) => x.user_id === this.user.address)
      if (index >= 0) return this.item_upvotes[index]
      return null
    },
    item_date () {
      if (!this.item) return ''
      return this.getTimeAgo(this.item.reply_id, false, 1, 1)
    }
  },

  watch: {

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
    submitReply (item) {
      if (this.loading || !this.user) return
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
      if (this.loading_upvote) return
      this.loading_upvote = true
      if (this.upvoted) {
        this.upvoted.obj.destroy()
        this.$store.commit('settings/removeUpvote', this.upvoted)
        this.loading_upvote = false
      } else {
        const time = new Date().getTime()
        const obj = {
          upvote_id: time,
          type: 'reply',
          type_id: item.reply_id.toString(),
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
