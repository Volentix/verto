<template>
<div>

  <div class="myportofolio-area">
    <div class="myportofolio-left">
      <h2 class="title">My Portofolio</h2>
    </div>
    <div class="myportofolio-right">
      <ul>
        <li><a href="" @click.prevent=""><i class="fas fa-chevron-left"></i></a></li>
        <li><a href="" @click.prevent=""><i class="fas fa-chevron-right"></i></a></li>
      </ul>
    </div>
  </div>
  <div class="bitcoin-area">
    <div class="bitcoin-part row q-col-gutter-md">
      <div class="bitcoin-part_a col-md-4" v-for="item in 6" :key="item">
        <div class="bitcoin-parta">
          <div class="bitcoin-part_a1">
            <img src="img/Ethereum-ETH-icon.png" alt="images not found" />
          </div>
          <div class="bitcoin-part_a2">
            <p><span>BTC</span>/BIDR</p>
            <h5>Bitcoin</h5>
          </div>
          <div class="bitcoin-part_a3">
            <h5>$145,25</h5>
            <p><span><i class="fas fa-caret-down"></i></span>$0,4(47%)</p>
          </div>
        </div>
      </div>

    </div>
  </div>
    </div>
</template>

<script>
export default {

}
</script>
