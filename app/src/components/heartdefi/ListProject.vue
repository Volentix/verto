<template>
  <div class="resp-container">
  <div class="text-h6 text-bold q-pl-md">Submit your project using this form</div>
    <div id="hubspotForm" class="q-pa-md"></div>
  </div>
</template>
<style>
  .resp-container {
    position: relative;
    overflow: hidden;
    max-width: 600px;
  }
  .resp-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important ;

    border: 0;
  }
</style>
<script>
export default {
  name: 'MyLayout',

  data () {
    return {
      submitted: false
    }
  },
  computed: {},
  created () {},
  methods: {
    resizeIframe (obj) {
      obj.style.height =
        obj.contentWindow.document.documentElement.scrollHeight + 'px'
    },
    resetForm () {
      this.submitted = false
    }
  },
  mounted () {
    const script = document.createElement('script')
    script.src = 'https://js-eu1.hsforms.net/forms/shell.js'
    document.body.appendChild(script)
    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: 'eu1',
          portalId: '25042879',
          formId: 'f11db571-ce5d-4eb8-a19e-ae0275a5add2',
          target: '#hubspotForm'
        })
      }
    })
  }
}
</script>
<style>
  #hubspotForm {
    color: #CCC !important;
  }
</style>
