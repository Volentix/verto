<template>
    <div>
        <q-toolbar >
            <!-- <q-btn flat round dense icon="menu" class="q-mr-sm" /> -->
            <q-avatar>
                <svg class="svg_logo q-mr-sm" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20.58">
                      <path
                        d="M199,25.24q0,3.29,0,6.57a.5.5,0,0,1-.18.41l-7.32,6.45a.57.57,0,0,1-.71,0l-7.21-6.1c-.12-.11-.25-.22-.38-.32a.53.53,0,0,1-.22-.47q0-3.83,0-7.66,0-2.69,0-5.39c0-.33.08-.47.29-.51s.33.07.44.37l3.45,8.84c.52,1.33,1,2.65,1.56,4a.21.21,0,0,0,.23.16h4.26a.19.19,0,0,0,.21-.14l3.64-9.7,1.21-3.22c.08-.22.24-.32.42-.29a.34.34,0,0,1,.27.37c0,.41,0,.81,0,1.22Q199,22.53,199,25.24Zm-8.75,12s0,0,0,0,0,0,0,0a.28.28,0,0,0,0-.05l-1.88-4.83c0-.11-.11-.11-.2-.11h-3.69s-.1,0-.13,0l.11.09,4.48,3.8C189.38,36.55,189.8,36.93,190.25,37.27Zm-6.51-16.76h0s0,.07,0,.1q0,5.4,0,10.79c0,.11,0,.16.15.16h4.06c.15,0,.15,0,.1-.16s-.17-.44-.26-.66l-3.1-7.94Zm14.57.06c-.06,0-.06.07-.07.1l-1.89,5q-1.06,2.83-2.13,5.66c-.06.16,0,.19.13.19h3.77c.16,0,.2,0,.2-.2q0-5.3,0-10.59Zm-7.16,17,.05-.11,1.89-5c.05-.13,0-.15-.11-.15h-3.71c-.17,0-.16,0-.11.18.26.65.51,1.31.77,2Zm.87-.3,0,0,5.65-5H194c-.13,0-.16.07-.19.17l-1.59,4.23Zm0,.06h0Z"
                        transform="translate(-183 -18.21)"
                      ></path>
                    </svg>
            </q-avatar>

            <q-toolbar-title class="primary">VERTO</q-toolbar-title>
            <div class="q-gutter-sm">
                <q-btn class="primary" dense icon="search" @click="callChainTools" />
                <q-btn class="primary" dense icon="qr_code" @click="qrSelect = true" />
                <q-btn class="primary" dense icon="notifications">
                    <q-menu transition-show="flip-right" transition-hide="flip-left" auto-close>
                        <q-list separator style="min-width: 100px">
                            <q-item>
                                <q-item-section>
                                    <q-item-label>Transaction alert :</q-item-label>
                                    <q-item-label caption lines="2">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <q-item-label caption>5 min ago</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-separator spaced inset />

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Transaction alert </q-item-label>
                                    <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <q-item-label caption>US $10</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-separator spaced inset />

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Payment Updated </q-item-label>
                                    <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <q-badge color="teal" label="10k" />
                                </q-item-section>
                            </q-item>

                            <q-separator spaced inset />

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Send Money alert </q-item-label>
                                    <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <q-item-label caption>2 min ago</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>

                </q-btn>
            </div>
        </q-toolbar>
        <q-dialog v-model="qrSelect">
            <q-card class="my-card" style="min-width: 300px;">
                <q-img src="https://www.imgonline.com.ua/examples/qr-code-url.png" />
                <q-card-section>
                    <q-btn fab color="primary" icon="qr_code" class="absolute" style="top: 0; right: 12px; transform: translateY(-50%);" @click="qrSelect = false" />

                    <div class="row no-wrap items-center">
                        <div class="col text-h6 ellipsis">
                            Scan Wallet Qr Code
                        </div>
                    </div>
                </q-card-section>

            </q-card>
        </q-dialog>
    </div>
</template>

<script>
export default {
  name: 'AppbarMobile',
  props: ['callChainTools'],
  data () {
    return {
      lightMode: true,
      tab: 'mails',
      qrSelect: false
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
