<template>
  <div v-if="item">
    <q-item dense class="q-px-none">
      <q-item-section side @click.prevent="" class="q-pr-sm">
        <q-avatar class="cursor-pointer" size="2.2rem">
          <img :src="'https://ui-avatars.com/api/?name='+item.user_id.charAt(2)"/>
        </q-avatar>
      </q-item-section>

      <q-item-section @click.prevent="">
        <q-item-label class="text-dark text-subtitle2">
          <span class="cursor-pointer">
            {{item.user_id}}
          </span>
        </q-item-label>
        <q-item-label lines="1" caption class="feed-country text-caption">
          <q-img
            class="feed-flag cursor-pointer"
            :src="'https://flagpedia.net/data/flags/icon/36x27/'+ 'ph' + '.webp'"
            style="height:11px;width:13px;margin-top:-5px;"/>
            Philippines
        </q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-item-label caption>
          <span class="q-pr-sm">
            just now
          </span>
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item dense>
      <q-item-section class="q-pl-lg text-subtitle2 text-dark q-py-sm">
        <q-item-label lines="2">
          {{item.title}}
        </q-item-label>
        <q-item-label caption class="cursor-pointer q-pt-sm" @click="reply_comment=!reply_comment">
          <q-icon
            color="grey"
            name="reply"
            class="relative-position"
            style="top:-2px;"/>
          Reply
        </q-item-label>
      </q-item-section>
    </q-item>

    <div class="row" v-if="reply_comment">
      <form
        class="col-md-8"
        @submit.prevent="!user ? '' : submitReply(item)"
      >
        <q-item dense class="q-px-none q-ml-lg">
          <q-item-section side @click.prevent="" class="q-pr-sm">
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
              placeholder="Add reply"/>
          </q-item-section>
          <q-item-section side>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  mixins: [],
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
    }
  },

  components: {

  },

  data () {
    return {
      reply: '',
      loading: false,
      reply_comment: false
    }
  },

  computed: {
    ...mapState('currentwallet', ['user']),
    ...mapState('settings', ['replies']),
    comment_replies () {
      if (!this.feed || !this.item) return []
      return this.replies.filter((x) => x.comment_id === this.item.comment_id).sort((a, b) => (new Date(a.createdAt).getTime()) - (new Date(b.createdAt).getTime())).reverse()
    }
  },

  watch: {
    reply_comment (val) {
      if (val) {
        setTimeout(() => {
          this.$refs.reply_input.focus()
        }, 100)
      }
    },
    comment_replies: {
      immediate: true,
      handler (newVal) {
        console.log(newVal)
      }
    }
  },

  created () {

  },

  mounted () {

  },

  methods: {
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
    }
  },
  beforeDestroy () {

  }
}
</script>
