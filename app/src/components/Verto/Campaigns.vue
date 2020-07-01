<template>
  <div class="campaigns full-width q-pl-md q-pr-md">
    <q-scroll-area :visible="true" class="q-pr-md q-pb-sm" style="height: 96px;">
      <ul>
        <li v-for="(campaign, index) in campaigns" :key="index">
          <router-link :to="campaign.to">
            <span class="name">{{campaign.name}}</span>
            <span class="date">{{campaign.date}}</span>
            <span class="button"><q-btn round dense flat icon="more_vert" /></span>
          </router-link>
        </li>
      </ul>
    </q-scroll-area>
    <img src="statics/earn_venue.svg" class="earn_venue" alt="">
  </div>
</template>

<script>
import { QScrollArea } from 'quasar'
export default {
  name: 'Campaigns',
  components: {
    QScrollArea
  },
  props: {
    hideControl: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      campaigns: [
        {
          name: 'Nodes Campaign',
          date: 'Expiry date: 31 Jan 2020',
          active: true,
          to: '/dashboard/campaigns/nodes-campaign',
          description: `
            A VNode operator with a stake = or > 3,000 VTX can vote for other Nodes or on proposals for the Volentixtrez
            <br>
            Subsidy: 
            <br>
            8 VTX/day of uptime
            <br>
            3 VTX/vote
            <br>
            You can either stake 3000 VTX and become a node or you can join the designed referral program where you will earn 1 VTX per day, per referral, contingent that your referred node has 24 hour uptime.
          `
        },
        {
          name: 'Twitter Campaign',
          date: 'Expiry date: 31 Jan 2020',
          active: true,
          to: '/dashboard/campaigns/twitter-campaign',
          description: `
            A VNode operator with a stake = or > 3,000 VTX can vote for other Nodes or on proposals for the Volentixtrez
            <br>
            Subsidy: 
            <br>
            8 VTX/day of uptime
            <br>
            3 VTX/vote
            <br>
            You can either stake 3000 VTX and become a node or you can join the designed referral program where you will earn 1 VTX per day, per referral, contingent that your referred node has 24 hour uptime.
          `
        }
      ]
    }
  },
  computed: {
    campaign: function () {
      return this.campaigns.filter(v => {
        if (v.active) {
          return v
        }
        return false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";
  .campaigns{
    // padding: 0px 0px;
    max-width: 100%;
    margin: auto;
    position: relative;
    padding-right: 22%;
    @media screen and (max-width: 767px) {
      margin-bottom: 50px;
    }
    .earn_venue{
      position: absolute;
      right: 0px;
      top: 0px;
      max-width: 22%;
    }
    h2{
      color: #8909B7;
      font-family: $Titillium;
      font-size: 25px;
      font-weight: $bold;
      @media screen and (max-width: 767px) {
        margin-bottom: 0px;
      }
    }
    ul{
      padding: 0px;
      margin: 0px;
      list-style: none;
      li{
        font-family: $Titillium;
        margin-bottom: 10px;
        background: #F9F9F9 0% 0% no-repeat padding-box;
        box-shadow: 0px 3px 6px rgba(black, .1);
        border-radius: 7px;
        opacity: 1;
        max-width: 100%;
        padding: 0px 10px;
        cursor: pointer;
        @media screen and (max-width: 767px) {
          max-width: 100%;
        }
        a{
          color: #707070;
          text-decoration: none;
          outline: none;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          align-content: center;
          @media screen and (max-width: 767px) {
            height: 40px;
            position: relative;
            flex-direction: column;
            align-items: flex-start;
            .button{
              position: absolute;
              right: -10px;
              top: 8px;
            }
          }
        }
        &:hover{
          background: rgb(243, 243, 243) 0% 0% no-repeat padding-box;
        }
        .name{
          font-size: 10px;
          font-weight: $bold;
          min-width: 140px;
        }
        .date{
          font-size: 10px;
          font-weight: $light;
        }
        .button{
          opacity: .5;
        }
      }
    }
  }
</style>
