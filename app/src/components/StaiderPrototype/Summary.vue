<template>
  <div class="main-footer">
    <div class="container">
      <div class="row">
        <h2 class="text-white">Summary</h2>
        <h2 class="text-white">Summary</h2>
        <h2 class="text-white">Summary</h2>
        <h2 class="text-white">Summary</h2>
        <h2 class="text-white">Summary</h2>
        <h2 class="text-white">Summary</h2>
        <h2 class="text-white">Summary</h2>
        <h2 class="text-white">Summary</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      footerNav1: [
        { to: '/faq', title: 'FAQ' },
        { to: '/documentation', title: 'Documentation' },
        { to: '/volentix-dae', title: 'Volentix DAE' },
        { to: '/roadmap', title: 'Roadmap' },
        { to: '/exchanges', title: 'Exchanges' }
      ],
      footerNav2: [
        { to: '/team', title: 'Team' },
        { to: '/advisors', title: 'Advisors' },
        { to: '/affiliated-resources', title: 'Affiliated Resources' }
      ],
      footerNav3: [
        { to: '/verto-wallet', title: 'Verto wallet' },
        { to: '/vdex', title: 'vDex' },
        { to: '/nodes', title: 'Nodes' },
        { to: '/vtx-token', title: 'VTX token' }
      ],
      footerNav4: [
        { to: '/blog', title: 'Blog' },
        { to: '/about', title: 'About' },
        { to: '/in-the-media', title: 'In the media' }
      ],
      footerNav: [
        { to: '/privacy-policy', title: 'Privacy Policy' },
        { to: '/terms-of-Use', title: 'Terms of Use' },
        { to: '/cookie-preferences', title: 'Cookie Preferences' }
      ]
    }
  },
  mounted () {
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  @import "assets/styles/staider_theme/helpers.scss";
  .main-footer{
    margin-top: 0px;
    .h_line{
      position: relative;
      top: 5px;
    }
  }
  .main-logo{
    img {
      width: 31px;
      @media screen and (max-width: 768px) {
        width: 41px;
        margin-left: 20px;
      }
    }
    p{
      font-size: 14px;
      font-family: $MainFont;
      font-weight: 200;
      max-width: 250px;
    }
  }
  .footer-nav{
    ul{
      list-style: none;
      @media screen and (max-width: 768px) {
        padding: 0px;
        padding-left: 10px;
      }
      a{
        font-size: 14px;
        font-family: $MainFont;
        font-weight: 300;
        line-height: 30px;
        color: #FFF;
        text-decoration: none;
        padding: 5px 15px;
      }
    }
  }
  .copyrights{
    font-size: 14px;
    font-family: $MainFont;
    font-weight: 300;
    border-top: 1px solid rgba(white, .1);
    margin-top: 30px;
    padding-top: 30px;
    padding-bottom: 20px;
    p{
      @media screen and (max-width: 768px) {
        text-align: center;
        padding-left: 20px;
        padding-right: 20px;
        line-height: 30px;
      }
    }
    ul{
      list-style: none;
      margin: 0px;
      @media screen and (max-width: 768px) {
        padding: 0px;
        padding-left: 10px;
        padding-right: 10px;
      }
      a{
        font-size: 14px;
        font-family: $MainFont;
        font-weight: 300;
        line-height: 30px;
        color: #FFF;
        text-decoration: none;
        padding: 5px 15px;
      }
    }
    a{
      text-decoration: none;
      color: #3F75F2;
      font-size: 14px;
      font-family: $MainFont;
      font-weight: 400;
    }
  }
  .socialmedia{
    @media screen and (max-width: 768px) {
      border-top: 1px solid rgba(white, .1);
    }
  }
</style>
