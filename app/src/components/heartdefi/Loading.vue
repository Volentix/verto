<template>
    <div class="wrapper flex  flex-center" >

    <div class="full-width topw">
  <div class="bg shadows-2">
    <div class="el"></div>
  </div>
  </div>
</div>
</template>
<script>
export default {

}
</script>
<style scoped lang="scss">
$loadingTime: 10s;
$color: rgb(255,0,0);
.wrapper {
height:100px
}
body {
  background-color: white;
}
.topw {
box-shadow: 0px 1px 5px rgb(171, 71, 186);
    width: 99% !important;
    margin: 0 auto;
    }
@keyframes loading {
  0% {
    width: 0;
  } 100% {
    width: 100%;
  }
}

@keyframes percentage {
  @for $i from 1 through 100 {
    $percentage: $i + "%";
    #{$percentage} {
      content: $percentage;
    }
  }
}

.bg {
  background-color: $color;
  animation: loading $loadingTime linear infinite;
      box-shadow: 5px 5px 10px #e01f00;
}

.el{
  color: $color;
  width: 100%;
  border: 1px solid $color;

  &:after {
    padding-left: 20px;
    content: "0%";
    display: block;
    text-align: center;
    font-size: 50px;
    padding: 10px 20px;
    color: rgb(0,255,255);
    mix-blend-mode: difference;
    animation: percentage $loadingTime linear infinite;
  }
}

html {
  height: 100%;
  background-color: white;
  font-family: 'PT Sans', sans-serif;
  font-weight: bold;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
