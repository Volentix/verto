<template>
  <div>
    <div class="logo-area">
      <a href="" @click.prevent="">
        <img
          :src="require('assets/Heartdefi/img/logo.png')"
          alt="logo" />
      </a>
    </div>
    <div class="menu-area">
      <div class="menu-part">
        <ul>
            <li @click="$router.push('/account/'+($store.state.currentwallet.user ?  $store.state.currentwallet.user.address : ''))" :class="{'active': $route.path == '/account/'+$route.params.key || $route.path == '/account/'}">
              <a href="javascript:void(0)" @click.prevent=""  >
                <i class="fas fa-home"/>
                <p>Dashboard</p>
              </a>
            </li>
            <li  :class="{'active': $route.path.includes('bridge')}" @click="$router.push('/bridge')">
              <a href="javascript:void(0)" @click.prevent=""  >
                <q-icon name="swap_horiz" />
                <p>Bridge</p>
              </a>
            </li>
            <li v-if="$store.state.currentwallet.user" :class="{'active': $route.path.includes('history')}" @click="$router.push('/account/'+$route.params.key+'/history')">
              <a href="javascript:void(0)" @click.prevent=""  >
                <i class="far fa-chart-bar"/>
                <p>History</p>
              </a>
            </li>
            <li @click="$router.push('/projects')" :class="{'active': $route.path.includes('project')}">
              <a href="javascript:void(0)"   >
                  <q-icon name="rocket_launch" />
                <p>Projects</p>
              </a>
            </li>
            <li  :class="{'active': $route.path.includes('community')}" @click="$router.push('/community')">
              <a href="javascript:void(0)"  >
                <i class="fas fa-chart-line"/>
                <p>Community</p>
              </a>
            </li>
 <li  :class="{'active': $route.path.includes('list')}" @click="$router.push('/list')">
              <a href="" @click.prevent=""  >
                <q-icon name="rocket" />
                <p>List project</p>
              </a>
            </li>

            <li v-if="false">
              <a href="" @click.prevent=""  >
                <i class="fas fa-user"/>
                <p> Profile</p>
              </a>
            </li>
            <li v-if="false">
              <a href="" @click.prevent=""  >
                <i class="fas fa-cog"/>
                <p>Settings</p>
              </a>
            </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mixins: [],
  components: {

  },
  data () {
    return {

    }
  },
  watch: {

  },
  computed: {

  },
  created () {

  },
  mounted () {
  },
  methods: {

  },
  destroyed () {

  }

}
</script>
