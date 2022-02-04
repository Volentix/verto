<template>
  <div class="row">
    <div class="col-12 comment-area">
      <form
        @submit.prevent="!user ? '' : submitComment(feed.id)"
      >
        <q-item dense class="q-px-none">
          <q-item-section side @click.prevent="" class="q-pr-sm">
            <q-avatar class="cursor-pointer" size="2.2rem">
              <img
                :src="'https://ui-avatars.com/api/?name='+(user ? user.address.charAt(2) : 'u')" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-input
              dense
              outlined
              autogrow
              @keypress.enter.prevent.stop="submitComment(feed.id)"
              v-model="comment"
              :disable="!user"
              placeholder="What do you think of this project?"/>
          </q-item-section>
          <q-item-section side>
            <q-btn
              type="submit"
              color="primary"
              label="Send"
              :loading="loading"
              :disable="!user"/>
          </q-item-section>
        </q-item>
      </form>
    </div>

    <div class="col-12 q-px-lg q-mt-lg q-gutter-y-md">
      <div
        v-for="(item,index) in feed_comments"
        :key="item.comment_id">
        <CommentItem
          v-if="(is_limit ? index < comment_limit : true)"
          :feed="feed"
          :item="item" />
      </div>
    </div>
    <div
      v-if="is_limit && feed_comments.length > comment_limit"
      class="fit row wrap justify-center items-start content-start">
      <div class="text-primary q-pl-sm text-lowercase text-subtitle2 cursor-pointer" @click.prevent="is_limit=false" >
        <span class="text-capitalize">
          View
        </span> {{feed_comments.length - comment_limit}} more comments
      </div>
    </div>
    <div class="col-12 row justify-center" v-if="feed_comments.length == 0 && subscribed_comments">
      <div class="text-subtitle2">
        No comments
      </div>
    </div>
  </div>
</template>

<script>
import CommentItem from './CommentItem.vue'
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
    type: {
      type: String,
      default () {
        return 'project'
      }
    },
    comment_limit: {
      type: Number,
      default () {
        return 2
      }
    }
  },

  components: {
    CommentItem
  },

  data () {
    return {
      comment: '',
      loading: false,
      is_limit: true
    }
  },

  computed: {
    ...mapState('currentwallet', ['user']),
    ...mapState('settings', ['comments', 'subscribed_comments']),
    feed_comments () {
      if (!this.feed) return []
      console.log(this.$store.getters)
      const comments = this.$store.getters['settings/feed_comments'](this.type, this.feed.id)
      return comments
    }
  },

  watch: {
    feed_comments: {
      immediate: true,
      handler (newVal) {
        console.log(newVal)
      }
    }
  },

  created () {
    console.log(this.user)
  },

  mounted () {

  },

  methods: {
    submitComment (id) {
      if (this.loading || !this.user || this.comment.length === 0) return
      this.loading = true
      const obj = {
        title: this.comment,
        comment_id: new Date().getTime(),
        type: this.type,
        type_id: id,
        user_id: this.user.address
      }
      this.$store.dispatch('settings/addComment', obj)
        .then((response) => {
          this.loading = false
          this.comment = ''
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

<style scoped>

</style>
