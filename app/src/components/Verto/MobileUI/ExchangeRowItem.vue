<template>
    <div class="q-pa-md q-pb-xl">
        <q-card class="q-mb-md"
            v-for="(path, index) in paths"
            :key="index"
        >
            <q-list bordered separator class="rounded-borders bg-white">
                <q-item>
                    <q-item-section>
                        <q-item-label lines="1">
                            <q-input
                                flat
                                :dark="$store.state.settings.lightMode === 'true'"
                                v-model="paths[index].fromAmount"
                                style="max-width: 300px"
                            >
                                <template v-slot:before>
                                    <q-avatar>
                                    <img :src="path.icon" />
                                    </q-avatar>
                                </template>
                                <template v-slot:append>
                                    <span class="kwgTEs kwgTEs_navigate_next">
                                    {{ path.fromToken.toUpperCase() }}
                                    <q-icon name="navigate_next" />
                                    </span>
                                </template>
                            </q-input>
                        </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn  rounded color="primary"  @click="setPathTransaction(path)">
                            Buy {{ destinationCoin.value.toUpperCase() }}
                            <q-icon
                            flat
                            v-if="isPathInvalid(path)"
                            name="info"
                            class="q-pl-sm"
                            >
                            <q-tooltip>
                                {{ isPathInvalid(path) }}
                            </q-tooltip>
                            </q-icon>
                        </q-btn>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section avatar v-if="destinationCoin">
                        <q-img style="width: 20px" :src="destinationCoin.image" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label lines="1">
                            {{ formatNumber(path.toAmount, 5) }} {{ destinationCoin.value.toUpperCase() }}
                        </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <span  style="font-weight: 400">Your receive</span>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-item-label lines="1" class="text-bold"> {{ path.tokenPrice ? "$" + formatNumber(path.tokenPrice, 2) : "NAN" }}</q-item-label>
                        <q-item-label caption>{{ path.fromToken.toUpperCase() }} to USD </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <span >Chains: &nbsp; <span class="text-red">{{ path.txChainLabel }} </span></span>
                        <span >Exchange:&nbsp; <span class="dex_name"> {{path.dex}}</span> </span>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card>
        <p style="height: 40px;"> </p>
    </div>
</template>

<script>

export default {
  name: 'ExchangeItem',
  props: ['paths', 'formatNumber', 'destinationCoin', 'setPathTransaction', 'isPathInvalid'],
  data () {
    return {
      lightMode: true
    }
  },
  methods: {
  }

}
</script>

<style lang="scss" scoped>
</style>
