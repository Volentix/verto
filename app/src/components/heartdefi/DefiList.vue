<template>
  <div>
    <template v-if="type == 'sacrifice'">
      <div class="defi-area1">
        <div class="defi-part">
        <div class="defi-left">
            <h2>Sacrifice history</h2>
            <p>USD value sacrificed and corresponding sacrifice points</p>
        </div>
        <div class="defi-right" v-if="false">
            <p><a href="#">See all</a></p>
        </div>
        </div>
      </div>

      <div class="dndefi-area full-width">
        <div class="dndefi-part">
          <div class="dndefi-a1 cursor-pointer" @click="$router.push('/pulsexsac/'+$store.state.currentwallet.user.address)">
            <h2 class="full-width"><img src="data:image/jpeg;base64,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" alt="images not found" class="img_a1" /> Pulsechain <span><q-icon size="lg" color="grey" class="float-right " name="navigate_next"/> </span></h2>
            <p>USD Total</p>
            <h3 v-if="$store.state.currentwallet.userData.pulseSac">${{formatNumber($store.state.currentwallet.userData.pulseSac.usd_total, 0)}}.<span>{{formatNumber($store.state.currentwallet.userData.pulseSac.usd_total, 2).toString().split('.')[1]}}</span> </h3>
           <q-linear-progress
                      indeterminate
                      color="grey"
                      v-else
                      class="q-mt-md"
                    />
                    <p style="padding-top:5px">Points</p>
            <h3 v-if="$store.state.currentwallet.userData.pulseSac">{{formatNumber($store.state.currentwallet.userData.pulseSac.points_total, 0)}} PLSX <sub v-if="false"><i class="fas fa-long-arrow-alt-up"></i>4%</sub></h3>
  <q-linear-progress
                      indeterminate
                      color="grey"
                      v-else
                      class="q-mt-md"
                    />
                    </div>

          <div class="dndefi-a1 dndefi-a2">
            <h2><img src="https://pulsex.com/brand/downloads/PLSX_coin.png" alt="images not found" class="img_a1" /> PluseX</h2>
            <p>USD Total</p>
            <h3 v-if="$store.state.currentwallet.userData.pulsexSac">${{formatNumber($store.state.currentwallet.userData.pulsexSac.usd_total, 0)}}.<span>{{formatNumber($store.state.currentwallet.userData.pulsexSac.usd_total, 2).toString().split('.')[1]}}</span> </h3>
             <q-linear-progress
                      indeterminate
                      color="grey"
                      v-else
                      class="q-mt-md"
                    />
                     <p style="padding-top:5px">Points</p>
            <h3 v-if="$store.state.currentwallet.userData.pulsexSac">{{formatNumber($store.state.currentwallet.userData.pulsexSac.points_total, 0)}} PLSX <sub v-if="false"><i class="fas fa-long-arrow-alt-up"></i>4%</sub></h3>
             <q-linear-progress
                      indeterminate
                      color="grey"
                      v-else
                      class="q-mt-md"
                    />
         </div>

          <div class="dndefi-a1 dndefi-a3" >
            <h2><img src="https://pulsex.com/brand/downloads/PLSX_coin.png" alt="images not found" class="img_a1" /> Sacrifice for PulseX

         </h2>
         <a href="http://pulsex.info/" target="_blank">

            <p  class="text-red q-pb-md">Go to Pulse.info</p>
            <h3 class="text-red"> <q-btn icon="img:https://art.pixilart.com/8f8b2b8fe95d73c.gif" class="text-red" size="md" color="red" flat label="Sarifice now" /><span v-if="false"> $1 <span>-></span> <sub class="q-ml-sm">6,700 PLX</sub>  </span>     </h3>
            </a>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type == 'track'">
      <div class="defi-area2">
        <div class="defi-part">
        <div class="defi-left">
            <h2>Protocols & Opportunities </h2>
            <p>Intereact with existing protocols</p>
        </div>
        <div class="defi-right">
            <p><a href="#">See all</a></p>
        </div>
        </div>
      </div>

      <div class="cvv-area">
        <div class="cvv-part">

          <div class="cvv-parta">
            <div class="cvv-parttb">
              <div class="cvv-partb">
                <div class="cvv-partb1">
                  <img src="data:image/jpeg;base64,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" alt="images not found" />
                </div>
                <div class="cvv-partb2">
                  <h5>Liquid loans</h5>
                </div>
                <div class="cvv-partb3">
                  <p>0%</p>
                </div>
              </div>
            </div>

            <div class="cvv-parttc">
              <div class="cvv-parttc1">
                <p>Debt</p>
                <h5>-</h5>
              </div>
              <div class="cvv-parttc2">
                <p>Collateral</p>
                <h5>-</h5>
              </div>
              <div class="cvv-parttc3">
                <p>Interest accrued</p>
                <h5>$0.00</h5>
              </div>
              <div class="cvv-parttc4">
                <a href="#">Manage</a>
              </div>
            </div>
          </div>

          <div class="cvv-parta cvv-partaaa">
            <div class="cvv-parttb">
              <div class="cvv-partb">
                <div class="cvv-partb1">
                  <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPDQ8NDw8ODxENDQ0NDhARDw8PEA4PFRUWFxURGBYYHikiGBonJxcWIT0hJSsrLi8uFx8zRDMuNyg5LisBCgoKDg0OGBAQFy0lICUuLS0rLS0tLy0tLS0tKy0vKy0tLi0tLS0tLS0tLS0rLSstLS0tLS0tLS0tLS0tLS0tLf/AABEIAMgAyAMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAgMEBgcFCAH/xABCEAACAQMABQgHBgQFBQEAAAABAgADBBEFEiExQQYHEyJRVHGBFBYyYZPR0kJSU5GUoyOCkqEzorGy8GJys8HhJP/EABsBAAIDAQEBAAAAAAAAAAAAAAAEAwUGAgEH/8QAPBEAAQMBBAQMBQMDBQAAAAAAAQACAwQFETFBEiGRoRMUUVJTYXGBscHR4QYiQpLwFSMyFtLxJTNicsL/2gAMAwEAAhEDEQA/ANxhCEEIhCEEIhCEEIhOPpHlDaWzatauqtxUBnZdmdoUErsPGRfXTR/eP2q/0yZlNM8aTWEjqBKgfUwsNzngHtCsUJXvXKw/HPwq30wHLGw/HPwq30zridR0bvtPoueO0/SN+4eqsMJwPW+x/HPwq30z6OV1j+MfhVvpgaSfo3faV5x6m6Vv3D1XehOF62WX4x+HV+U+jlVZ/jH4dT5Tzis/Ru2H0XnH6XpW/cPVdyE4vrRZ/jft1PlD1ns/xv26nynnFpujdsK8/UKTpm/cPVdqE4vrLafin+h/lFeslr+Kf6H+U84vLzDsK8/UqTpmfcPVdiEg2ekqVbZTfJHDBB8cHhJ0jIINxCaZI2RukwgjlBvRCEJ4u0QhCCEQhCCEQhCCEQhCCETg8rdMiytHqgjpH/h0R21Dx3HYBk7ezHGd6Yjy3096bdsUbNGhmlR3jO7WffxPhsC7Myws2j4zMAf4jWfTv8L0vVSFkZuxyXHesWYsxLMxLMxJJZjtJJMUrSMGig02uhdqWVkhKlq8cV5DDRxXnBalHRqYrxxXkNXjyvIi1QuapavHFeQ1eOq8jLVC5imK8cV5DV46ryJzVC5imK8eV5BV46ryNzVE5in0K5RldCVZTkEbxNE0ZeCvSWoNhOQw+6w3j/nbMwV5YOS2kuhrCmx6lUheOA32T/685WV9Nps0hiN4VxYVbxafg3H5Xauw5HyKvkIQlEt4iEIQQiEIQQiEIQQiEJGvLlKNJ6znVSkjVHOCcKoyTs2mCFUecvT4trX0VSOlu1KttXNOgdjMQfvbVH823ZMiDSVyh0095dVLipkaxxTQkno6Y9lBn8/eSTxkANN7ZtFxWANP8jrPbyd2G1Qzwl2KfDRYaMBooNHSFXSwKQGig0YDRYackKvkp1IDRavJfJaxF1fULdvZd8uNu1FBdl2bshSPObVW0fReibdqSGkVC9Hq4QDhgDd5bsSnr7SbSvDNG84nXdcEU9lunBOlcsOV46rz5pOiKNzVogkijVekCcZIViMnHhGFePi5wDhmqmSItJBUxXjyvISvHVecFqXcxTFeOK8hK8eV5G5qic1S1eOq8hK8dV5EWqFzFpnJrSXpFAa3+JSwr9rD7Lef+oM7cy7QGlPRrhX2lTsqAcUPy3+U0ym4ZQwIIYAgg5BB3EGZiup+Bk1YHD0/MrlurIreMwAO/k3UevkPf43p2EIRNWyIQhBCIQhBCJlnO1yi9nR1M/dq3WMEjjTp7/drEY+575feUWmKdla1Lmpg6gOomcGrUx1UGw78b8bBk8J53vbl61V61RtapVqMzsftE+GweAl9YNFwsvDPGpuHWfbHYnKSDTOkcB4pAaLDRgGKDTaEKeSnUgNFBowGiw04LUhJTp8NFhpHDRYacEKvkp1onNJa61xcXGRilRWkBj7VRs62eGNQj+aapKfzX2nR6MWpk5uKtWrgjGqAejA8OpnzlwmCtOXhKuQ8hu2alPCzQYAsS5dU1TSdyq7AXRz/ANzorMfzJnEDS186iBdIIQANa1psTjGsddxn8gB5SnhprKA6dNG7/iN2ryWeq6f9x3aVJVo4ryKGig0ZLVWviIU1Xi1eQ1eOK8ic1LuYpqvHFeRFeLV5GWqFzFNV5feRGlukpm3c9ekMqSTlk/8AmfyI7JnSvJuj75qFVKye1TYEdhHEeYyPOI1tNw0Zbnl2pigqTSzh+WB7PbFbLCRbC6WtSSsm1aihhuyO0HHEbvKSpkiLtRW9BBF4RCEIL1EIStcttOiytSyn+NVzTobiQ2Nr4O8DwO0jtnccbpHhjRrOpdsYXuDW4lZ9zn6f9JuPRabE07UlW3gPX2hzvwcDq7thLcDKKVkl9/jGys+g0kLaeJsbct5zK0scAjYGDJRysRJBWIKx0OXLmpsNFhp8KxE6xS74QU+GjlLJYKASWICgbSSdwEjBpZOb6y9I0paqdbFOp07FRnHRguM9gJCjzkE8gijdIcgTsCr5YLgSt00Xa9Bb0aGdYUKNOiDjGtqKBnHlE2N+ldq4pnPo9w1u5BBBcIjMPLWx4gyRc3C06b1XIVKaM7sdyqoyTKNzU6Uaul+HA1jdm6cjYC1bOQB2dT+8+dxwOkikm5ujf3lJAKHzw09lm4HeFLfDIH+7+8zgNNa52aROjqbBc6l3TZz91SlRc/mVHmJkAaa2xHaVG0chI33+aRqIdJ16kBosNI4aX/m85KULqi91cqzrrmnSTL0xswWfKkE78dmw7+DdXUspo+Efh1Y60gaQvdcFSg0cDS6cuuSNK2oi7tVKU0IWsmuWCg7FcaxzvOCMneOwyihpxTVMdTHpswSFRRujdcVJV46ryIGiw0mLVXujuU1XjivIavHVeRFqgcxXrkBpfUqG0c9WqdamSfZfivn/AKj3zQphVGsVYMpKspBBG8EbiJr/ACf0qLu2StsDDqVV3atQb/Lj4GZm1qXQfwoGo49vv4rTWLVaTOAdiMOzk7vBdaEISnV4kk4GTwmIcs9NG9uiwJ6KnlKI246NSevg4wW37uwcJsmkrbpretRzq9LRqUg2/V1lIzjjvmM3vJi8p1GT0Ws+q3tClUqBveGVcGXVi8E17nuIBGF+/wBP8q4sgRaTnOIvGF+rt9FXysQVnaPJ297pc/p6/wAok8nb3ulz+mr/AEzSioj5w2q6L4+cNo9VxCsQVnbPJy97pdfpq/0xB5N33dLr9PX+mSipi542qJzo+cNo9VxSsbKztnk3fdzuv09f5SLfaJuKABrUKtPWzjpKdSkCewZEmZURk3BwPeor2HAjauWVmmcy+j81Lm6IYaiLbocdRtYhnHiNVP6pnJSbjzZaP6DRdIkMGuHqXDBvfhVI9xVVPnKy3p9CkLecQPM+CRr/AJY+1O84+kfR9F18MFavq2yAjOtr7HUe/V1/ylL5mbo+lXNHhUt+lJ4g03AH/kMk89GkNltaBvv3DrjjtWm2fibBK7zV3TJpakoxistek+fu6hfZ5osr6Sl/0iQ5uvdsw8Ce9JMhvgLlqXODQapom7VRkhEqfyo6ux/IGYTrT0Vpy2NazuaC41q1tXpLn7zIQP8AWecCdp8ZN8OPvhkbyEHaLv8AylmR6YKfVpv/ACRsfR9HWtEhgRRV3DbGV367KfAsR5TC+Ttj6Te29vhiKtakrhdjCnnrsPAZPlPRkg+I5f8Abi7XHwHmouD0CmLmgtRGpuAyOrI6/eVhgiYXyk0Q1ld1LdskA69Jj9uk3stuG3gccQZqvJHlNTvTcUwwLUa1XU+yalsXPR1ApA4YB8AftSPzhcnzd2uvSXNe31nQAEtUTZr0x79xG89XA3xCzp3UVSYpdQOo9XIfzLsUFRCJG9YWQBosNJY5P3vcrv8AT1vlFjQN73O6/T1vlNYZY+e3aFSyUruRRA0cV5KGgL3ud1+nrfKfRoG87ndfp6vynJlj542hIvpH807CmFeWXkXpsW1xquQKVbCOTgBG+y5J4DO33HPATijQV53O6/T1flJVhyavK1Vafo1WnkjLPTamirkAtlsZxncNsUqjBJG5r3i4jlC4ginjka9jTeOo7MFtcInEJiFsr0qEh6SuTRt61YDWNKjUqgbs6qk4/tMbracunY5uKxJYk4q1AMk52YOAPcNkcpaQ1F9xAuVjQ2e+r0iCAB5rb8wzMMOmLnvFf4tX5xB0vdd4r/Fq/OPixndINieNgv6QbPdbtmfZgh0xdd4r/Fq/OIOl7rvNf4tX5zr9Dd0g2e64/RH88bFv0gaWsEuqFS3qDKVVKndkHgwzxG8e8CYedM3XeK/xavzmtcitN+mWilyOlpatOqOrljjZUwOB8BtB7ItV2bJStEgdfryy5EpVUElM0Pvv7MljmkNC1aN4bMrmotYU1AI6xYjUI8QQfOb9YWy0aNKimdWjSSkuTk6qgAZPbsnH0xycp3F5aXZG23qAuM4DIuWTZ2h9U8Nhadi+ulo0alZ/Zo03qNgZOqoJMLQrzVtiGYGv/sfwHvXFVU8O1gzz7fzWsQ5yL/0jSlfB1lolaCbMavR5Dr/UX/Oc/kdWZNJ2bLsPpVumf+l3VWH5EyHeVWqVHdzrM9Ry7H7TMck7IzSYq6OpIZXVlI3gjaDNlHCG03Ajm6O67xVxwF0eh1Xbl6aM8y6UtTQuK1uSGNCtUpFgMaxRipP9p6YRsgHt2zz5y8tOh0pdrnObhqvxf4mPLWx5TO/Db7pZGHMA7D7qnoRpOc3q813eaGw6XSDVyCVtqLMGzsFR8KoPbkGp+U1HlVpD0bR9zXDarJRcU2xnFVurTOP+4rKtzP6P6Owq3BXBua+w5zrUqYwNnDrGoIc8OkejsqVuGKtcVs4A2NTpjJBPi1M+UhrBxu1BHiAQ3uGs+ajlbpTFoWb8nNNvY3dO5TJw2KiAkCpSOxkP9iM8QDN9sLyncUkrUmD06ihkYbiOPgRuxvBBE81BpJtL6rSyaVWpT1saxR2QtjdnB2y7tOyBVua8O0XDqxHt7Lx8JC9MQnnEabu+9XPxqnzixpu67zcfGqfOVf8ATr+kGz3SztJuS9FwnnYabue83Hxqnzixpm57zcfGqfOef087pBs91A6cj6V6GhPPY0xc95uPjVPnJej+Ul3RqLUW4qsVYHVeo703HYyk7R/ccMGRvsCQDU8E9iiNddi0reYROYSgTq+4mNctNDeh3TBQRSq9elvwBxTOOBPv2ETZpX+V2hvTLVkUZq081KB2Z1xvTaR7Q2bdm48IzSzmJ9+RxVjZlZxaYF38TqPr3eF6xsGKjbgg4II1cgg7CD2eMAZoo5luHNSisQViw0VG2yAqFzVHKztckdMmzu1ck9E/8OsMnBQn2tgO0b/LHGcsrG9Wdva2RhY7ApeWESNLXYFegqVUOoZSCGAKkEEEHcQRK3zjX3Q6NqgEg12SgCPfksD7iqsPOV7kbyyp0aItrosuoD0NQhn6mdiNx2Z2Y2Y7MbeRy85SJemnTpBxSpGocts6VycBtXsAHHb1jsEzlNZ0rapoc35Qb78rhrCzENnStqQ1zflBxyu/LlTCIgLtHiI+ViCs2DXq/LVvvJapraPtGzn/APLbgnOSWCAHJ7dkyznXtAuldcb69vRqt4jKf6IJoHNvVDaKoAEE03rI3uPSMwH5MPznJ5daIW40nowagY1mKVcnAajSdXI/JnmToJRTV778Bp7gT5LNwXRVLgctLdr8laeS1h6NYW1vq6pp0U1xnP8AEbrPt8SZlXO7f9JpAUQzFbakiFTuFRuuxHiCn5Ta55w5QXvpN5cXHWIq1ajrre0ELHVU+AwPKTWCwyVT5nZA7Xe16KFhfIXHLzXKBig0Cs+YmzvVi+IFLDRYaMAxQaeEJKSnUgNFAxgNFhpwQq+SBPhpb+bfQfpV307g9DalXbser9hN/wDMd/sgH2pULWk1R0pU11nqMqIuQNZmOANs37k3odbK0p2y4LAa1VsDr1D7TbtvYM7cADhKO2qzgIdBp+Z3hmfIJQU40ryuxCEJjEwiEIQQso5ydB9DXF3TGEuCdfcAtbaWP8wyfENKYGm9aa0cl1bVLZ91RcA/dYbVbyIB8phOkbR7es9GoMPTZkYbd44jO3B3g8QRHqee4XFbSwqzh4eCd/Ju9uWzDYkhosGMBooNLKOoVy5ifBgRGw0UGj0c96hc1BWIKx7M+ERprwonMUcrEFZIKxBWShyiLFpvNNWHodennrLcioR2K9NQD/kb8pca1nTerTrMoL0Nfom4prjDY8RM+5p64FW5pcXpU3HhTYg/7xNMmRtJujVP69e0LH2g3QqX7doXD5ZXnQaOuqmWB6I01KnDK9TqKwPDBYHymAuNpPvmtc7V5i2oUNualVqpIOBq0xjVI47XB/lmVFZfWDGGU5fzjuGr1VlZkN0Jccz4fhUcrGysklYgrL9rk65ijFZ8xHysQVkocoXNSA0UGiSsn6B0U95d0bansNWoFLbDqKNrNgkZwATjjjE8e9rGlzsBrPclpYgASVf+abk9lm0jVGAmvStwdYZYjD1PeMErxGS3ZNWkLRtlTt6NO3pKFSkgRAOwcT2k7TniSZNnzmtqnVUzpDhl1DJUjnXklEIQiq5RCEIIRM55z9Ag0xf0x1k1adcKB1l3JUPEkbF47COAmjSPdUFqo1NwGSorI6ncykYIno1JmjqnUszZW5Y9YzGzDrXncNFAyfym0Q1ld1KByV1temx+3TPsncNvA+8GcwNJo57l9KY5srA9hvBF4T4aKDRgNFgx6OdclieBiw0YDRYaPxzqJzU9ElYkGKBjrJgVC5itPNrX1NIhcf4tKtS8Mar5/wAn95rcw7k7fC2vKFZvZp1Bre5GyrHyBJ8prtbTlqlLpTcUSnWAIdTrEbwAN590pLVjJmDgMRvCyltQOE4cBiN4yWZc5l10ukWTBAoUqdLfkEnLE44e2B5SolZ0dKXJrXFWsRjpKrtjs13LY/vIRWaOmbwUTGcg3571dQQcFE1nIP8AO9RysQVkgrEFY0HL1zVHKxBWSCsQVkrXKFzEwVmv81fJ70e2N464qXI/h/8ATbnBHDZrHreASUTkXyfN7dohB6OnipWbBxqA+xkbi27t3nhN3RcAAcBgeEz9vV1zRTtOOt3kPM9yprSl0f2x2ny/OxLhCEy6qEQhCCEQhCCEQhCCFTecTQHpdr0tMZrW+s64BLNTPtoMcdx3E7MDfMczt8DPSsxDnA0F6HdlkGKNxrVKYwMDb10AGMBcjyIkEvy/Mtd8NV+NK89bfMee1VoNFhowDFBp3HULWlqfDRQMZBigY/HP1qEsT4aKDRkNFAx6OdRFifBiw57T+cjgxYMfjqOtQlqcIiSsAYrMcZKCoXNTRWIKyQREFZOHKJzVHKxOpk47Y+Vlv5udBdNcek1AejtiGTeA9XqlOG3G/wDp4GeTVLYYzI7LecglKl7YYy92SuvIrQQsrRVYDpaoSrWPVyDjYmRwXxIyW7ZZYQmIkkdI8vdidaxr3l7i52JRCEJwuUQhCCEQhCCEQhCCETg8rdCi9s3obNdc1aJJIAqgHGfcckbjsM70J44Ai4ruOR0bw9huIN4Xmm6tnpO1KojoyswZWUggjhEAz0HpPk/a3f8Aj0KdQ6oXXwVqYG0DXXDAe7PGc71C0Z3UfGufriYpntOoraRfFUBb+5G4HquI3kLEA0UDNt9Q9Gd1Hxrj64r1F0b3X964+uTtY8Zro/E9Ifofu/uWJCKDTbPUXRvdv3rj64eo2je7fu3H1xlshCjPxJSn6HbvVYsDFAzZ/UfR3dh8Wv8AXPvqTo7u371x9cYbVXZLg/EdMfodsHqsZDRQM2T1K0d3b924+qHqXo7u37tx9UZbaAGRUZ+IKc/Q7d6rHg0VibB6maP7t+7X+qffUzR/dv3a/wBUZbarBi07lwbepz9Lt3qsks7N61RKSIzNUcKqjiflxzwAM2jQWjktbanbr9hRrH77n2m/5ujlhouhQGKNKnT2AEqOswG7LHa3nOhEa2uNRcALgPFU1oWgaogNFzRvPL7IhCEQVaiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQiEIQQv/Z" alt="images not found" />
                </div>
                <div class="cvv-partb2">
                  <h5>HEX STAKES</h5>
                </div>
                <div class="cvv-partb3">
                  <p>0%</p>
                </div>
              </div>
            </div>

            <div class="cvv-parttc">
              <div class="cvv-parttc1">
                <p>Current</p>
                <h5><img src="https://ethplorer.io/images/HEX2b591e99.png" alt="images not found" /> 12 000 HEX<span v-if="false">at 45 days AVG%</span></h5>
              </div>
              <div class="cvv-parttc2">
              <p>Projection</p>
              <h5><img src="https://ethplorer.io/images/HEX2b591e99.png" alt="images not found" /> 20 00O HEX</h5>
              </div>
              <div class="cvv-parttc3">
              <p>Stake AVG</p>
              <h5>45 days</h5>
              </div>
              <div class="cvv-parttc4">
                <a href="#">Manage</a>
              </div>
            </div>
          </div>

          <div class="cvv-parta">
            <div class="cvv-parttb">
              <div class="cvv-partb">
                <div class="cvv-partb1">
                  <img src="data:image/png;base64,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" alt="images not found" />
                </div>
                <div class="cvv-partb2">
                  <h5>HEDRON</h5>
                </div>
                <div class="cvv-partb3">
                  <p>0%</p>
                </div>
              </div>
            </div>

            <div class="cvv-parttc">
              <div class="cvv-parttc1">
                <p>Debt</p>
                <h5><img src="data:image/png;base64,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" alt="images not found" /> O HDR<span>at 2.75%</span></h5>
              </div>
              <div class="cvv-parttc2">
              <p>Collateral</p>
              <h5><img src="https://ethplorer.io/images/HEX2b591e99.png" alt="images not found" /> O HEX</h5>
              </div>
              <div class="cvv-parttc3">
                <p>Interest accrued</p>
                <h5>$0.00</h5>
              </div>
              <div class="cvv-parttc4">
                <a href="#">Manage</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Formatter from '../../mixins/Formatter'
export default {
  mixins: [Formatter],
  props: {
    type: {
      default () {
        return 1
      }
    }
  },
  components: {

  },
  data () {
    return {

    }
  },
  watch: {

  },
  computed: {

  },
  created () {

  },
  mounted () {
    if (!this.$store.state.currentwallet.userData.pulsexSac) {
      this.$axios.get(process.env[this.$store.state.settings.network].CACHE + 'https://global-balancer.pulsexlead.com/get_address/?address=' + this.$store.state.currentwallet.user.address).then((res) => {
        if (res.data && res.data.usd_total) {
          this.$store.commit('currentwallet/setUserData', { pulsexSac: res.data })
        } else {
          this.$store.commit('currentwallet/setUserData', { pulsexSac: { points_total: 0, usd_total: 0 } })
        }
      }).catch((res) => {
        this.$store.commit('currentwallet/setUserData', { pulsexSac: { points_total: 0, usd_total: 0 } })
      })
    }
    if (!this.$store.state.currentwallet.userData.pulseSac) {
      this.$axios.get(process.env[this.$store.state.settings.network].CACHE + 'https://pulselead.xyz/transactions/' + this.$store.state.currentwallet.user.address).then((res) => {
        if (res.data) {
          var html = new DOMParser().parseFromString(res.data, 'text/html')
          let nodes = html.querySelectorAll('body > div > section > div > div:nth-child(3) > div > div > table tbody tr')

          let total = 0, points = 0
          nodes.forEach(item => {
            let tx = item.innerText.split('\n')
            tx = tx.map(o => o.trim())

            total += parseFloat(tx[5].replace('$', '').replace(/,/g, ''))
            points += parseFloat(tx[10].replace(/,/g, ''))
          })
          let txs = html.querySelectorAll('.container')[1].innerHTML.replace('<th scope="col">Transaction hash<br>(Click to copy)</th>', '<th scope="col">Transaction hash</th>')
          let data = { pulseSac: { txs: txs, usd_total: total, points_total: points } }

          this.$store.commit('currentwallet/setUserData', data)
        } else {
          this.$store.commit('currentwallet/setUserData', { puleSac: { points_total: 0, usd_total: 0 } })
        }
      }).catch((res) => {
        this.$store.commit('currentwallet/setUserData', { pulsexSac: { points_total: 0, usd_total: 0 } })
      })
    }
  },
  methods: {

  },
  destroyed () {

  }

}
</script>
