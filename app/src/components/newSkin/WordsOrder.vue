<template>
<div>
  <div class="words-order-wrapper">
    <div class="words-order-wrapper--list">
      <div class="words-order-wrapper--list__empty">
        <ul>
        <li v-for="(word, index) in wordsArray" :key="index">
        <q-input v-if="word !== ''" outlined round readonly class="qinput" v-model="text[index]"/>
        </li>
        </ul>
      </div>
      <div class="words-order-wrapper--list__random">
        <ul>
        <li v-for="(word, index) in wordsArray" :key="index">
        <q-input v-if="word !== ''" outlined round readonly class="qinput qoriginal" v-model="wordsArrayRandom[index]"/>
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
      wordsArray: [],
      wordsArrayRandom: [],
      text: []
    }
  },
  mounted () {
    this.wordsArray = this.words.split(' ')
    this.wordsArrayRandom = this.wordsArray
    // console.log('wordsArray', this.wordsArray)
  },
  methods: {
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
                        border-color: #00D0DF;
                    }
                    &.qoriginal{
                        border-color: #FFB200;
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
        }
        &__random{}
      }
    }
</style>
