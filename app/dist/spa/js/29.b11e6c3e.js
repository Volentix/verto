(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[29],{"3f2c":function(e,t,a){"use strict";var r=a("92a8"),s=a.n(r);s.a},4570:function(e,t,a){"use strict";a.r(t);var render=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-page",{class:e.$q.screen.width>1024?"desktop-marg":"mobile-pad"},[e.$q.screen.width>1024?a("div",{staticClass:"desktop-version"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col col-md-3"},[a("div",{staticClass:"wallets-container"},[a("profile-header",{staticClass:"marg",attrs:{isMobile:!1,version:"type2222",fetchCurrentWalletFromState:!0}}),a("wallets",{attrs:{isMobile:!1,showWallets:!1,isWalletsPage:!1,isWalletDetail:!1}})],1)]),a("div",{staticClass:"col col-md-9"},[a("div",{staticClass:"desktop-card-style apps-section q-mb-sm"},[a("div",{staticClass:"standard-content"},[a("div",{staticClass:"standard-content--body"},[a("div",{staticClass:"standard-content--body__form"},[a("div",{staticClass:"chain-tools-wrapper"},[a("div",{staticClass:"chain-tools-wrapper--list open"},[a("div",{staticClass:"list-wrapper"},[a("div",{staticClass:"list-wrapper--chain__eos-to-vtx-convertor"},[a("q-card",{staticStyle:{width:"100%","max-width":"700px"},attrs:{flat:""}},[a("q-inner-loading",{attrs:{visible:e.spinnervisible}},[a("q-spinner",{attrs:{size:"50px",color:"primary"}})],1),a("q-stepper",{ref:"stepper",staticClass:"q-pb-md",attrs:{vertical:"","alternative-labels":"",animated:""},model:{value:e.step,callback:function(t){e.step=t},expression:"step"}},[a("q-step",{staticClass:"  ",attrs:{default:"",name:1,done:e.step>1,title:"Buy / CPU"}},[a("q-card-section",[a("div",{staticClass:"  text-uppercase"},[a("q-item",{},[a("q-item-section",{staticClass:"col-auto"},[a("q-chip",{staticClass:"shadow-1",attrs:{dense:"",color:e.currentProxy?"deep-purple-14":"gray"}},[e._v(" ")])],1),a("q-item-label",{staticClass:"col-6 text-left"},[e._v("Current Staking Proxy: "+e._s(e.currentProxy))])],1),a("q-item",{},[a("q-item-section",{staticClass:"col-auto"},[a("q-chip",{staticClass:"shadow-1",attrs:{dense:"",color:e.stakedAmount?"deep-purple-14":"gray"}},[e._v(" ")])],1),a("q-item-label",{staticClass:"col-6 text-left"},[e._v("Staked EOS: "+e._s(e.stakedAmount))])],1),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{tag:"label"}},[a("q-item-section",[a("q-item-label",[e._v("Proxy to EOS Nation for an APR of "+e._s(e.apr)+"%")]),a("q-item-label",{attrs:{caption:""}},[e._v("APR is calculated at the time of claim and is subject to change based on the amount of EOS proxied.")])],1),a("q-item-section",{attrs:{side:""}},[a("q-toggle",{attrs:{"checked-icon":"check",color:"deep-purple-14","unchecked-icon":"clear","keep-color":""},model:{value:e.proxyModel,callback:function(t){e.proxyModel=t},expression:"proxyModel"}})],1)],1),e.stakedAmount<1.5?a("p",{staticClass:"text-red q-pt-sm"},[e._v(" Your need 1.5 STAKED EOS minimum to proceed ")]):e._e(),a("div",{directives:[{name:"show",rawName:"v-show",value:e.showNext,expression:"showNext"}],staticClass:"q-pa-sm"},[a("q-btn",{attrs:{label:"Next",disable:e.stakedAmount<1.5,color:"deep-purple-14"},on:{click:function(t){e.step=2}}})],1)],1)])],1),a("q-step",{staticClass:"  ",attrs:{default:"",name:2,done:e.step>2,title:"Portfolio"}},[a("q-card-section",[a("div",{staticClass:"  text-uppercase"},[a("q-item",{attrs:{tag:"label"}},[a("q-item-section",[a("q-item-label",[e._v("Select your rewards Portfolio %")]),a("q-item-label",{attrs:{caption:""}})],1)],1),a("q-list",{attrs:{dense:""}},e._l(e.rewards,(function(t,r){return a("q-item",{key:r},[a("q-item-section",[a("q-item-label",{attrs:{caption:""}},[a("q-badge",{staticClass:"q-mb-lg text-h7",attrs:{color:"deep-purple-14"}},[e._v("\n                         "+e._s(t.symbol.split(",")[1])+"\n                       ")])],1),a("q-slider",{attrs:{"label-value":e.rewards[r].value||"0%",min:0,max:100,step:5,color:"black",markers:"",label:"","label-always":""},on:{input:function(t){return e.monitor(r)}},model:{value:e.rewards[r].value,callback:function(t){e.$set(e.rewards[r],"value",t)},expression:"rewards[index].value"}})],1)],1)})),1),a("div",{staticClass:"q-pa-sm"},[a("q-btn",{attrs:{label:"Next",color:"deep-purple-14"},on:{click:function(t){return e.formatRewards()}}}),a("q-icon",{attrs:{name:"keyboard_arrow_up",size:"3rem",color:"black"},on:{click:function(t){e.step=e.step-1}}})],1)],1)])],1),a("q-step",{staticClass:"  ",attrs:{default:"",name:3,done:e.step>3,title:"Compound"}},[a("q-card-section",[a("div",{staticClass:"  text-uppercase"},[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{tag:"label"}},[a("q-item-section",[a("q-item-label",[e._v("Compound your vote staking rewards")]),a("q-item-label",{attrs:{caption:""}},[e._v("You can choose to receive your EOS rewards already staked")])],1),a("q-item-section",{attrs:{side:""}},[a("q-toggle",{attrs:{"checked-icon":"check",color:"deep-purple-14","unchecked-icon":"clear","true-value":1,"false-value":0,"keep-color":""},model:{value:e.staked,callback:function(t){e.staked=t},expression:"staked"}})],1)],1),a("div",{staticClass:"q-pa-sm"},[a("q-btn",{attrs:{label:e.$store.state.currentwallet.wallet.privateKey?"Submit":"Next",color:"deep-purple-14"},on:{click:function(t){e.$store.state.currentwallet.wallet.privateKey?e.voteProxy():e.step=4}}}),a("q-icon",{attrs:{name:"keyboard_arrow_up",size:"3rem",color:"black"},on:{click:function(t){e.step=e.step-1}}})],1)],1)])],1),e.$store.state.currentwallet.wallet.privateKey?e._e():a("q-step",{staticClass:"  ",attrs:{default:"",name:4,done:e.step>4,title:"Sign & Submit"}},[a("q-card-section",[a("div",{staticClass:"  text-uppercase"},[a("q-item-section",[a("q-item-label",[e._v("Enter your private key password to sign the transaction")])],1),a("div",{staticClass:"q-pa-md"},[a("q-input",{attrs:{dark:"",color:"deep-purple-14",label:"Private Key Password",debounce:"500",error:e.invalidPrivateKeyPassword,"error-message":"The password is incorrect",type:e.isPwd?"password":"text"},on:{input:e.checkPrivateKeyPassword},scopedSlots:e._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:e.isPwd?"visibility_off":"visibility"},on:{click:function(t){e.isPwd=!e.isPwd}}})]},proxy:!0}],null,!1,3635466494),model:{value:e.privateKeyPassword,callback:function(t){e.privateKeyPassword=t},expression:"privateKeyPassword"}})],1),a("div",{directives:[{name:"show",rawName:"v-show",value:e.privateKey.success,expression:"privateKey.success"}],staticClass:"q-pa-sm"},[a("q-btn",{attrs:{label:"Submit",color:"deep-purple-14"},on:{click:function(t){return e.voteProxy()}}}),a("q-icon",{attrs:{name:"keyboard_arrow_up",size:"3rem",color:"deep-purple-14"},on:{click:function(t){e.step=e.step-1}}})],1)],1)])],1),a("q-step",{staticClass:"  ",attrs:{default:"",name:5,done:e.step>5,title:"Result"}},[a("q-card-section",[a("div",{staticClass:"  text-uppercase"},[a("q-inner-loading",{attrs:{visible:e.spinnervisible}},[a("q-spinner",{attrs:{size:"50px",color:"primary"}})],1),a("q-item-section",[a("q-item-label",[e._v("Processing the transaction")])],1),a("div",{directives:[{name:"show",rawName:"v-show",value:!e.voteError,expression:"!voteError"}],staticClass:"text-h6 text-uppercase text-deep-purple-14 q-pa-md"},[e._v("\n               "+e._s(e.SuccessMessage)+"\n             ")]),a("div",{directives:[{name:"show",rawName:"v-show",value:e.voteError,expression:"voteError"}],staticClass:"text-h6 text-uppercase text-red q-pa-md"},[e._v("\n               "+e._s(e.ErrorMessage)+"\n             ")])],1)])],1)],1),e._e()],1)],1)])])])])])])])])])]):e._e()])},r=[],s=(a("28a5"),a("967e")),n=a.n(s),i=(a("7f7f"),a("96cf"),a("fa84")),o=a.n(i),c=a("8778"),l=a("5cea"),p=a("23bd"),u=a("e298"),d=new l["a"],v={components:{ProfileHeader:p["a"],Wallets:u["a"]},data:function data(){return{step:1,apr:0,rewards:[],proxyRewards:"",proxyPercentages:"",voteError:!1,ErrorMessage:null,SuccessMessage:null,invalidPrivateKeyPassword:!1,privateKey:{success:null},voted:!1,valid:!0,spinnervisible:!1,isPwd:!0,staked:1,proxy:null,proxyModel:!1,proxies:[],stakedAmount:null,currentProxy:0,account:null,privateKeyPassword:null}},computed:{showNext:function showNext(){return!(!this.voted&&!this.proxyModel)}},created:function created(){this.eosbalance=this.$route.params.eosbalance,this.hasPrivateKeyInWallet=this.$store.state.currentwallet.wallet.privateKeyEncrypted},mounted:function mounted(){var e=this;return o()(n.a.mark((function _callee(){var t,a,r;return n.a.wrap((function _callee$(s){while(1)switch(s.prev=s.next){case 0:return e.walletName=e.$store.state.currentwallet.wallet.name,s.next=3,d.getAccount(e.walletName);case 3:return e.account=s.sent,e.account.voter_info&&(e.stakedAmount=+e.account.voter_info.staked/1e4,e.currentProxy=e.account.voter_info.proxy),s.next=8,e.getRewards();case 8:return e.rewards=s.sent,e.rewards[0].value=100,s.next=12,e.getVoter();case 12:return t=s.sent,t[0].owner===e.walletName&&(e.voted=!0,e.proxyModel=!0),s.next=16,e.getAPR();case 16:return a=s.sent,a.forEach((function(t){0===t.paused&&(e.apr+=t.rate/100)})),s.next=20,e.getProxies();case 20:r=s.sent,r.forEach((function(t){1===t.active&&(e.proxy=t.proxy)}));case 22:case"end":return s.stop()}}),_callee)})))()},methods:{monitor:function monitor(e){var t=0;this.rewards.forEach((function(e){e.value&&(t+=e.value)}));while(t>100)for(var a=0;this.rewards.length;a++)if(a!==e&&this.rewards[a].value>0){this.rewards[a].value-=5,t-=5;break}while(t<100)this.rewards[0].value+=5,t+=5},formatRewards:function formatRewards(){var e=this;return o()(n.a.mark((function _callee2(){var t,a;return n.a.wrap((function _callee2$(r){while(1)switch(r.prev=r.next){case 0:t=[],a=[],e.rewards.forEach((function(e){e.value&&(t.push(100*e.value),a.push(e.symbol.split(",")[1]))})),e.proxyPercentages=t,e.proxyRewards=a,e.step=3;case 6:case"end":return r.stop()}}),_callee2)})))()},stakeNext:function stakeNext(){var e=this;return o()(n.a.mark((function _callee3(){return n.a.wrap((function _callee3$(t){while(1)switch(t.prev=t.next){case 0:e.voted&&!e.proxyModel||(e.voted||e.proxyModel)&&(e.step=2);case 1:case"end":return t.stop()}}),_callee3)})))()},getAPR:function getAPR(){return o()(n.a.mark((function _callee4(){var e;return n.a.wrap((function _callee4$(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,d.getTable("proxy4nation","proxy4nation","settings");case 3:return e=t.sent,t.abrupt("return",e);case 7:t.prev=7,t.t0=t["catch"](0),Object(c["b"])(t.t0.message);case 10:case"end":return t.stop()}}),_callee4,null,[[0,7]])})))()},getVoter:function getVoter(){var e=this;return o()(n.a.mark((function _callee5(){var t;return n.a.wrap((function _callee5$(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,d.getTable("proxy4nation","proxy4nation","voters",e.walletName,"1");case 3:return t=a.sent,a.abrupt("return",t);case 7:a.prev=7,a.t0=a["catch"](0),Object(c["b"])(a.t0.message);case 10:case"end":return a.stop()}}),_callee5,null,[[0,7]])})))()},getRewards:function getRewards(){return o()(n.a.mark((function _callee6(){var e;return n.a.wrap((function _callee6$(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,d.getTable("proxy4nation","proxy4nation","rewards");case 3:return e=t.sent,t.abrupt("return",e);case 7:t.prev=7,t.t0=t["catch"](0),Object(c["b"])(t.t0.message);case 10:case"end":return t.stop()}}),_callee6,null,[[0,7]])})))()},getProxies:function getProxies(){return o()(n.a.mark((function _callee7(){var e;return n.a.wrap((function _callee7$(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,d.getTable("proxy4nation","proxy4nation","proxies");case 3:return e=t.sent,t.abrupt("return",e);case 7:t.prev=7,t.t0=t["catch"](0),Object(c["b"])(t.t0.message);case 10:case"end":return t.stop()}}),_callee7,null,[[0,7]])})))()},checkPrivateKeyPassword:function checkPrivateKeyPassword(){var e=JSON.stringify(this.$store.state.currentwallet.wallet.privateKeyEncrypted);if(this.privateKey=this.$configManager.decryptPrivateKey(this.privateKeyPassword,e),!this.privateKey.success)return this.invalidPrivateKeyPassword=!0,!1;this.invalidPrivateKeyPassword=!1},voteProxy:function voteProxy(){var e=this;return o()(n.a.mark((function _callee8(){return n.a.wrap((function _callee8$(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,e.step=5,e.spinnervisible=!0,t.next=5,d.transact({actions:[{account:"eosio",name:"voteproducer",authorization:[{actor:e.walletName,permission:"active"}],data:{voter:e.walletName,proxy:e.proxy}},{account:"proxy4nation",name:"signup",authorization:[{actor:e.walletName,permission:"active"}],data:{owner:e.walletName,referral:"converttovtx"}},{account:"proxy4nation",name:"setstaked",authorization:[{actor:e.walletName,permission:"active"}],data:{owner:e.walletName,staked:e.staked}},{account:"proxy4nation",name:"setportfolio",authorization:[{actor:e.walletName,permission:"active"}],data:{owner:e.walletName,rewards:e.proxyRewards,percentages:e.proxyPercentages}}]},{keyProvider:e.privateKey.key});case 5:e.spinnervisible=!1,e.SuccessMessage="Congratulations, your transactions have been recorded on the blockchain.  Check back in 24h to see the rewards received on your account.",t.next=13;break;case 9:t.prev=9,t.t0=t["catch"](0),e.spinnervisible=!1;case 13:e.privateKey.key=null;case 14:case"end":return t.stop()}}),_callee8,null,[[0,9]])})))()},claimProxy:function claimProxy(){var e=this;return o()(n.a.mark((function _callee9(){var t,a;return n.a.wrap((function _callee9$(r){while(1)switch(r.prev=r.next){case 0:return t=JSON.stringify(e.$store.state.currentwallet.wallet.privateKeyEncrypted),a=e.$configManager.decryptPrivateKey(e.privateKeyPassword,t),r.prev=2,r.next=5,d.transact({actions:[{account:"proxy4nation",name:"claim",authorization:[{actor:e.walletName,permission:"active"}],data:{owner:e.walletName}}]},{keyProvider:a.key});case 5:r.next=10;break;case 7:r.prev=7,r.t0=r["catch"](2),Object(c["b"])(r.t0.message);case 10:case"end":return r.stop()}}),_callee9,null,[[2,7]])})))()}}},m=v,w=(a("3f2c"),a("2877")),h=Object(w["a"])(m,render,r,!1,null,"66c16d7e",null);t["default"]=h.exports},"92a8":function(e,t,a){}}]);