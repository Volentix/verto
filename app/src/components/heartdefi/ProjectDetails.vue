<template>
  <div class="q-ma-lg projects">
     <q-breadcrumbs gutter="sm">
      <template v-slot:separator>
        <q-icon
          size="1.5em"
          name="chevron_right"
          color="primary"
        />
      </template>
      <q-breadcrumbs-el :to="'/account/'+($store.state.currentwallet.user ?  $store.state.currentwallet.user.address : '')" label="Dashboard"  icon="home" />
      <q-breadcrumbs-el to="/projects" label="Projects"  icon="pages" />
      <q-breadcrumbs-el :label="projectData.title"  :icon="'img:'+projectData.icon" />
    </q-breadcrumbs>
    <div>
      <article class="item-pane" style="align-items: flex-start;">
        <div class="item-preview">
          <q-img contain style="width: 200px" :src="projectData.icon" />
          <div class="pane__section">
            <div>
              <span class="text-bold text-body1">Chains</span><br />
              <div class="flex"> <img class="q-pr-sm" src="https://s2.coinmarketcap.com/static/img/coins/200x200/11145.png" height="20px" /> PulseChain</div>
            </div>
              <div>

              <span class="text-bold text-body1">Telegram</span><br />
              <span v-if=" projectData.telegram">
                    <a :href="projectData.telegram" target="_blank">
                     <div class="flex"><img class="q-pr-sm" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png" height="20px" /> Official
            </div>  </a>
            </span>
            <span v-else>N/A</span>
            </div>
             <div>

              <span class="text-bold text-body1">Youtube</span><br />
              <span v-if=" projectData.youtube">
                    <a href="https://www.youtube.com/c/LiquidLoans" target="_blank">
                     <div class="flex"><img class="q-pr-sm" src="https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png" height="20px" /> Official Channel
            </div>  </a>
            </span>
            <span v-else>N/A</span>
            </div>
              <div>
              <span class="text-bold text-body1">Twitter</span><br />   <span v-if=" projectData.twitter">
                    <a :href="projectData.twitter" target="_blank">
                     <div class="flex"><img class="q-pr-sm" src="https://www.vectorico.com/wp-content/uploads/2018/02/Twitter-Logo.png" height="20px" /> Official
            </div>  </a>
            </span>
            <span v-else>N/A</span>
            </div>

              <div>
              <span class="text-bold text-body1">Git repo</span><br />N/A
            </div>
          </div>
        </div>

        <div class="item-details">
          <div class="text-bold text-h4">{{ projectData.title }}</div>
          <span v-if="false" class="subtitle">Oscar Wilde</span>
          <div class="pane__section">
            <p>
              {{ projectData.description }}
            </p>
          </div>
          <div class="pane__section" v-if="false">
            <dl>
              <dt>Cover by</dt>
              <dd>
                <a
                  href="http://recoveringtheclassics.com/book/picture-of-dorian-gray/"
                  >Roberto Lanznaster</a
                >
              </dd>
              <dt>Format</dt>
              <dd>Paperback</dd>
              <dt>Publisher</dt>
              <dd>Penguin</dd>
              <dt>Published</dt>
              <dd>2008</dd>
              <dt>Edition</dt>
              <dd>N/A</dd>
              <dt>ISBN</dt>
              <dd>1234567890</dd>
            </dl>
          </div>
          <div class="pane__section clearfix" v-if="projectData.website && projectData.website.length">
            <a :href="projectData.website" target="_blank">
              <span class="item-price">
                {{projectData.website.replace('https://','http://')}}
              </span>
            </a>
            <a class="button buy-button" :href="projectData.website" target="_blank">
              Visit Website
            </a>
          </div>

          <div class="pane__section clearfix row q-col-gutter-md">
            <div  class="col-md-5">
              <ExchangeForm :hideForm="true"/>
               <iframe v-if="projectData.featuredVideo" height="200px" width="100%" class="col-md-12"  :src="'https://www.youtube.com/embed/'+projectData.featuredVideo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/>
            </div>
            <div class="col-md-7 rounded-borders q-pa-md">
              <CommentSection :feed="projectData"/>
            </div>

          </div>

        </div>
      </article>
    </div>
    <Projects :exclude="projectData.id" :is_page="false"/>
  </div>
</template>
<script>
import Projects from './Projects'
import ExchangeForm from './ExchangeForm.vue'
import CommentSection from './Feed/CommentSection.vue'
export default {
  props: ['data'],
  components: {
    Projects,
    ExchangeForm,
    CommentSection
  },
  created () {
    this.projectData = this.$store.state.settings.projects.find(o => o.id === this.$route.params.projectId)
    document.querySelector('.main-container-right').scrollTop = 0
  },
  watch: {
    '$route' (to, from) {
      this.projectData = this.$store.state.settings.projects.find(o => o.id === this.$route.params.projectId)
    }
  },
  data () {
    return {
      projectData: null
    }
  }
}
</script>
<style scoped>
.comment-section{
  border:1px solid rgb(207, 207, 207);
}
.projects {
    margin-top: -10px;
    }
.project-item {
  box-shadow: 1px 1px 20px #e01f0038;
  border-radius: 20px;
}
html,
body {
  font-family: Roboto, sans-serif;
  font-weight: 300;
  font-size: 16px;
}

body {
  background: #efefef;
}

.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
.pane__section > div{
margin-bottom: 10px;
}
.item-pane {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;

  margin: 26px auto;
  background: white;

  border-radius: 4px;
}

.item-preview {
  margin-right: 26px;
  padding: 26px;
}

.item-preview,
.item-details {
  flex-grow: 1;
}

.pane__section {
  padding-top: 26px;
}
.pane__section:not(:last-child) {
  padding-bottom: 26px;
  border-bottom: 1px solid #d4d4d4;
}

h1,
.item-price {
  font-family: "Roboto Slab", Roboto, sans-serif;
  font-weight: 400;
  font-size: 2em;
}

h1 {
  margin-bottom: 0.4em;
  margin-top: 0.4em;
}

.subtitle {
  font-family: "Roboto Slab", Roboto, sans-serif;
  font-weight: 300;
  font-size: 1.3em;
}

a {
  color: #0db5db;
}

.item-price__units {
  font-weight: 300;
}

p {
  line-height: 1.4;
}

.button {
  padding: 0.6em 1em;
  font-weight: 400;
  text-decoration: none;
  color: white;
  text-transform: uppercase;

      background: #ff0000;
    border-radius: 3px;
    border-radius: 10px;
    font-size: larger;
}
.button:hover {
  background: #5ed13c;
}

dl {
  -moz-columns: 2;
  columns: 2;
  line-height: 1.8em;
  margin: -0.4em 0;
}

dt,
dd {
  display: inline;
}

dt {
  font-weight: 500;
}
dt:after {
  content: ":";
}

dd:after {
  content: "";
  display: block;
}

.buy-button {
  float: right;
}

.book {
  position: relative;
  width: 216px;
  height: 322px;
  transform: rotateX(-15deg) rotateY(30deg);
  transform-style: preserve-3d;
  transition: transform 0.5s;
}
.book:before {
  content: "";
  position: absolute;
  right: 100%;
  top: 0;
  width: 35px;
  height: 100%;
  background: #f0c0af;
  transform-origin: top right;
  transform: rotateY(-90deg);
}
.book:after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  height: 35px;
  background: #f5efdc;
  transform-origin: bottom left;
  transform: rotateX(90deg);
}
.book:hover {
  transform: rotateX(-10deg) rotateY(20deg);
}
.book__title {
  margin-bottom: 1em;
  font-weight: 700;
}
.book__text {
  font-family: Roboto;
  background: #e9d1c5;
  padding: 20px;
  color: #563323;
}
</style>
