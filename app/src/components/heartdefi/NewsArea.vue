<template>
  <div class="news-area" v-if="loaded">
    <h3>News feed</h3>
    <div class="news-part">
      <blockquote class="twitter-tweet">
        <p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/Hex?src=hash&amp;ref_src=twsrc%5Etfw">#Hex</a> Breaking records -longest live chat in the history of <a href="https://twitter.com/hashtag/Twitter?src=hash&amp;ref_src=twsrc%5Etfw">#Twitter</a> <a href="https://twitter.com/hashtag/WorldRecord?src=hash&amp;ref_src=twsrc%5Etfw">#WorldRecord</a> <a href="https://t.co/39j2GA1apl">https://t.co/39j2GA1apl</a></p>&mdash; HEXICANSOLDIER (@lifeis2short01) <a href="https://twitter.com/lifeis2short01/status/1482862644927344642?ref_src=twsrc%5Etfw">January 16, 2022</a>
      </blockquote>
    </div>

    <div class="news_video">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/tgbNymZ7vqY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    <div class="news-part newsnews">
      <blockquote class="twitter-tweet">
        <p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/Hex?src=hash&amp;ref_src=twsrc%5Etfw">#Hex</a> Breaking records -longest live chat in the history of <a href="https://twitter.com/hashtag/Twitter?src=hash&amp;ref_src=twsrc%5Etfw">#Twitter</a> <a href="https://twitter.com/hashtag/WorldRecord?src=hash&amp;ref_src=twsrc%5Etfw">#WorldRecord</a> <a href="https://t.co/39j2GA1apl">https://t.co/39j2GA1apl</a></p>&mdash; HEXICANSOLDIER (@lifeis2short01) <a href="https://twitter.com/lifeis2short01/status/1482862644927344642?ref_src=twsrc%5Etfw">January 16, 2022</a>
      </blockquote>
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
      loaded: true
    }
  },
  watch: {

  },
  computed: {

  },
  created () {

  },
  mounted () {
    let twitterScript = document.createElement('script')
    twitterScript.src = 'https://platform.twitter.com/widgets.js'
    document.body.appendChild(twitterScript)
    twitterScript.addEventListener('load', () => {
      this.loaded = true
    })
  },
  methods: {

  },
  destroyed () {

  }

}
</script>
