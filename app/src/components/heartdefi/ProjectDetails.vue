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
            <span class="item-price"
              >{{projectData.website.replace('https://','http://')}}</span
            ></a><a class="button buy-button" :href="projectData.website" target="_blank">Visit Website</a>
          </div>

            <div  class="pane__section clearfix row q-col-gutter-md">
            <div  class="col-md-5"><ExchangeForm :hideForm="true"/></div>
           <iframe v-if="projectData.featuredVideo" height="400px"  class="col-md-7"  :src="'https://www.youtube.com/embed/'+projectData.featuredVideo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

          </div>

        </div>
      </article>
    </div>
    <Projects :exclude="projectData.id" />
  </div>
</template>
<script>
import Projects from './Projects'
import ExchangeForm from './ExchangeForm.vue'
export default {
  props: ['data'],
  components: {
    Projects,
    ExchangeForm
  },
  created () {
    this.projectData = this.$store.state.settings.projects.find(o => o.id === this.$route.params.projectId)
    document.querySelector('.main-container-right').scrollTop = 0
  },
  watch: {
    '$route' (to, from) {
      this.projectData = this.$store.state.settings.projects.find(o => o.id === this.$route.params.projectId)
      document.querySelector('.main-container-right').scrollTop = 0
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
  background: url("data:image/png;base64,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");
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
