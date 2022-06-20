<template>
  <div>
    <div class="words-order-wrapper">
      <div class="words-order-wrapper--list">
        <div class="words-order-wrapper--list__empty">
          <p class="text-body1" :class="{'text-white': $store.state.settings.lightMode === 'true'}">Choose the first and the last word from the precedent list. We just want to make sure you didn't forget to save it</p>
          <q-select  :set="valid = isChoiceInvalid(0, first)" :error="!valid.success && valid.message != null" :error-message="valid.message"  outlined class="q-pb-lg" v-model="first" :options="arrayAlphabericallyOrdered" label="Select the first word" />
          <q-select  :set="valid = isChoiceInvalid(arrayMnemonic.length - 1, last)" :error="!valid.success && valid.message != null"  :error-message="valid.message"  outlined v-model="last" :options="arrayAlphabericallyOrdered" label="Select the last word" />
          <ul v-if="false">
            <li v-for="(word, index) in arrayOrdered" :key="index">
              <q-input
                dark
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
        <div class="words-order-wrapper--list__random" v-if="false">
          <ul>
            <li v-for="(word, index) in arrayShuffled" :key="index">
              <q-input
                dark
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
      first: null,
      last: null,
      arrayShuffled: [],
      arrayOrdered: [],
      arrayAlphabericallyOrdered: [],
      arrayShuffleShow: [],
      arrayTest2: [],
      arrayTest3: []
    }
  },
  mounted () {
    this.arrayMnemonic = this.words.split(' ')
    this.arrayShuffled = [...this.arrayMnemonic]
    this.arrayAlphabericallyOrdered = this.arrayShuffled.sort()
    // this.shuffle(this.arrayShuffled)
  },
  computed: {
  },
  methods: {
    isChoiceInvalid (index, word) {
      let value = {
        success: false,
        message: null
      }
      if (word) {
        if (this.arrayMnemonic[index] === word) {
          value.success = true
        } else {
          value.message = word + ' is not the ' + (index === 0 ? 'first' : 'last') + ' word from your mnemonic'
        }

        if (this.arrayMnemonic[0] === this.first && this.arrayMnemonic[this.arrayMnemonic.length - 1] === this.last) {
          this.$store.commit('settings/rightOrder', true)
        } else {
          this.$store.commit('settings/rightOrder', false)
        }
      }

      return value
    },
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
      // justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 0px;
      border-bottom: 1px solid #F3F3F3;
      li{
        flex-basis: 31%;
        margin-bottom: 3%;
        margin-right: 2%;
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
            .q-field__label{
              top: 5px;
              font-size: 14px;
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

  /deep/ .q-field--focused .q-field__label {
  }

  /deep/ .q-field--outlined .q-field__control {
    background-color: #fff
  }

  /deep/ .q-field--outlined .q-field__control:after {
    border: 2px solid #E1E1E9;
    //background-color: #fff;
    //box-shadow: 0px 0px 10px 0px #E1E1E9;
  }

  /deep/ .q-field--outlined .q-field__control:before {
    border: 2px solid #E1E1E9;
    //background-color: #fff;
    //box-shadow: 0px 0px 10px 0px #E1E1E9;
  }

  /deep/ .q-field--outlined.q-field--focused .q-field__control:after {
    border: 2px solid #c4c4c6;
    //background-color: #fff;
    //box-shadow: 0px 0px 10px 0px #d4d4db;
  }

  /deep/ .q-field--outlined.q-field--focused .q-field__control:before {
    border: 2px solid #c4c4c6;
    //background-color: #fff;
    //box-shadow: 0px 0px 10px 0px #d4d4db;
  }

  /deep/ .q-field--dark:not(.q-field--focused) .q-field__label,
  /deep/ .q-field--dark .q-field__marginal,
  /deep/ .q-field--dark .q-field__bottom {
  }
}
</style>
