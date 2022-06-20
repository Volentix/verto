<template>
  <div class="q-mx-lg mncright justify-center">
    <div class="mncright-left q-px-sm">
      <div class="full-width text-center q-mb-md">
        <div class="text-h6 text-bold ">Have a project ?</div>
        <q-btn  label="Submit Project" />
      </div>

      <div
        class="row q-mb-md shadows-2 project-item q-py-md cursor-pointer"
        @click="$router.push('/project/'+project.id)"
        v-for="(project, index) in projects"
        :key="index"
      >
        <div class="col-md-2 flex flex-center q-px-md">
          <q-img
            contain
            style="max-height: 100px"
            class="full-width"
            :src="project.icon"
          />
        </div>
        <div class="col-md-8">
          <div class="text-h6 text-bold q-pb-sm">
            {{ project.title }}
          </div>
          <q-item-label lines="2" class="text-body1">
            {{project.description}}
          </q-item-label>
          <q-item-label class="q-pt-md text-caption">
            <q-icon
            color="grey"
            name="mode_comment"
            class="relative-position"
            style="top:-2px;"/>
            {{$store.getters['settings/feed_comments']('project', project.id).length}}
          </q-item-label>
        </div>
        <div class="col-md-1 flex flex-center">
          <q-btn
            outline
            :color="isUpvoted(project) ? 'red' : 'primary'"
            size="md"
            class="row"
            @click.stop.prevent="user ? upvoteProject(project) : $q.notify({message:'Connect a wallet to upvote', position:'center'})">
            <div class="col-12">
              <q-icon
                :color="isUpvoted(project) ? 'red' : 'grey'"
                name="play_arrow"
                style="transform: rotateZ(270deg)"/>
            </div>
            <div class="col-12">
              {{getUpvotes(project).length}}
            </div>
          </q-btn>
        </div>
      </div>
    </div>
    <div class="mncright-right q-ml-md q-mt-sm q-px-md rounded-borders q-gutter-y-md comment-section" v-if="projects.length > 0 && is_page">
      <div
        class="q-px-md tpRecent-parta1 cursor-pointer"
        v-for="(item,index) in discussions"
        @click="$router.push('/project/'+item.project.id)"
        :key="'disc-'+index">
        <Component
          :is="item.reply_id ? 'ReplyItem' : 'CommentItem'"
          :feed="item.project"
          :item="item"
          :actions="false"
          :reply_limit="0"/>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import CommentItem from './Feed/CommentItem'
import ReplyItem from './Feed/ReplyItem'
export default {
  props: {
    is_page: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  components: {
    CommentItem,
    ReplyItem
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState('settings', ['upvotes', 'comments', 'replies', 'projects']),
    ...mapState('currentwallet', ['user']),
    discussions () {
      const comments = this.comments.filter((x) => {
        const obj = x
        if (obj.type === 'project') {
          const project = this.$store.getters['settings/project'](obj.type_id)
          if (project) {
            obj.project = project
            obj.custom_title = project.title
            obj.image = project.icon
            return obj
          }
        }
      })
      const replies = this.replies.filter((x) => {
        const obj = x
        if (obj.type === 'project') {
          const project = this.$store.getters['settings/project'](obj.type_id)
          if (project) {
            obj.project = project
            obj.custom_title = project.title
            obj.image = project.icon
            return obj
          }
        }
      })
      const arr = [...comments, ...replies]
      return arr.sort((a, b) => parseInt(new Date(a.createdAt).getTime()) - parseInt(new Date(b.createdAt).getTime())).reverse()
    }
  },
  watch: {
    upvotes: {
      immediate: true,
      handler (newVal) {
        console.log(newVal)
        // for (const elem of newVal) {
        //   elem.obj.destroy()
        // }
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    getProjectDiscussions (project) {
      const arr = this.$store.getters['settings/feed_items']('project', project.id)
      return arr
    },
    isUpvoted (project) {
      if (!this.user) return null
      const index = this.upvotes.findIndex((x) => x.type_id === project.id && x.user_id === this.user.address)
      if (index >= 0) return this.upvotes[index]
      return null
    },
    getUpvotes (project) {
      const arr = this.$store.getters['settings/feed_upvotes']('project', project.id)
      return arr
    },
    upvoteProject (project) {
      if (this.loading) return
      this.loading = true
      if (this.isUpvoted(project)) {
        const upvote = this.isUpvoted(project)
        upvote.obj.destroy()
        this.$store.commit('settings/removeUpvote', upvote)
        this.loading = false
      } else {
        const time = new Date().getTime()
        const obj = {
          upvote_id: time,
          type: 'project',
          type_id: project.id.toString(),
          user_id: this.user.address
        }
        this.$store.dispatch('settings/addUpvote', obj)
          .then((response) => {
            this.loading = false
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
          })
      }
    }
  }
}
</script>
<style scoped>
.comment-section{
  border:1px solid rgb(207, 207, 207);
}
.project-item {
  box-shadow: 1px 1px 20px #e01f0038;
  border-radius: 20px;
}
</style>
