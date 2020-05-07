<template>
<div>
  <div class="words-order-wrapper">
    <div class="words-order-wrapper--list">
      <div class="words-order-wrapper--list__empty">
        <ul>
        <li v-for="(word, index) in arrayOrdered" :key="index"
          :class="{'d-none': arrayTest3[index] !== undefined}">
          <q-input
            v-show="arrayOrdered[index]"
            @click="chooseMe(word, index, false)"
            :class="{'qfilled': arrayTest3[index] !== undefined }"
            :label="word"
            outlined round readonly
            class="qinput"
            v-model="arrayTest3[index]"
          />
        </li>
        </ul>
      </div>
      <div class="words-order-wrapper--list__random">
        <ul>
        <li v-for="(word, index) in arrayShuffled"
          :key="index" :class="{'d-none': arrayTest2[index] !== undefined}">
          <q-input
            v-show="!arrayShuffleShow[index]"
            @click="chooseMe(word, index, true)"
            outlined round readonly
            class="qinput qoriginal"
            :label="word"
            v-model="arrayTest2[index]"
          />
        </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'WordsOrder',
  props: {
    words: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      arrayMnemonic: [],
      arrayShuffled: [],
      arrayOrdered: [],
      arrayShuffleShow: [],
      arrayTest2: [],
      arrayTest3: []
    }
  },
  mounted () {
    this.arrayMnemonic = this.words.split(' ')
    this.arrayShuffled = [...this.arrayMnemonic]
    this.shuffle(this.arrayShuffled)
  },
  computed: {
  },
  methods: {
    chooseMe (word, index, show) {
      if (show) {
        this.arrayOrdered.push(word)
        this.$set(this.arrayShuffleShow, index, show)
      } else {
        this.arrayOrdered = this.arrayOrdered.filter(e => e !== word)
        let unset = this.arrayShuffled.indexOf(word)
        this.$set(this.arrayShuffleShow, unset, show)
      }

      this.$set(this.arrayOrdered)

      let rightOrder = (JSON.stringify(this.arrayMnemonic) === JSON.stringify(this.arrayOrdered))
      this.$store.commit('settings/rightOrder', rightOrder)
    },
    shuffle (array) {
      var currentIndex = array.length, temporaryValue, randomIndex

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
    }
  }
}
</script>

<style scoped lang="scss">
    .words-order-wrapper{
      padding: 0px 0%;
      &--list{
        ul{
            list-style: none;
            padding: 0px;
            margin: 0px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 0px;
            border-bottom: 1px solid #F3F3F3;
            li{
                flex-basis: 26%;
                // margin-right: 3%;
                // margin-left: 3%;
                margin-bottom: 3%;
                .qinput{
                    width: auto;
                    height: 35px;
                    &.qfilled{
                        /deep/ .q-field__control{
                            border-color: #00D0DF;
                        }
                    }
                    &.qoriginal{
                        /deep/ .q-field__control{
                            border-color: #FFB200 !important;
                        }
                    }
                    /deep/ .q-field__control{
                        height: 30px;
                        border-radius: 30px !important;
                        border: 3px solid transparent;
                        box-sizing: content-box;
                        text-align: center;
                        .q-field__native{
                            text-align: center;
                        }
                    }
                }
            }
        }
        &__empty{
          li{
            &.d-none{
              display: none !important;
            }
          }
        }
        &__random{
          li{
            &.d-none{
              display: none !important;
            }
          }
        }
      }
    }
</style>
