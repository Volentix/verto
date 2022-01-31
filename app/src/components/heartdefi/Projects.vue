<template>
  <div class=" q-mx-lg">
  <div class="full-width text-center q-mb-md" v-if="false" >
  <div class="text-h6 text-bold ">Have a project ?</div>
   <q-btn  label="Submit Project" />
  </div>

    <div
      class="row q-mb-md shadows-2 project-item q-py-md cursor-pointer"
      @click="$router.push('/project/'+project.id)"
      v-for="(project, index) in $store.state.settings.projects"
      :key="index"
    >
      <div class="col-md-2">
        <q-img
          contain
          style="max-height: 100px"
          class="full-width"
          :src="project.icon"
        />
      </div>
      <div class="col-md-9">
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
      <div class="col-md-9 offset-md-2 row" v-if="false">
        <div class="col-12 q-mt-sm q-px-sm rounded-borders q-gutter-y-md comment-section" v-if="$store.getters['settings/feed_comments']('project', project.id).length > 0">
          <div
            class="q-px-md"
            v-for="(item,index) in $store.getters['settings/feed_comments']('project', project.id)"
            :key="project.id+'-'+item.comment_id">
            <CommentItem
              v-if="index < 2"
              :feed="project"
              :item="item"
              :actions="false"
              :reply_limit="0"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import CommentItem from './Feed/CommentItem'
export default {
  components: {
    CommentItem
  },
  data () {
    return {
      projects: [],
      loading: false
    }
  },
  computed: {
    ...mapState('settings', ['upvotes', 'comments', 'replies']),
    ...mapState('currentwallet', ['user'])
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
