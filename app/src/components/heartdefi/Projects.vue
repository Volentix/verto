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
        <div class="text-h6 text-bold q-pb-sm">{{ project.title }}</div>
        <q-item-label lines="2" class="text-body1">{{
          project.description
        }}</q-item-label>
      </div>
       <div class="col-md-1 flex flex-center">
      <q-icon size="3rem" color="grey" name="arrow_forward_ios" />
    </div>
    </div>

  </div>
</template>
<script>
export default {
  data () {
    return {
      projects: []
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
