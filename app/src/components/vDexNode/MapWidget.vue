<template>
  <div class="row">
    <div class="col-8">
      <div class="column">
        <div class="col bg-vdarker">
          <q-banner dense inline-actions class="text-vgrey bg-vdark q-px-md q-pt-md">
            <div class="text-subtitle2 text-uppercase">Live Nodes</div>
            <template v-slot:action>
              <q-btn color="vgreen" size="sm" rounded outline @click="mapCentering()" label="Find my node" />
            </template>
          </q-banner>
        </div>
        <div class="col bg-vdark">
          <div id="mapid" class="bg-vblack"></div>
        </div>
      </div>
    </div>
    <div class="col-4 bg-vdark">
      <div class="column">
        <div class="col bg-vdarker">
          <q-banner dense inline-actions class="text-vgrey bg-vdark q-px-md q-pt-md">
            <div class="text-subtitle2 text-uppercase">Distribution</div>
          </q-banner>
        </div>
        <div class="col bg-vdark">
          <q-table v-if="nodeGeoData.length > 0" dense flat :data="nodeGeoData" :columns="nodeGeoDataColumns" row-key="name" virtual-scroll :pagination.sync="nodeGeoDataPagination" :rows-per-page-options="[0]" table-style="max-height: 250pt;" hide-bottom class="bg-vdark text-vgrey">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="city" :props="props">
                  <q-btn dense flat size="sm" color="vgrey" class="code" @click="mapCentering(props.row.lat, props.row.long)" :label="props.row.city" />
                </q-td>
                <q-td key="mass" :props="props">{{ props.row.mass }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const L = require('leaflet')

export default {
  name: 'MapWidget',
  props: ['nodes'],
  data () {
    return {
      map: '',
      nodeGeoData: [],
      nodeGeoDataColumns: [
        {
          name: 'city',
          align: 'left',
          label: 'City',
          field: 'city',
          sortable: true
        },
        {
          name: 'mass',
          align: 'center',
          label: 'Nodes',
          field: 'mass',
          sortable: true
        }
      ],
      nodeGeoDataPagination: {
        rowsPerPage: 0,
        sortBy: 'mass',
        descending: true
      }
    }
  },
  mounted () {
    this.getNodesLocation()
    this.mapInit()
    this.mapLoad()
    this.markersLoad()
  },
  watch: {
    nodeGeoData: function () {
      this.mapLoad()
      this.markersLoad()
    }
  },
  methods: {
    async getNodesLocation () {
      await this.getLocationsData() // Real data
    },
    async getLocationsData () {
      return new Promise(resolve => {
        this.$axios
          .get(this.$vDexNodeConfigManager.getEndpoint('nodes_api') + '/getNodesLocation')
          .then(result => {
            let locations = []
            for (var key in result.data) {
              let coord = result.data[key][1].split(',')
              locations.push({
                id: key,
                city: result.data[key][0],
                lat: coord[0],
                long: coord[1]
              })
            }
            locations = this.$utils.getUniqueLocations(locations)
            /* eslint-disable */
            for (let i = 0; i < locations.length; i++) {
              this.nodeGeoData.push({
                lat: locations[i].lat,
                long: locations[i].long,
                mass: locations[i].ids.length,
                city: locations[i].city,
                nodes: locations[i].ids
              })
            }
            /* eslint-enable */
            resolve()
          })
          .catch(error => {
            this.$userError(error, 'Get location data action')
          })
      })
    }, // end of getLocationsData
    mapInit () {
      this.map = L.map('mapid').setView([51.505, -0.09], 1)
    },
    mapCentering (lat, long) {
      if (!arguments.length) {
        let account = this.nodes.find(row => row.account === this.$store.state.vdexnode.identity.accountName)
        if (account) {
          for (let i = 0; i < this.nodeGeoData.length; i++) {
            if (this.nodeGeoData[i].nodes.includes(account.id)) {
              this.map.setView([this.nodeGeoData[i].lat, this.nodeGeoData[i].long], 10)
            }
          }
        } else {
          this.$userError("Oops, I can't find your node id in the list. Is it running?", "Get user's node location")
        }
      } else {
        this.map.setView([lat, long], 10)
      }
    },
    mapLoad () {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 1
      }).addTo(this.map)
    }, // end of mapLoad
    markersLoad () {
      for (var i = 0; i < this.nodeGeoData.length; ++i) {
        L.circle([this.nodeGeoData[i].lat, this.nodeGeoData[i].long], {
          color: '#c5c6a6',
          fillColor: '#b2a987',
          fillOpacity: 0.8,
          radius: this.nodeGeoData[i].mass * 100
        })
          .bindPopup(
            '<ul><li>City: ' + this.nodeGeoData[i].city + '</li><li>Nodes: ' + this.nodeGeoData[i].mass + '</li></ul>'
          )
          .addTo(this.map)
      }
    }
  } // end of methods
}
</script>

<style scoped>
#mapid {
  height: 330px;
}
</style>
