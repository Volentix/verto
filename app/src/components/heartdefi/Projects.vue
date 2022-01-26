<template>
  <div class=" q-mx-lg">
  <div class="full-width text-center q-mb-md" >
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
      </div>
      <div class="col-md-1 flex flex-center">
        <q-btn
          outline
          color="primary"
          size="md"
          class="row"
          :disable="!user"
          @click.stop.prevent="upvoteProject(project)">
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
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  data () {
    return {
      projects: [],
      loading: false
    }
  },
  computed: {
    ...mapState('settings', ['upvotes']),
    ...mapState('currentwallet', ['user'])
  },
  watch: {

  },
  created () {
    this.$store.dispatch('settings/getUpvotes')
  },
  mounted () {

  },
  methods: {
    isUpvoted (project) {
      const index = this.upvotes.findIndex((x) => x.type_id === project.id && x.user_id === 'jhuril')
      if (index >= 0) return this.upvotes[index]
      return null
    },
    getUpvotes (project) {
      const arr = this.upvotes.filter((x) => x.type_id === project.id)
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
          type_id: project.id,
          user_id: 'jhuril'
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
.project-item {
  box-shadow: 1px 1px 20px #e01f0038;
  border-radius: 20px;
}
</style>
