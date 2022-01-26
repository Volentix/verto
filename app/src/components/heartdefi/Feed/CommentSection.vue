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
              v-model="comment"
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
      <div v-for="item in project_comments" :key="item.comment_id">
        <CommentItem :feed="feed" :item="item"/>
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
    }
  },

  components: {
    CommentItem
  },

  data () {
    return {
      comment: '',
      loading: false
    }
  },

  computed: {
    ...mapState('currentwallet', ['user']),
    ...mapState('settings', ['comments', 'replies']),
    project_comments () {
      if (!this.feed) return []
      return this.comments.filter((x) => x.type === 'project' && x.type_id === this.feed.id).sort((a, b) => (new Date(a.createdAt).getTime()) - (new Date(b.createdAt).getTime())).reverse()
    }
  },

  watch: {
    project_comments: {
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
      if (this.loading || !this.user) return
      this.loading = true
      const obj = {
        title: this.comment,
        comment_id: new Date().getTime(),
        type: 'project',
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
