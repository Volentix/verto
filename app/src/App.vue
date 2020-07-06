<template>
  <div id="q-app">
    <router-view :keys='network' />
  </div>
</template>

<script>

export default {
  name: 'App',
  computed: {
    network () {
      return this.$store.state.settings.network
    }
  }
}
</script>

<style>
body {
  font-family: Tittilium;
  background: black;
}
@media screen and (max-width: 768px) {
  ::-webkit-scrollbar { display: none; }
}
.modal-content {
  background: black;
  border: 0.1rem solid white;
  padding: 1.2rem;
  color: white !important;
  min-width: 40vw;
}
.modal-content img, .q-icon {
  cursor: pointer;
}
.modal-content .q-input {
  color: green !important;
}
.modal-content .q-btn {
  color: white !important;
  border: 0.05rem solid white;
}
.modal-content .q-input-target {
  color: white;
}

.workflow-step  {
  background: black;
  border: 0.1rem solid white;
  color: white !important;
}
</style>
