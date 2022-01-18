<template>
    <div class="faq-main">
            <div class="container-fluid">
                <div class="wrapper">
                    <div class="tab-otr">
                        <h2 class="heading heading-h2">Frequently Ask Question</h2>
                        <div class="tab-inr">

                            <ul class="tabs-ul">
                                <li class="tab-link tab10" data-tab="21">
                                    <p class="tab-p tab-10 heading-SB">Getting Started</p>
                                </li>
                                <li class="tab-link tab11" data-tab="22">
                                    <p class="tab-p tab-11 heading-SB">Artworks &amp; Creator</p>
                                </li>
                                <li class="tab-link tab12" data-tab="23">
                                    <p class="tab-p tab-12 heading-SB">Connect Wallet</p>
                                </li>
                                <li class="tab-link tab13" data-tab="24">
                                    <p class="tab-p tab-13 heading-SB">Create, Sell &amp; Connect</p>
                                </li>
                                <li class="tab-link tab14 active" data-tab="25">
                                    <p class="tab-p tab-14 heading-SB">Faqs</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="row-custom-main">

                    <div id="tab-25" class="tab-content active">
                        <div class="row row-custom-inr">
                            <div class="col-lg-6 col-otr">
                                <div class="col-inr">
                                    <div class="accordion" id="accordionExample1">

                                        <div class="accordion-item" v-for="item in 5" :key="item">
                                            <h2 class="accordion-header" id="headingOne">
                                                <button class="accordion-button heading-MB" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    Question {{item}} about staider
                                                </button>
                                            </h2>
                                            <div id="collapseOne" class="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample1" style="">
                                                <div class="accordion-body heading-S">
                                                   Answer {{item}} about staider
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-otr">
                                <div class="col-inr">
                                    <div class="accordion" id="accordionExample2">
   <div class="accordion-item" v-for="item in 5" :key="item">
                                            <h2 class="accordion-header" id="headingOne">
                                                <button class="accordion-button heading-MB" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    Question {{item}} about staider
                                                </button>
                                            </h2>
                                            <div id="collapseOne" class="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample1" style="">
                                                <div class="accordion-body heading-S">
                                                   Answer {{item}} about staider
                                                </div>
                                            </div>
                                        </div>
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
h2{margin-top:0;margin-bottom:.5rem;font-weight:500;line-height:1.2;}
h2{font-size:calc(1.325rem + .9vw);}
@media (min-width:1200px){
h2{font-size:2rem;}
}
p{margin-top:0;margin-bottom:1rem;}
ul{padding-left:2rem;}
ul{margin-top:0;margin-bottom:1rem;}
button{border-radius:0;}
button:focus:not(:focus-visible){outline:0;}
button{margin:0;font-family:inherit;font-size:inherit;line-height:inherit;}
button{text-transform:none;}
[type=button],button{-webkit-appearance:button;}
::-moz-focus-inner{padding:0;border-style:none;}
.container-fluid{width:100%;padding-right:var(--bs-gutter-x,.75rem);padding-left:var(--bs-gutter-x,.75rem);margin-right:auto;margin-left:auto;}
.row{--bs-gutter-x:1.5rem;--bs-gutter-y:0;display:flex;flex-wrap:wrap;margin-top:calc(var(--bs-gutter-y) * -1);margin-right:calc(var(--bs-gutter-x) * -.5);margin-left:calc(var(--bs-gutter-x) * -.5);}
.row>*{flex-shrink:0;width:100%;max-width:100%;padding-right:calc(var(--bs-gutter-x) * .5);padding-left:calc(var(--bs-gutter-x) * .5);margin-top:var(--bs-gutter-y);}
@media (min-width:992px){
.col-lg-6{flex:0 0 auto;width:50%;}
.col-lg-12{flex:0 0 auto;width:100%;}
}
.collapse:not(.show){display:none;}
.accordion-button{position:relative;display:flex;align-items:center;width:100%;padding:1rem 1.25rem;font-size:1rem;color:#212529;text-align:left;background-color:#fff;border:0;border-radius:0;overflow-anchor:none;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,border-radius .15s ease;}
@media (prefers-reduced-motion:reduce){
.accordion-button{transition:none;}
}
.accordion-button:not(.collapsed){color:#0c63e4;background-color:#e7f1ff;box-shadow:inset 0 -1px 0 rgba(0,0,0,.125);}
.accordion-button:not(.collapsed)::after{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%230c63e4'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");transform:rotate(-180deg);}
.accordion-button::after{flex-shrink:0;width:1.25rem;height:1.25rem;margin-left:auto;content:"";background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");background-repeat:no-repeat;background-size:1.25rem;transition:transform .2s ease-in-out;}
@media (prefers-reduced-motion:reduce){
.accordion-button::after{transition:none;}
}
.accordion-button:hover{z-index:2;}
.accordion-button:focus{z-index:3;border-color:#86b7fe;outline:0;box-shadow:0 0 0 .25rem rgba(13,110,253,.25);}
.accordion-header{margin-bottom:0;}
.accordion-item{background-color:#fff;border:1px solid rgba(0,0,0,.125);}
.accordion-item:first-of-type{border-top-left-radius:.25rem;border-top-right-radius:.25rem;}
.accordion-item:first-of-type .accordion-button{border-top-left-radius:calc(.25rem - 1px);border-top-right-radius:calc(.25rem - 1px);}
.accordion-item:not(:first-of-type){border-top:0;}
.accordion-item:last-of-type{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem;}
.accordion-item:last-of-type .accordion-button.collapsed{border-bottom-right-radius:calc(.25rem - 1px);border-bottom-left-radius:calc(.25rem - 1px);}
.accordion-item:last-of-type .accordion-collapse{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem;}
.accordion-body{padding:1rem 1.25rem;}

.faq-main{margin:128px 0;}
.faq-main .container-fluid .wrapper{margin:0 0 72px 0;}
.faq-main .container-fluid .wrapper .tab-otr{display:flex;align-items:center;}
@media (max-width: 767px){
.faq-main .container-fluid .wrapper .tab-otr{flex-direction:column;align-items:flex-start;}
}
.faq-main .container-fluid .wrapper .tab-otr .heading{color:#FFFFFF;margin:0 24px 0 0;}
@media (max-width: 767px){
.faq-main .container-fluid .wrapper .tab-otr .heading{margin:0 0 24px 0;}
}
.faq-main .container-fluid .wrapper .tab-otr .tab-inr{position:relative;}
.faq-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul{position:absolute;left:0;top:80px;width:250px;border-radius:24px;background-color:#222F45;padding:16px 24px 20px 24px;opacity:0;visibility:hidden;transition:0.3s;z-index:10;}
.faq-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul .tab-link{cursor:pointer;}
.faq-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul .tab-link:not(:last-child){margin-bottom:12px;}
.faq-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul .tab-link .tab-p{color:#FFFFFF;}
.faq-main .container-fluid .wrapper .tab-otr .tab-inr .tabs-ul .active .tab-p{color:#019DEA;}
.faq-main .container-fluid .row-custom-main .tab-content{display:none;opacity:0;transform:translateY(0);-webkit-animation:fadeIn 0.3s ease 1 forwards;animation:fadeIn 0.3s ease 1 forwards;}
.faq-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-otr .col-inr .accordion .accordion-item{border-radius:16px;border:2px solid #019DEA;background-color:rgba(255, 255, 255, 0.05);overflow:hidden;}
@media (max-width: 991px){
.faq-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-otr .col-inr .accordion .accordion-item{margin-bottom:24px;}
}
.faq-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-otr .col-inr .accordion .accordion-item:not(:last-child){margin:0 0 24px 0;}
.faq-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-otr .col-inr .accordion .accordion-item .accordion-header .accordion-button{background-color:rgba(255, 255, 255, 0.05);border-radius:16px;color:#FFFFFF;padding:16px 24px;border:none;box-shadow:none;}
.faq-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-otr .col-inr .accordion .accordion-item .accordion-header .accordion-button:focus{border-radius:16px 16px 0 0;border:none;box-shadow:none;}
.faq-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-otr .col-inr .accordion .accordion-item .accordion-header .accordion-button::after{flex-shrink:0;width:1.25rem;height:1.25rem;margin-left:auto;content:"";background-image:url(https://ethernal-blue.ansarians.com/assets/img/arrow-drop-down.svg);background-repeat:no-repeat;background-size:1.25rem;transition:transform 0.2s ease-in-out;}
.faq-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-otr .col-inr .accordion .accordion-item .accordion-collapse{transition:0.5s;}
.faq-main .container-fluid .row-custom-main .tab-content .row-custom-inr .col-otr .col-inr .accordion .accordion-item .accordion-collapse .accordion-body{padding:16px 24px 20px 24px;color:#B7B7B7;}
.faq-main .container-fluid .row-custom-main .active{display:block;opacity:1;}
*,*:before,*:after{box-sizing:inherit;}
ul,li{list-style:none;margin:0;padding:0;}
h2,p{margin:0px;padding:0px;}
.container-fluid{padding:0 50px;}
@media (max-width: 991px){
.container-fluid{padding:0 15px;}
}
.heading-h2{font-size:40px;line-height:72px;font-family:"Montserrat-Bold";}
@media (max-width: 575px){
.heading-h2{font-size:32px;line-height:48px;}
}
.heading-MB{font-size:18px;line-height:32px;font-family:"Poppins-Medium";}
.heading-S{font-size:16px;line-height:28px;font-family:"Poppins-Regular";}
.heading-SB{font-size:16px;line-height:28px;font-family:"Poppins-Medium";}
</style>
