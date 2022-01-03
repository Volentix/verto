<template>
    <div class="how-it-work-main">
            <div class="container-fluid">
                <div class="wrapper">
                    <div class="tab-otr">
                        <h2 class="heading heading-h2">How to use Staider ?</h2>

                    </div>
                </div>
                <div class="row-custom-main">
                    <div id="tab-21" class="tab-content active">
                        <div class="row row-custom-inr">
                            <div class="col-lg-4 col-md-6 col-work-otr">
                                <div class="col-work-inr box-1">
                                    <div class="icon-otr">
                                        <i class="ri-wallet-line icon"></i>
                                    </div>
                                    <div class="content">
                                        <h4 class="heading heading-h4">Connect your wallet</h4>
                                        <p class="desc heading-S">Use Verto, Metamask or  any  wallet of choice with WalletConnect support. </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 col-work-otr">
                                <div class="col-work-inr box-2">
                                    <div class="icon-otr">
                                        <i class="ri-layout-grid-line icon"></i>
                                    </div>
                                    <div class="content">
                                        <h4 class="heading heading-h4">Choose a fund</h4>
                                        <p class="desc heading-S">Browse the list of funds available and select a fund to interact with</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 col-work-otr">
                                <div class="col-work-inr box-3">
                                    <div class="icon-otr">
                                        <i class="ri-archive-drawer-line icon"></i>
                                    </div>
                                    <div class="content">
                                        <h4 class="heading heading-h4">Deposit & withdraw</h4>
                                        <p class="desc heading-S">Invest and redeem your shares anytime. Monitor your investments
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="tab-22" class="tab-content">
                        <div class="row row-custom-inr">
                            <div class="col-lg-4 col-md-6 col-work-otr">
                                <div class="col-work-inr box-1">
                                    <div class="icon-otr">
                                        <i class="ri-wallet-line icon"></i>
                                    </div>
                                    <div class="content">
                                        <h4 class="heading heading-h4">Set up your wallet</h4>
                                        <p class="desc heading-S">Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the NFT Marketplace in the top right corner.....</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 col-work-otr">
                                <div class="col-work-inr box-2">
                                    <div class="icon-otr">
                                        <i class="ri-layout-grid-line icon"></i>
                                    </div>
                                    <div class="content">
                                        <h4 class="heading heading-h4">Create your collection</h4>
                                        <p class="desc heading-S">Click Create and set up your collection. Add social links, a description, profile &amp; banner images, and set.......</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 col-work-otr">
                                <div class="col-work-inr box-3">
                                    <div class="icon-otr">
                                        <i class="ri-archive-drawer-line icon"></i>
                                    </div>
                                    <div class="content">
                                        <h4 class="heading heading-h4">Add your NFTs</h4>
                                        <p class="desc heading-S">Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs with properties.....</p>
                                    </div>
                                </div>
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
<style scoped>
*,::after,::before{box-sizing:border-box;}
h2,h4{margin-top:0;margin-bottom:.5rem;font-weight:500;line-height:1.2;}
h2{font-size:calc(1.325rem + .9vw);}
@media (min-width:1200px){
h2{font-size:2rem;}
}
h4{font-size:calc(1.275rem + .3vw);}
@media (min-width:1200px){
h4{font-size:1.5rem;}
}
p{margin-top:0;margin-bottom:1rem;}
ul{padding-left:2rem;}
ul{margin-top:0;margin-bottom:1rem;}
::-moz-focus-inner{padding:0;border-style:none;}
.container-fluid{width:100%;padding-right:var(--bs-gutter-x,.75rem);padding-left:var(--bs-gutter-x,.75rem);margin-right:auto;margin-left:auto;}
.row{--bs-gutter-x:1.5rem;--bs-gutter-y:0;display:flex;flex-wrap:wrap;margin-top:calc(var(--bs-gutter-y) * -1);margin-right:calc(var(--bs-gutter-x) * -.5);margin-left:calc(var(--bs-gutter-x) * -.5);}
.row>*{flex-shrink:0;width:100%;max-width:100%;padding-right:calc(var(--bs-gutter-x) * .5);padding-left:calc(var(--bs-gutter-x) * .5);margin-top:var(--bs-gutter-y);}
@media (min-width:768px){
.col-md-6{flex:0 0 auto;width:50%;}
}
@media (min-width:992px){
.col-lg-4{flex:0 0 auto;width:33.33333333%;}
}
[class^="ri-"]{font-family:'remixicon'!important;font-style:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
.ri-archive-drawer-line:before{content:"\ea46";}
.ri-layout-grid-line:before{content:"\ee90";}
.ri-wallet-line:before{content:"\f2ae";}

.how-it-work-main{margin:128px 0;}
.how-it-work-main .container-fluid .wrapper{margin:0 0 32px 0;}
.how-it-work-main .container-fluid .wrapper .tab-otr{display:flex;align-items:center;}
@media (max-width: 767px){
.how-it-work-main .container-fluid .wrapper .tab-otr{flex-direction:column;align-items:flex-start;}
}
.how-it-work-main .container-fluid .wrapper .tab-otr .heading{color:#FFFFFF;margin:0 24px 0 0;}
@media (max-width: 767px){
.how-it-work-main .container-fluid .wrapper .tab-otr .heading{margin:0 0 24px 0;}
}
.how-it-work-main .container-fluid .wrapper .tab-otr .tab-inr{position:relative;}
.how-it-work-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul{position:absolute;left:0;top:80px;width:200px;border-radius:24px;background-color:#222F45;padding:16px 24px 20px 24px;opacity:0;visibility:hidden;transition:0.3s;z-index:10;}
.how-it-work-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul .tab-link{cursor:pointer;}
.how-it-work-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul .tab-link:not(:last-child){margin-bottom:12px;}
.how-it-work-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul .tab-link .tab-p{color:#FFFFFF;}
.how-it-work-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul .active .tab-p{color:#019DEA;}
.how-it-work-main .container-fluid .row-custom-main .tab-content{display:none;opacity:0;transform:translateY(15px);-webkit-animation:fadeIn 0.3s ease 1 forwards;animation:fadeIn 0.3s ease 1 forwards;}
.how-it-work-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-work-otr .col-work-inr{background-color:rgba(255, 255, 255, 0.05);border-radius:16px;padding:28px 32px 24px 32px;}
.how-it-work-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-work-otr .col-work-inr .icon-otr{display:flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:100%;background-color:rgba(255, 255, 255, 0.05);}
.how-it-work-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-work-otr .col-work-inr .icon-otr .icon{font-size:32px;color:#FFFFFF;}
.how-it-work-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-work-otr .col-work-inr .content .heading{color:#FFFFFF;margin:16px 0 12px 0;}
.how-it-work-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-work-otr .col-work-inr .content .desc{color:#B7B7B7;}
@media (max-width: 991px){
.how-it-work-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-work-otr .box-1,.how-it-work-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-work-otr .box-2{margin:0 0 24px 0;}
}
.how-it-work-main .container-fluid .row-custom-main .active{display:block;opacity:1;}
*,*:before,*:after{box-sizing:inherit;}
ul,li{list-style:none;margin:0;padding:0;}
h2,h4,p{margin:0px;padding:0px;}
.container-fluid{padding:0 50px;}
@media (max-width: 991px){
.container-fluid{padding:0 15px;}
}
.heading-h2{font-size:40px;line-height:72px;font-family:"Montserrat-Bold";}
@media (max-width: 575px){
.heading-h2{font-size:32px;line-height:48px;}
}
.heading-h4{font-size:24px;line-height:40px;font-family:"Montserrat-Bold";}
@media (max-width: 575px){
.heading-h4{font-size:20px;line-height:36px;}
}
.heading-S{font-size:16px;line-height:28px;font-family:"Poppins-Regular";}
.heading-SB{font-size:16px;line-height:28px;font-family:"Poppins-Medium";}
</style>
