<template>
  <div id="q-app" :style="bexStyles">
    <router-view :keys='network'/>
  </div>
</template>

<script>
import configManager from '@/util/ConfigManager'

export default {
  name: 'App',
  computed: {
    network () {
      return this.$store.state.settings.network
    },
    bexStyles () {
      if (this.$isbex) {
        return {
          width: '357px;',
          height: '600px',
          background: '#F5F5FE'
        }
      }
      return {}
    }
  },
  mounted () {
    if (chrome !== undefined && this.$isbex) {
      chrome.idle.setDetectionInterval(300)
      const idleStateListener = (state) => {
        if (state === 'idle' || state === 'locked') {
          if (this.$store.state.currentwallet.loggedIn === true) {
            configManager.logout({
              navigateToLogin: true
            })
          }
        }
      }
      chrome.idle.onStateChanged.addListener(idleStateListener)
    }
  }
}
</script>

<style>
body {
  font-family: 'Libre Franklin', sans-serif;
  background: #F5F5FE;
  /* black; */
}

@media screen and (max-width: 768px) {
  ::-webkit-scrollbar {
    display: none;
  }
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

.workflow-step {
  background: black;
  border: 0.1rem solid white;
  color: white !important;
}
</style>
