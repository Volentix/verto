<template>
  <q-timeline color="secondary">
    <q-timeline-entry
      subtitle="Swaping 2 EOS to 100 VTX"
      avatar="https://files.coinswitch.co/public/coins/eos.png"
      color="deep-purple-12"
    >
      <div>
        <q-input
          v-if="transactionLink"
          :dark="$store.state.settings.lightMode === 'true'"
          :light="$store.state.settings.lightMode === 'false'"
          readonly
          class="input-input"
          rounded
          outlined
          color="purple"
          v-model="transactionLink"
        >
          <template v-slot:append>
            <div class="flex justify-end">
              <q-btn
                flat
                unelevated
                @click="copyToClipboard(transactionLink, 'Transaction link')"
                text-color="grey"
                round
                class="btn-copy"
                icon="o_file_copy"
              />
            </div>
          </template>
        </q-input>
        <span class="text-green q-pr-sm">Success:</span>
        <a
          v-if="transactionLink"
          :href="transactionLink"
          target="_blank"
          class="text-body2 q-pb-md text-black"
        >
          More info</a
        >
      </div>
    </q-timeline-entry>

    <q-timeline-entry
      subtitle="Swaping 100 VTX to 200 TPT"
      avatar="statics/icons/favicon-32x32.png"
      color="deep-purple-12"
    >
      <div>
        <q-input
          v-if="transactionLink"
          :dark="$store.state.settings.lightMode === 'true'"
          :light="$store.state.settings.lightMode === 'false'"
          readonly
          class="input-input"
          rounded
          outlined
          color="purple"
          v-model="transactionLink"
        >
          <template v-slot:append>
            <div class="flex justify-end">
              <q-btn
                flat
                unelevated
                @click="copyToClipboard(transactionLink, 'Transaction link')"
                text-color="grey"
                round
                class="btn-copy"
                icon="o_file_copy"
              />
            </div>
          </template>
        </q-input>
        <span class="text-green q-pr-sm">Success:</span>
        <a
          v-if="transactionLink"
          :href="transactionLink"
          target="_blank"
          class="text-body2 q-pb-md text-black"
        >
          More info</a
        >
      </div>
    </q-timeline-entry>

    <q-timeline-entry
      subtitle="Account creation"
      color="grey"
      icon="hourglass_empty"
    >
      <span>Processing</span><br />
      <q-spinner-dots color="primary" size="2em" />
      <div></div>
    </q-timeline-entry>

    <q-timeline-entry
      subtitle="Liquidity pools investment"
      color="grey"
      icon="hourglass_empty"
    >
      <q-spinner-dots color="primary" size="2em" />
    </q-timeline-entry>
  </q-timeline>
</template>
<script>
/*
const transactions = [
  {
    title: 'Swap ET to EOS',
    status: 'Pending',
    icon: '',
    object: '',
    tx_id: '',
    tx_object: {},
    fail_info: ''
  }
]
*/
export default {
  data () {
    return {
      transactionLink:
        'https://www.bloks.io/transaction/65893d0cdfa93287c7ead0fcac358c14f97b345f6f57df84ea1900582d06cc94'
    }
  }
}
</script>
<style scoped>
/deep/ img.q-timeline__dot-img {
  background: white;
}
.q-timeline__dot-img {
  border-radius: 0%;
}
</style>
