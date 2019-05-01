<template>
  <div class="flex fit flex-center q-pa-sm">
    &nbsp;
    <q-dialog v-model="modal" minimized ref="modalRef">
      <div style="padding: 50px" class="text-center">
        <div class="text-h4 q-mb-md">{{ $t('KycAlreadyAssociated.header') }}</div>
        <div class="q-pa-sm">
          {{ $t('KycAlreadyAssociated.first_p') }}
        </div>
        <div class="q-pa-sm">
          <q-btn outline rounded  @click="ok">OK</q-btn>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
// import EventBus from '../../bus'
// import { setInterval } from 'timers'

export default {
  data () {
    return {
      modal: true
    }
  },
  mounted () {
  },
  methods: {
    ok: function () {
      this.$router.push({ path: '/wallet' })
    }
  }
}
</script>

<style>
</style>
