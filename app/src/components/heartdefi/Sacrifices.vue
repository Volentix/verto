<template>
    <div class="q-ml-lg sacrifices">
      <q-breadcrumbs gutter="sm">
      <template v-slot:separator>
        <q-icon
          size="1.5em"
          name="chevron_right"
          color="primary"
        />
      </template>
      <q-breadcrumbs-el :to="'/account/'+$store.state.currentwallet.user.address" label="Dashboard"  icon="pages" />
      <q-breadcrumbs-el label="Sacrifice details"   />
    </q-breadcrumbs>
     <div v-if="$store.state.currentwallet.userData.pulseSac && $store.state.currentwallet.userData.pulseSac.txs" v-html="$store.state.currentwallet.userData.pulseSac.txs">
     </div>
    </div>
</template>
 <style>
.sacrifices .tim-icons{display:inline-block;font:normal normal normal 1em/1 'Nucleo';vertical-align:middle;speak:none;text-transform:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
.sacrifices .icon-minimal-left::before{content:"\ea34";}
.sacrifices hr{box-sizing:content-box;height:0;overflow:visible;}
.sacrifices h1, .sacrifices h4{margin-top:0;margin-bottom:0.5rem;}
.sacrifices p{margin-top:0;margin-bottom:1rem;}
.sacrifices a{color:#e14eca;text-decoration:none;background-color:transparent;-webkit-text-decoration-skip:objects;}
.sacrifices a:hover{color:#c221a9;text-decoration:none;}
.sacrifices table{border-collapse:collapse;}
.sacrifices th{text-align:inherit;}
.sacrifices h1, .sacrifices h4{margin-bottom:0.5rem;font-family:inherit;font-weight:400;line-height:1.2;color:#rgb(86 97 101);}
.sacrifices h1{font-size:1.6rem;}
.sacrifices h4{font-size:1.0625rem;}
.sacrifices hr{margin-top:2rem;margin-bottom:2rem;border:0;border-top:0.0625rem solid rgba(34, 42, 66, 0.1);}
.sacrifices .container{width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto;}
@media (min-width: 576px){
.sacrifices .container{max-width:540px;}
 }
@media (min-width: 768px){
.sacrifices .container{max-width:720px;}
 }
@media (min-width: 992px){
.sacrifices .container{max-width:960px;}
 }
@media (min-width: 1200px){
.sacrifices .container{max-width:1140px;}
 }
.sacrifices .row{display:flex;flex-wrap:wrap;margin-right:-15px;margin-left:-15px;}
.sacrifices .col-12, .sacrifices .col-sm-6,.sacrifices .col-sm-12,.sacrifices .col-md-6{position:relative;width:100%;min-height:1px;padding-right:15px;padding-left:15px;}
.sacrifices .col-12{flex:0 0 100%;max-width:100%;}
@media (min-width: 576px){
.sacrifices .col-sm-6{flex:0 0 50%;max-width:50%;}
.sacrifices .col-sm-12{flex:0 0 100%;max-width:100%;}
 }
@media (min-width: 768px){
.sacrifices .col-md-6{flex:0 0 50%;max-width:50%;}
 }
.sacrifices .table{width:100%;margin-bottom:1rem;background-color:transparent;}
.sacrifices .table th,.sacrifices .table td{padding:1rem;vertical-align:top;border-top:0.0625rem solid #e3e3e3;}
.sacrifices .table thead th{vertical-align:bottom;border-bottom:0.125rem solid #e3e3e3;}
.sacrifices .btn{display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;user-select:none;border:1px solid transparent;padding:11px 40px;font-size:0.875rem;line-height:1.35em;border-radius:0.25rem;transition:color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;}
@media screen and (prefers-reduced-motion: reduce){
.sacrifices .btn{transition:none;}
 }
.sacrifices .btn:hover,.sacrifices .btn:focus{text-decoration:none;}
.sacrifices .btn:focus{outline:0;box-shadow:0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);}
.sacrifices .btn:disabled{opacity:0.65;box-shadow:none;}
.sacrifices .btn-success{color:#ffffff;background-color:#00f2c3;border-color:#00f2c3;box-shadow:0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);}
.sacrifices .btn-success:hover{color:#ffffff;background-color:#00cca4;border-color:#00bf9a;}
.sacrifices .btn-success:focus{box-shadow:0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08), 0 0 0 0 rgba(0, 242, 195, 0.5);}
.sacrifices .btn-success:disabled{color:#ffffff;background-color:#00f2c3;border-color:#00f2c3;}
.sacrifices .btn-link{font-weight:400;color:#e14eca;background-color:transparent;}
.sacrifices .btn-link:hover{color:#c221a9;text-decoration:none;background-color:transparent;border-color:transparent;}
.sacrifices .btn-link:focus{text-decoration:none;border-color:transparent;box-shadow:none;}
.sacrifices .btn-link:disabled{color:#6c757d;pointer-events:none;}
.sacrifices .btn-sm{padding:5px 15px;font-size:0.75rem;line-height:1.35;border-radius:0.25rem;}
.sacrifices .d-inline{display:inline!important;}
.sacrifices .mb-3{margin-bottom:1rem!important;}
.sacrifices .pt-3{padding-top:1rem!important;}
.sacrifices .text-monospace{font-family:SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;}
.sacrifices .text-success{color:#00f2c3!important;}
.sacrifices .text-info{color:#e01f00!important;}
.sacrifices .text-muted{color:#6c757d!important;}
@media print{
.sacrifices *,.sacrifices *::before,.sacrifices *::after{text-shadow:none!important;box-shadow:none!important;}
.sacrifices thead{display:table-header-group;}
.sacrifices tr{page-break-inside:avoid;}
.sacrifices p{orphans:3;widows:3;}
.sacrifices .container{min-width:992px!important;}
.sacrifices .table{border-collapse:collapse!important;}
.sacrifices .table td,.table th{background-color:#ffffff!important;}
 }
.sacrifices .btn{border-width:2px;border:none;position:relative;overflow:hidden;margin:4px 1px;border-radius:0.4285rem;cursor:pointer;background:#344675;background-image:-webkit-linear-gradient(to bottom left, #344675, #263148, #344675);background-image:-o-linear-gradient(to bottom left, #344675, #263148, #344675);background-image:-moz-linear-gradient(to bottom left, #344675, #263148, #344675);background-image:linear-gradient(to bottom left, #344675, #263148, #344675);background-size:210% 210%;background-position:top right;background-color:#344675;transition:all 0.15s ease;box-shadow:none;color:#ffffff;}
.sacrifices .btn:active{box-shadow:none!important;transform:translateY(1px)!important;transition:all .15s ease;}
.sacrifices .btn:not([data-action]):hover{box-shadow:2px 2px 6px rgba(0, 0, 0, 0.4);transform:translateY(-1px);-webkit-transform:translateY(-1px);}
.sacrifices .btn.btn-link{color:#344675;}
.sacrifices .btn:active{box-shadow:none;outline:0!important;}
.sacrifices .btn:not(.btn-icon) .tim-icons{position:relative;top:-1px;}
.sacrifices .btn-success{background:#00f2c3;background-image:-webkit-linear-gradient(to bottom left, #00f2c3, #0098f0, #00f2c3);background-image:-o-linear-gradient(to bottom left, #00f2c3, #0098f0, #00f2c3);background-image:-moz-linear-gradient(to bottom left, #00f2c3, #0098f0, #00f2c3);background-image:linear-gradient(to bottom left, #00f2c3, #0098f0, #00f2c3);background-size:210% 210%;background-position:top right;background-color:#00f2c3;transition:all 0.15s ease;box-shadow:none;color:#ffffff;}
.sacrifices .btn-success:active{box-shadow:none!important;transform:translateY(1px)!important;transition:all .15s ease;}
.sacrifices .btn-success:not([data-action]):hover{box-shadow:2px 2px 6px rgba(0, 0, 0, 0.4);transform:translateY(-1px);-webkit-transform:translateY(-1px);}
.sacrifices .btn-success.btn-link{color:#00f2c3;}
.sacrifices .btn:disabled{opacity:0.5;filter:alpha(opacity=50);pointer-events:none;}
.sacrifices .btn-link:disabled,.btn-link:disabled:hover,.btn-link:disabled:focus,.btn-link:disabled:active{background:transparent;}
.sacrifices .btn-link{border:0;box-shadow:none;padding:0.5rem 0.7rem;background:transparent;color:#e3e3e3;font-weight:600;}
.sacrifices .btn-link:hover{box-shadow:none!important;transform:none!important;}
.sacrifices .btn-sm{font-size:0.875rem;border-radius:0.2857rem;padding:5px 15px;}
.sacrifices .btn{cursor:pointer;}
.sacrifices h1,.sacrifices  h4{line-height:1.2;}
.sacrifices p{font-weight:300;}
.sacrifices .btn-wrapper.mb-3 {
display: none;
 }
.sacrifices .col-md-6 {
 width: 100% !important;
flex: 0 0 100% !important;
max-width: 100% !important;
 }
.sacrifices h1, .sacrifices h4{font-weight:400;color:rgb(86 97 101);}
.sacrifices a{color:#ba54f5;font-weight:300;}
.sacrifices a:hover, .sacrifices a:focus{color:#e14eca;}
.sacrifices h1{line-height:1.05;margin-bottom:30px;}
.sacrifices h4{line-height:1.45em;margin-bottom:15px;}
.sacrifices p{color:rgba(255, 255, 255, 0.8);margin-bottom:5px;}
.sacrifices .category{text-transform:capitalize;font-weight:400;color:rgba(255, 255, 255, 0.6);font-size:0.75rem;}
.sacrifices hr{border-top:1px solid rgba(0, 0, 0, 0.1);margin-top:1rem;margin-bottom:1rem;}
.sacrifices .table>tbody>tr>td{color:rgb(86 97 101)!important;}
.sacrifices .table>thead>tr>th{border-bottom-width:1px;font-size:12px;text-transform:uppercase;font-weight:700;border:0;color:grey;}
.sacrifices .table>thead>tr>th,.table>tbody>tr>td{border-color:rgb(86 97 101);padding:12px 7px;vertical-align:middle;}
.sacrifices .table>tbody>tr{position:relative;}
.sacrifices hr{width:10%;height:1px;border-radius:3px;margin-left:0;}
.sacrifices hr.line-info{background-color:#1d8cf8;}

@media (max-width: 768px){
.sacrifices .btn{margin-bottom:10px;}
 }
.sacrifices .table-height-60{height:60vh;overflow-y:scroll;}
.sacrifices .table-bg-transparent-blk{background-color:#ffe5e4;padding:5px 15px;margin-bottom:12px;}
@media (max-width: 768px){
.sacrifices .btn{margin-bottom:10px;}
.sacrifices .font-12-xs{font-size:12px;}
.sacrifices .wordbreak-xs{word-break:break-all;}
 }
.sacrifices .text-monospace{font-family:'Fira Mono', monospace;}
 </style>
