<template>
  <q-table
    flat
    :dark="$store.state.settings.lightMode === 'true'"
    title="Breakdown"
    :data="stakeData"
    :loading="stakeData.length == 0"
    :columns="columns"
  >
    <template v-slot:body-cell-index="props">
      <q-td :props="props">
        <q-btn
          dense
          outline
          size="sm"
          class="q-pa-xs"
          label="End stake"
          @click="$emit('getEndStakeEndingData', props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>
<script>
import Lib from '@/util/walletlib'
import Formatter from '@/mixins/Formatter'
export default {
  props: ['address'],
  mixins: [Formatter],
  data () {
    return {
      columns: [
        {
          name: 'start',
          align: 'center',
          label: 'Start',
          field: 'startDate'
        },

        { name: 'end', label: 'End', field: 'endDate' },
        {
          name: 'principal',
          label: 'Principal',
          field: 'principal',
          format: (val) => this.formatNumber(val, 0) + ' HEX'
        },
        {
          name: 'stakeshares',
          label: 'Shares',
          field: 'stakeshares',
          format: (val) => this.nFormatter2(val, 2)
        },
        {
          name: 'index',
          align: 'center',
          label: 'Ation',
          field: 'index'
        }
      ],
      stakeData: []
    }
  },
  async created () {
    this.stakeData = await Lib.getHexStakeData(this.address)
  }
}
</script>
<style scoped>
/deep/ th {
  font-weight: 700 !important;
}
/deep/ tr td:nth-child(3) {
  color: #fe5b52 !important;
}
/deep/ .q-table__title {
  font-size: 18px;
  font-weight: 700 !important;
}
</style>
