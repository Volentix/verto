<template>
  <q-page>
    <div class="page-wrapper dark-theme">
      <div class="section-sub-wrapper__inner-content" id="topsection">
        <div class="blog-holder">
          <div class="row">
            <div class="privacy-policy-section-wrapper text-white col col-12">
              <h2>Terms of Use</h2>
              <h4>About us</h4>
              <p>We are Staider LLC (“Staider”) and our office is in Georgia<br>
              STAIDER.FINANCE is a Staider site and application interface. Launched in 2021.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  components: {},
  // name: 'PageName',
  meta () {
    return {
      title: 'TERMS OF USE | Staider.finance',
      meta: {
        title: { name: 'title', content: 'TERMS OF USE | Staider.finance' },
        description: { name: 'description', content: 'Read about our TERMS OF USE here' },
        author: { name: 'author', content: 'VolentixLabs' },
        language: { name: 'language', content: 'En' },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },

        ogType: { property: 'og:type', content: 'website' },
        ogTitle: { property: 'og:title', content: 'TERMS OF USE | Staider.finance' },
        ogDescription: { property: 'og:description', content: 'Read about our TERMS OF USE here' },
        ogImage: { property: 'og:image', content: this.$url.web + '/statics/screens/page-home.jpg' },
        ogUrl: { property: 'og:url', content: this.$url.web + this.$route.path },
        // ogPhone_number: { property: 'og:phone_number', content: '' },

        twitterCard: { property: 'twitter:card', content: 'summary_large_image' },
        twitterUrl: { property: 'twitter:url', content: this.$url.web + this.$route.path },
        twitterTitle: { property: 'twitter:title', content: 'TERMS OF USE | Staider.finance' },
        twitterDescription: { property: 'twitter:description', content: 'Read about our TERMS OF USE here' },
        twitterImage: { property: 'twitter:image', content: this.$url.web + '/statics/screens/page-home.jpg' }
      }
    }
  },
  data () {
    return {
      content: ''
    }
  },
  async created () {
    // let self = this
    // this.ArticleName = this.$route.params.article
    // let privacyRawLink = `https://raw.githubusercontent.com/Volentix/blog/master/privacy/privacy-policy.md`
    // this.$axios.get(privacyRawLink)
    //   .then(artContent => {
    //     // let baseImgURL = 'https://github.com/Volentix/blog/raw/master/article/assets/verto_defi.png
    //     let baseImgURL = 'https://github.com/Volentix/blog/raw/master/article/'
    //     self.content = artContent.data.replace(/assets\//g, `${baseImgURL}assets/`)
    //   })
    this.scrollToSection('topsection')
  },
  methods: {
    scrollToSection (sectionScrollName) {
      // let sectionScrollName = this.$route.params.currentSection
      let scrollTop = 0
      setTimeout(() => {
        console.log('scrollToSection', sectionScrollName)
        try {
          document.querySelector('#' + sectionScrollName).classList.add('activate-animation')
          scrollTop = document.querySelector('#' + sectionScrollName).offsetTop
        } catch (error) {
          console.log(error.message)
        }
        document.querySelector('#scroll_area_wrapper .scroll').scrollTop = parseInt(scrollTop) + (scrollTop > 0 ? -120 : 0)
      }, 100)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  .page-wrapper{
    overflow: hidden;
    font-family: $MainFont;
    &.dark-theme{
      .section-sub-wrapper__inner-content{
        background: #000;
        padding-left: 5%;
        padding-right: 5%;
        @media screen and (max-width: 768px) {
          border-radius: 0px;
        }
        a{
          color: #FFF;
        }
      }
      .blog-holder .privacy-policy-section-wrapper {
        h2{
          font-size: 30px;
          font-weight: 700;
        }
        h4{
          font-size: 18px;
          font-weight: 900;
        }
        p{
          font-size: 14px;
          line-height: 30px;
        }
        h1,p, h3, h2, h4, h5, h6{
          color: #FFF;
        }
        ul,ol{
          li{
            color: #FFF;
          }
        }
      }
    }
    .section-sub-wrapper{
      &__inner-content{
        padding-top: 140px;
        font-family: $MainFont;
        font-weight: 400;
        position: relative;
        overflow: hidden;
        background: transparent radial-gradient(closest-side at 50% 50%, #FFFFFF 0%, #F6F7FA 74%, #EAECF2 100%) 0% 0% no-repeat padding-box;
        background-size: 100% !important;
        position: relative;
        // background-size: auto 160% !important;
        // background-position-x: 37% !important;
        @media screen and (max-width: 768px) {
            padding-top: 100px;
            border-radius: 0px 0px 60px 60px;
            overflow: hidden;
            position: relative;
        }
      }
    }
    .blog-holder{
      max-width: 1260px;
      margin: auto;
      margin-bottom: 100px;
      h1{
        font-family: $MainFont;
        font-weight: 400;
        font-size: 30px;
        text-align: center;
        margin: 0px 0px;
        letter-spacing: 2px;
        margin-bottom: 40px;
      }
      .privacy-policy-section-wrapper{
        // cursor: pointer;
          // box-shadow: 0px 10px 20px 0px rgba(black, .1);
          // border-radius: 10px;
          padding: 0px;
          // margin: 5% 3%;
          h1,h2,h3,h4,h5,h6{
            font-weight: 400;
            color: #FFF;
          }
          ul{
            padding: 0px;
            padding: 0px 23px;
            // height: 40px;
            overflow: hidden;
            // margin-top: -53px;
            li{
              color: #FFF;
              line-height: 25px;
            }
          }
          h1{
            font-family: $MainFont;
            font-weight: 400;
            font-size: 30px;
            text-align: left;
            margin: 0px 0px;
            letter-spacing: 2px;
            margin-bottom: 40px;
            color: #FFF;
          }
           img{
            width: auto;
            height: auto;
            max-width: 100%;
            // max-height: 180px;
            margin-bottom: 20px;
            margin-right: 20px;
            // float: left;
          }
           p{
            // padding: 15px 0px;
            // height: 260px;
            // overflow: hidden;
            font-size: 16px;
            font-family: $MainFont;
            font-weight: 400;
            text-align: justify;
            color: #FFF;
          }
          // br{
          //   display: none;
          // }

      }
    }
  }
</style>
