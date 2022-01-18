<template>
    <div class="q-pa-md q-pb-xl">
        <q-card class="q-mb-md "
            flat
            v-for="(path, index) in paths" :key="index"
        >
            <q-list bordered separator class=" bg-white">
                <q-item>
                    <q-item-section>
                        <q-item-label lines="1">

                          <q-avatar size="sm"  style="20px" class="q-mr-sm">
                                    <img :src="path.icon" />
                                    </q-avatar>   {{paths[index].fromAmount}}  {{ path.fromToken.toUpperCase() }}
                            <q-icon class="float-right q-mt-xs" name="arrow_forward_ios" />
                        </q-item-label>

                    </q-item-section> <q-item-section side>
                         <q-item-label lines="1">

                          <q-avatar size="sm"  style="20px" class="q-mr-sm">
                                    <img :src="destinationCoin.image" />
                                    </q-avatar>   {{formatNumber(paths[index].toAmount, 2)}}  {{ path.toToken.toUpperCase() }}

                        </q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="false">
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
                    <q-item-section >
                       <img width="60px" :src="path.dexLogo" />
                    </q-item-section>

                    <q-item-section side>
                        <q-btn  rounded outline color="primary"  @click="setPathTransaction(path)">
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
