<template>
  <q-page class="flex flex-center text-white bg-black">
    <q-card class="q-pa-sm" style="max-width: 700px; min-width: 500px; border-style: solid;" flat>
      <q-card-title class="text-weight-bold text-white text-center uppercase">
        powered by <big>Zixipay</big>
      </q-card-title>
      <q-card-main class="text-center text-white">
        <br>
        <div class="q-pa-sm">
          <q-select
              dark
              stack-label="Select Account"
              color="amber"
              separator
              v-model="select"
              :options="options"
            />
        </div>
        <q-input class="q-pa-sm" type="number" dark v-model="zixiusername" color="yellow" float-label="Amount"/>
        <q-input class="q-pa-sm" type="text" dark v-model="zixiusername" color="yellow" float-label="Zixipay Username"/>
        <q-input class="q-pa-sm" type="password" dark v-model="zixipassword" color="yellow" float-label="Zixipay Password"/>
        <div class="q-pa-lg">
          <span class='float-left'>
            <q-btn outline rounded @click="$router.push({path: 'wallet'})">{{ $t('WalletManager.cancel') }}</q-btn>
          </span>
          <span class='float-right'>
            <q-btn color="yellow" outline rounded @click="$router.push({path: 'wallet'})">Get VTX</q-btn>
          </span>
        </div>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      lazy: [],
      zixiusername: '',
      zixipassword: '',
      select: 'USD',
      options: [
        {
          label: 'USD: 10,021',
          value: 'USD'
        },
        {
          label: 'EUR: 12,120',
          value: 'EUR'
        },
        {
          label: 'BTC: 12',
          value: 'BTC'
        },
        {
          label: 'ETH: 134',
          value: 'ETH'
        }
      ]
    }
  }
}
</script>

<style>
</style>
