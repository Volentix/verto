<template>
      <div class="iframe-container">
        <iframe src="https://pulseramp.com/#/bridge" id="bridge" width="100%" />
        </div>
</template>
<script>
export default {

}
</script>
<style scoped>
.css-l2dx2i {
    visibility: hidden;
}
.iframe-container {
    margin-top: -40px;
}
  .iframe-container {
    position: relative;
    overflow: hidden;
    padding-top: 56.25%;
     height: 100vh !important;
}
.iframe-container iframe {
    position: absolute;
    top: 0;
    border: 0;
    height: 100%;
    width: 100%;
}
</style>
