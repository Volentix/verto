<template>
  <div>
    <div class="logo-area">
      <a href="" @click.prevent="">
        <img
          :src="require('assets/heartdefi/img/logo.png')"
          alt="logo" />
      </a>
    </div>
    <div class="menu-area">
      <div class="menu-part">
        <ul>
            <li class="active">
              <a href="" @click.prevent=""  >
                <i class="fas fa-home"/>
                <p>Dashboard</p>
              </a>
            </li>
            <li>
              <a href="" @click.prevent=""  >
                <i class="far fa-chart-bar"/>
                <p>Exchange</p>
              </a>
            </li>
            <li>
              <a href="" @click.prevent=""  >
                <i class="fas fa-wallet"/>
                <p>Wallet</p>
              </a>
            </li>
            <li>
              <a href="" @click.prevent=""  >
                <i class="fas fa-chart-line"/>
                <p>Chart</p>
              </a>
            </li>
            <li>
              <a href="" @click.prevent=""  >
                <i class="fas fa-user"/>
                <p> Profile</p>
              </a>
            </li>
            <li>
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
