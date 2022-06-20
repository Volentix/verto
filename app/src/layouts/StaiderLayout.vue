<template>
  <div class="body">
    <div class="Loader ">
      <div class="spinnerPairHolder">
        <div class="spinnerPair">
          <div class="spinnerPairCercle"></div>
          <div class="spinnerPairCercle"></div>
        </div>
        <div class="spinnerPair">
          <div class="spinnerPairCercle"></div>
          <div class="spinnerPairCercle"></div>
        </div>
        <div class="spinnerPair">
          <div class="spinnerPairCercle"></div>
          <div class="spinnerPairCercle"></div>
        </div>
        <div class="spinnerPair">
          <div class="spinnerPairCercle"></div>
          <div class="spinnerPairCercle"></div>
        </div>
        <div class="spinnerPair">
          <div class="spinnerPairCercle"></div>
          <div class="spinnerPairCercle"></div>
        </div>
      </div>
    </div>

    <div class="navbar-main-2">
      <div class="container-fluid">
        <div class="wrapper">
          <div class="logo-otr">
            <a href="javascript:void(0)" @click="$router.push('/'); explore = false" class="logo-a">
              <img
                class="logo-img"
                src="/statics/img/white-logo-staider.png"
                alt="brand-logo"
              />
            </a>
          </div>
          <div class="navigation-otr">
            <ul class="navigation-inr">

            <li class="navigation-li nav-li1 ">
                <p :class="{'active-menu' : $route.path == '/'}" class="nav-a heading-SB" @click="$router.push('/');explore = false">Home</p>

              </li>
              <li class="navigation-li nav-li1">
                <p :class="{'active-menu' : $route.path == '/staider/explore'}" class="nav-a heading-SB" @click="$router.push('/staider/explore');explore = true">Explore funds</p>

              </li>
              <li class="navigation-li nav-li2">
                <p  :class="{'active-menu' : $route.path == '/staider/faqs'}" @click="$router.push('/staider/faqs');" class="nav-a heading-SB">Faqs</p>

              </li>
               <li v-if="false" class="navigation-li nav-li2">
                <p :class="{'active-menu' : $route.path == '/staider/about'}"  class="nav-a heading-SB">
                   <a  class="nav-a heading-SB" href="javascript:alert('In progress')">About us</a></p>
              </li>
              <li class="navigation-li nav-li3" >
                <a :class="{'active-menu' : $route.path == '/staider/dashboard'}"  href="javascript:void(0)" @click="$router.push('/staider/dashboard')" class="nav-a heading-SB"
                 v-if="$store.state.currentwallet && $store.state.currentwallet.user"
                  >My Deposits</a
                >
              </li>
               <li v-if="false && $store.state.currentwallet && $store.state.currentwallet.user" class="navigation-li nav-li3">
                <a href="javascript:alert('In progress')" class="nav-a heading-SB"
                  >History</a
                >
              </li>
              <li class="navigation-li nav-li4" v-if="false">
                <p class="nav-a heading-SB dots-menu">...</p>
                <ul class="drop-down-ul">
                  <li class="drop-down-li">
                    <a href="../Pages/About.html" class="drop-down-a heading-SB"
                      >About</a
                    >
                  </li>
                  <li class="drop-down-li">
                    <a
                      href="../Pages/Contact.html"
                      class="drop-down-a heading-SB"
                      >Contact</a
                    >
                  </li>
                  <li class="drop-down-li">
                    <a
                      href="../Pages/How-It-Works.html"
                      class="drop-down-a heading-SB"
                      >How It Work</a
                    >
                  </li>
                  <li class="drop-down-li">
                    <a href="../Pages/Blog.html" class="drop-down-a heading-SB"
                      >Blog</a
                    >
                  </li>
                  <li class="drop-down-li">
                    <a href="../Pages/Faqs.html" class="drop-down-a heading-SB"
                      >FAQs</a
                    >
                  </li>
                  <li class="drop-down-li">
                    <p class="drop-down-a heading-SB">Other Pages</p>
                    <ul class="drop-down-ul-other">
                      <li class="drop-down-li-other">
                        <a
                          href="../Pages/Login.html"
                          class="drop-down-a-other heading-SB"
                          >Login</a
                        >
                      </li>
                      <li class="drop-down-li-other">
                        <a
                          href="../Pages/Signup.html"
                          class="drop-down-a-other heading-SB"
                          >Sign Up</a
                        >
                      </li>
                      <li class="drop-down-li-other">
                        <a
                          href="../Pages/404.html"
                          class="drop-down-a-other heading-SB"
                          >404</a
                        >
                      </li>
                      <li class="drop-down-li-other">
                        <a
                          href="../Pages/Privacy-policy.html"
                          class="drop-down-a-other heading-SB"
                          >Privacy Policy</a
                        >
                      </li>
                      <li class="drop-down-li-other">
                        <a
                          href="../Pages/Terms-of-services.html"
                          class="drop-down-a-other heading-SB"
                          >Terms of Services</a
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="action-nav">

            <div class="action right-space"  @click="$refs.metamask.setConnectDialog(true)">
              <a @click="clickBtn('connectBtn')" v-if="!($refs.metamask && $refs.metamask.user && $refs.metamask.user.address)" href="javascript:void(0)" class="btn-primary-1 heading-SB"
                ><span  >
                <q-spinner color="white" v-if="$refs.metamask && $refs.metamask.connectLoading"/>
                Connect wallet
              </span>
              </a>

            </div>
              <MetamaskConnect  v-show="$refs.metamask && $refs.metamask.user && $refs.metamask.user.address" ref="metamask" class="justify-end col" />
            <div class="notification-main right-space">
              <div class="icon-notification-otr">
                <i class="ri-notification-2-line notification-icon"></i>
                <span class="dot"></span>
              </div>
              <div class="notification-drop">
                <div class="Heading-otr">
                  <p class="heading heading-LB">Notification</p>
                  <a href="" class="linkk heading-SB">See All</a>
                </div>
                <ul class="notification-ul">
                  <li class="notification-li">
                    <a href="" class="notification-a">
                      <div class="img-otr">
                        <img
                          class="img img-fluid"
                          src="https://i.gadgets360cdn.com/large/cryptopunk_6046_twitter_small_1634554158507.jpg"
                          alt="artwork"
                        />
                      </div>
                      <div class="content-otr">
                        <p class="name heading-SB">Abstract Art</p>
                        <p class="price heading-S">New bid: 1.21 ETH</p>
                      </div>
                    </a>
                  </li>
                  <li class="notification-li">
                    <a href="" class="notification-a">
                      <div class="img-otr">
                        <img
                          class="img img-fluid"
                          src="https://ethernal-blue.ansarians.com/assets/img/cover-img2.png"
                          alt="artwork"
                        />
                      </div>
                      <div class="content-otr">
                        <p class="name heading-SB">Multicolored Abstract Art</p>
                        <p class="price heading-S">New bid: 3.211 ETH</p>
                      </div>
                    </a>
                  </li>
                  <li class="notification-li">
                    <a href="" class="notification-a">
                      <div class="img-otr">
                        <img
                          class="img img-fluid"
                          src="https://ethernal-blue.ansarians.com/assets/img/cover-img3.png"
                          alt="artwork"
                        />
                      </div>
                      <div class="content-otr">
                        <p class="name heading-SB">Multicolored Face Art</p>
                        <p class="price heading-S">New bid: 8.100 ETH</p>
                      </div>
                    </a>
                  </li>
                  <li class="notification-li">
                    <a href="" class="notification-a">
                      <div class="img-otr">
                        <img
                          class="img img-fluid"
                          src="https://ethernal-blue.ansarians.com/assets/img/cover-img4.png"
                          alt="artwork"
                        />
                      </div>
                      <div class="content-otr">
                        <p class="name heading-SB">Face Supreme Flag</p>
                        <p class="price heading-S">New bid: 3.46 ETH</p>
                      </div>
                    </a>
                  </li>
                  <li class="notification-li">
                    <a href="" class="notification-a">
                      <div class="img-otr">
                        <img
                          class="img img-fluid"
                          src="https://ethernal-blue.ansarians.com/assets/img/cover-img6.png"
                          alt="artwork"
                        />
                      </div>
                      <div class="content-otr">
                        <p class="name heading-SB">Abstract Art</p>
                        <p class="price heading-S">New bid: 1.04 ETH</p>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="profile-nav-main">
              <div class="profile-nav" @click="$store.state.currentwallet && $store.state.currentwallet.user ? $router.push('/staider/dashboard') : clickBtn('connectBtn')">
                <div class="img-otr">
                  <img
                    class="nav-prof-img"
                    onerror="this.src='https://i.gadgets360cdn.com/large/cryptopunk_6046_twitter_small_1634554158507.jpg';"
                    :src="$store.state.currentwallet.user && $store.state.currentwallet.user.avatar ? $store.state.currentwallet.user.avatar : 'https://i.gadgets360cdn.com/large/cryptopunk_6046_twitter_small_1634554158507.jpg'"
                    alt="Avatar"
                  />
                </div>
                <p v-if="$store.state.currentwallet && $store.state.currentwallet.user" class="desc heading-SB">{{$store.state.currentwallet.user.addressFriendly}}</p>
              </div>
              <div class="profile-pop-otr">
                <div class="copy-icon-otr">
                  <p class="text heading-SB">13b9ebda035r178...</p>
                  <i class="ri-file-copy-line copy-icon"></i>
                </div>
                <div class="balance-otr">
                  <div class="img-etherem">
                    <img
                      class="etherem"
                      src="https://ethernal-blue.ansarians.com/assets/img/ethereum.png"
                      alt="img"
                    />
                  </div>
                  <div class="balance">
                    <p class="text heading-S">Balance</p>
                    <p class="price heading-L">3.756 ETH</p>
                  </div>
                </div>
                <ul class="link-profile-ul">
                  <li class="link-profile-li">
                    <a href="" class="link-profile-a heading-SB">My Item</a>
                  </li>
                  <li class="link-profile-li">
                    <a href="" class="link-profile-a heading-SB"
                      >Edit Profile</a
                    >
                  </li>
                  <li  class="link-profile-li">
                    <a  href="javascript:void(0)" class="link-profile-a heading-SB">Logout</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="burger-icon-otr flex flex-center" @click="clickBtn( $store.state.currentwallet && $store.state.currentwallet.user ? 'logoutBtn' : 'connectBtn')">
             <q-icon :name="$store.state.currentwallet && $store.state.currentwallet.user ? 'logout' : 'add' " color="white" size="md" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--==================================
            Navbar End Here
    ===================================-->

    <!--==================================
            Hero Section Start Here
    ===================================-->

    <div class="hero4-main">
      <div class="container-fluid">
        <div class="row row-custom" v-if="$route.path == '/'">
          <div class="col-content-otr" style="z-index: 1">
            <div class="col-content-inr">
              <p v-if="!explore" class="tag heading-L">
                On-chain asset management
              </p>
              <h1 v-if="!explore" class="heading heading-h1 text-h6">
                Grow your portfolio <br />
                on autopilot
              </h1>
              <h1 v-else class="heading heading-h1 text-h6">
                Explore available funds
              </h1>

              <p class="desc heading-L" v-if="!explore">
                Deposit whilst retaining <br />
                full custody of your assets.
              </p>
              <div class="action" v-if="!explore">
                <a
                  href="javascript:void(0)"
                  @click="$router.push('/staider/explore')"
                  class="btn-primary-1 btn-hero heading-SB"
                  ><img style="height: 40px;" src="https://img.icons8.com/emoji/452/rocket-emji.png" /> Launch app</a
                >
                <a
                  href="javascript:void(0)"
                  v-if="!$store.state.currentwallet.user"
                  @click="clickBtn('connectBtn')"
                  class="btn-primary-2 btn-hero heading-SB"
                  >Connect Wallet</a
                >
                <a
                  v-else
                  @click="$router.push('/staider/dashboard')"
                  href="javascript:void(0)"

                  class="btn-primary-2 btn-hero heading-SB"
                  >My deposits</a
                >
              </div>
            </div>
          </div>
          <img
            class="lines"
            src="https://ethernal-blue.ansarians.com/assets/img/hero-bg-line.svg"
            alt="lines"
          />
        </div>
      </div>
    </div>
    <div class="dark-theme">
      <router-view class="main-container container-fluid-vaults" />

      <div class="mt-md-5 mb-3 mb-md-5 mt-1 row container-fluid-vaults" v-if="$route.path == '/staider/explore'">
        <div class="pt-3 pt-md-5 col-md-7">
          <h3
            class="
              components__Heading3-sc-1p359sy-0
              CardsSection__Heading-sc-18tl6tu-2
              lfRDjd
              gNCqqB
              mb-3
              mt-3
            "
          >
            Come discover our Vaults <br>and  their performance
          </h3>
          <p class="CardsSection__LandingParagraph-sc-18tl6tu-4 fseeQh mt-4">
            Discover and follow the best yield farmers with just one click.
            Historical APY, farming philosophy, risk appetite; You can see it
            all.
          </p>
          <div class="position-relative d-inline-block mt-4" v-if="false">
             <div class="action">
                  <a
                    href="./Upload.html"
                    class="btn-primary-1 btn-action heading-SB"
                    >Discover our vaults</a
                  >
                </div>
          </div>
          <div
            class="
              d-flex
              flex-column
              align-items-center align-items-sm-end
              pr-sm-3 pr-0
            "
          >
            <div
              class="CardsSection__CardCol-sc-18tl6tu-7 hgcTzH col-lg-8 mt-5"
            >
              <div  @click="$router.push('/staider/fund/0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a')"
                         class="cursor-pointer CardsSection__AnimationDiv-sc-18tl6tu-8 eBhvSM">
                <div class="fadeIn">
                  <div class="PopularStrategy__Papper-sc-1tgn6vt-0 fahheg">
                    <div
                      class="PopularStrategy__PapperInner-sc-1tgn6vt-1 heMQma"
                    >
                      <div class="p-0 container">
                        <div
                          class="
                            PopularStrategy__TitleRow-sc-1tgn6vt-4
                            iXbspm
                            row
                          "
                        >
                          <div
                            class="
                              d-flex
                              align-items-center
                              cursor-pointer
                              col-sm-12
                            "
                          >
                            <img
                              src="data:image/png;base64,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"
                              class="CardsSection__Image-sc-18tl6tu-0 bDysHy"
                            />
                            <div>
                              <h5
                                font-size="1.25rem"
                                class="
                                  PopularStrategy__Title-sc-1tgn6vt-9
                                  ijLJAP
                                  ml-3
                                  mb-0
                                "
                              >
                                SIF USDC
                              </h5>
                              <small class="ml-3" style="font-size: 14px"
                                ><span class="font-weight-bold">256</span>
                                investors</small
                              >
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div
                      class="
                        p-4
                        d-flex
                        flex-column
                        justify-content-between
                        h-100
                      "
                    >
                      <div>
                        <div class="d-flex justify-content-between">
                          <div>
                            <p
                              class="
                                PopularStrategy__TotalValue-sc-1tgn6vt-10
                                dmPCjI
                                mb-1
                              "
                            >
                              Total Value
                            </p>
                            <h5 class="text-uppercase">24,049.22 USD</h5>
                          </div>
                          <div class="text-right" style="min-height: 80px">
                            <div style="text-align: right; padding-left: 10px">
                              <img
                                src="https://don-strapi.fra1.digitaloceanspaces.com/mediumrisk_a8ed4d8589.svg"
                                alt="ImageNotFound"
                                style="fill: green; width: 80px"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div class="mb-3">
                            <p
                              class="
                                PopularStrategy__TotalValue-sc-1tgn6vt-10
                                dmPCjI
                                mb-1
                              "
                            >
                              APY
                            </p>
                            <h5
                              class="primary-text"
                              style="color: rgb(255, 196, 6)"
                            >
                              ??%
                            </h5>
                          </div>
                          <div>
                            <p
                              class="
                                PopularStrategy__TotalValue-sc-1tgn6vt-10
                                dmPCjI
                                mb-1
                                font-weight-bold
                              "
                            >
                              Daily change

                            </p>
                            <h5
                              class="primary-text text-right"
                              style="color: rgb(49, 199, 127)"
                            >
                              -3.38 %

                            </h5>
                          </div>
                        </div>
                        <h5
                          class="
                            PopularStrategy__DescriptionTitle-sc-1tgn6vt-11
                            egWYwc
                            popularstrategy__content__title
                          "
                        >
                          SIF USDC
                        </h5>
                        <div class="d-flex flex-column justify-content-between">
                          <p
                            class="
                              PopularStrategy__DescriptionContent-sc-1tgn6vt-2
                              iqwhds
                              popularstrategy__content__text

                            "
                          >
                            SIF USDC, is a private fund allowing bla bla blahbla bla blahbla bla blahbla bla blah

                          </p>
                        </div>
                      </div>
                      <div>
                      <br/>
                        <button
                          class="

                            ButtonWidget__OutlineVariant-sc-18pwknb-1
                            gfOGd
                            cursor-pointer
                          "
                          height="40px"
                        >
                          Open fund
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 pt-md-5 col-md-5">
          <div     class="cursor-pointer CardsSection__CardCol-sc-18tl6tu-7 hgcTzH col-lg-11">
            <div class="mt-4">
              <div @click="$router.push('/staider/fund/private')" class="CardsSection__AnimationDiv-sc-18tl6tu-8 eBhvSM cursor-pointer">
                <div class="fadeIn">
                  <div class="PopularStrategy__Papper-sc-1tgn6vt-0 fahheg">
                    <div
                      class="PopularStrategy__PapperInner-sc-1tgn6vt-1 heMQma"
                    >
                      <div class="p-0 container">
                        <div
                          class="
                            PopularStrategy__TitleRow-sc-1tgn6vt-4
                            iXbspm
                            row
                          "
                        >
                          <div
                            class="
                              d-flex
                              align-items-center
                              cursor-pointer
                              col-sm-12
                            "
                          >
                            <img
                              src="https://verto.volentix.io/statics/img/staider-logo.png"
                              class="CardsSection__Image-sc-18tl6tu-0 bDysHy"
                            />
                            <div>
                              <h5
                                font-size="1.25rem"
                                class="
                                  PopularStrategy__Title-sc-1tgn6vt-9
                                  ijLJAP
                                  ml-3
                                  mb-0
                                "
                              >
                                 Staider Private vault
                              </h5>
                              <small class="ml-3" style="font-size: 14px"
                                ><span class="font-weight-bold">108</span>
                                investors</small
                              >
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div
                      class="
                        p-4
                        d-flex
                        flex-column
                        justify-content-between
                        h-100
                      "
                    >
                      <div>
                        <div class="d-flex justify-content-between">
                          <div>
                            <p
                              class="
                                PopularStrategy__TotalValue-sc-1tgn6vt-10
                                dmPCjI
                                mb-1
                              "
                            >
                              Total Value
                            </p>
                            <h5 class="text-uppercase">~USD 800,000</h5>
                          </div>
                          <div class="text-right" style="min-height: 80px">
                            <div style="text-align: right; padding-left: 10px">
                              <img
                                src="https://don-strapi.fra1.digitaloceanspaces.com/highrisk_55914836d3.svg"
                                alt="ImageNotFound"
                                style="fill: green; width: 80px"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div class="mb-3">
                            <p
                              class="
                                PopularStrategy__TotalValue-sc-1tgn6vt-10
                                dmPCjI
                                mb-1
                              "
                            >
                              APY
                            </p>
                            <h5
                              class="primary-text"
                              style="color: rgb(255, 196, 6)"
                            >
                              35%
                            </h5>
                          </div>
                          <div>
                            <p
                              class="
                                PopularStrategy__TotalValue-sc-1tgn6vt-10
                                dmPCjI
                                mb-1
                                font-weight-bold
                              "
                            >
                              APY
                            </p>
                            <h5
                              class="primary-text text-right"
                              style="color: rgb(49, 199, 127)"
                            >
                              +135%
                            </h5>
                          </div>
                        </div>
                        <h5
                          class="
                            PopularStrategy__DescriptionTitle-sc-1tgn6vt-11
                            egWYwc
                            popularstrategy__content__title
                          "
                        >
                          Invite-only vault
                        </h5>
                        <div class="d-flex flex-column justify-content-between">
                          <p
                            class="
                              PopularStrategy__DescriptionContent-sc-1tgn6vt-2
                              iqwhds
                              popularstrategy__content__text
                            "
                          >
                            SIF USDC, is a private fund allowing bla bla blahbla bla blahbla bla blahbla bla blah

                          </p>
                        </div>
                      </div>
                      <div> <br/>
                        <button
                          class="
                            ButtonWidget__OutlineVariant-sc-18pwknb-1
                            gfOGd
                            cursor-pointer
                          "

                          height="40px"
                        >
                          Open fund
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div  @click="$router.push('/staider/fund/0x9b8b0b8730adb767b79d80839215b733c4357e9f')"
 class="CardsSection__StrategyDiv-sc-18tl6tu-3 kNjIeX cursor-pointer">
              <div class="CardsSection__AnimationDiv-sc-18tl6tu-8 eBhvSM">
                <div class="fadeIn">
                  <div class="PopularStrategy__Papper-sc-1tgn6vt-0 fahheg">
                    <div
                      class="PopularStrategy__PapperInner-sc-1tgn6vt-1 heMQma"
                    >
                      <div class="p-0 container">
                        <div
                          class="
                            PopularStrategy__TitleRow-sc-1tgn6vt-4
                            iXbspm
                            row
                          "
                        >
                          <div
                            class="
                              d-flex
                              align-items-center
                              cursor-pointer
                              col-sm-12
                            "
                          >
                            <img
                              src="data:image/png;base64,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"
                              class="CardsSection__Image-sc-18tl6tu-0 bDysHy"
                            />
                            <div>
                              <h5
                                font-size="1.25rem"
                                class="
                                  PopularStrategy__Title-sc-1tgn6vt-9
                                  ijLJAP
                                  ml-3
                                  mb-0
                                "
                              >
                                SIF STAIDER INDEX FUND
                              </h5>
                              <small class="ml-3" style="font-size: 14px"
                                ><span class="font-weight-bold">0</span>
                                investors</small
                              >
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div
                      class="
                        p-4
                        d-flex
                        flex-column
                        justify-content-between
                        h-100
                      "
                    >
                      <div>
                        <div class="d-flex justify-content-between">
                          <div>
                            <p
                              class="
                                PopularStrategy__TotalValue-sc-1tgn6vt-10
                                dmPCjI
                                mb-1
                              "
                            >
                              Total Value
                            </p>
                            <h5 class="text-uppercase">0 WETH</h5>
                          </div>
                          <div class="text-right" style="min-height: 80px">
                            <div style="text-align: right; padding-left: 10px">
                              <img
                                src="https://don-strapi.fra1.digitaloceanspaces.com/highrisk_55914836d3.svg"
                                alt="ImageNotFound"
                                style="fill: green; width: 80px"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div class="mb-3">
                            <p
                              class="
                                PopularStrategy__TotalValue-sc-1tgn6vt-10
                                dmPCjI
                                mb-1
                              "
                            >
                              APY
                            </p>
                            <h5
                              class="primary-text"
                              style="color: rgb(255, 196, 6)"
                            >
                              N/A%
                            </h5>
                          </div>
                          <div>
                            <p
                              class="
                                PopularStrategy__TotalValue-sc-1tgn6vt-10
                                dmPCjI
                                mb-1
                                font-weight-bold
                              "
                            >
                              APY
                            </p>
                            <h5
                              class="primary-text text-right"
                              style="color: rgb(49, 199, 127)"
                            >
                              0%
                            </h5>
                          </div>
                        </div>
                        <h5
                          class="
                            PopularStrategy__DescriptionTitle-sc-1tgn6vt-11
                            egWYwc
                            popularstrategy__content__title
                          "
                        >
                          SIF STAIDER INDEX FUND
                        </h5>
                        <div class="d-flex flex-column justify-content-between">
                          <p
                            class="
                              PopularStrategy__DescriptionContent-sc-1tgn6vt-2
                              iqwhds
                              popularstrategy__content__text
                            "
                          >
                            SIF STAIDER INDEX FUND - blah blahblah blahblah blahblah blahblah blahblah blahblah blahblah blah
                          </p>
                        </div>
                      </div>
                      <div> <br/>
                        <button
                          class="
                            ButtonWidget__OutlineVariant-sc-18pwknb-1
                            gfOGd
                          "

                          height="40px"
                        >
                          Open fund
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <GetStarted />
      <div class="row q-px-lg funds" v-if="$route.path == '/'">
        <div class="col-lg-4" v-for="(item, index) in funds" :key="index">
          <a
            class="TokenInfo__InfoWrapper-sc-15z5ssg-0 hLWUXo"
            href="javascript:void(0)"
            @click="$router.push(item.to)"
            ><div class="row">
              <div class="col-md-6 flex flex-wrap">
                <div class="mr-2 q-pr-sm">
                  <img
                    :src="item.icon"
                    alt="token"
                    style="width: 40px"
                  />
                </div>
                <div>
                  <span class="TokenInfo__SubText-sc-15z5ssg-5 kHFrFx"
                    >Deposit with</span
                  ><br />
                  <div class="TokenInfo__Heading-sc-15z5ssg-2 eRCDwj text-h6">
                    {{item.symbol}}
                  </div>
                </div>
              </div>
              <div
                class="col-md-6 text-right align-items-end justify-content-end"
              >
                <span class="TokenInfo__SubText-sc-15z5ssg-5 kHFrFx"
                  >Network</span
                ><br />
                <div class="TokenInfo__Heading-sc-15z5ssg-2 eRCDwj text-h6">
                  {{item.network}}
                </div>
              </div>
              <div
                class="col-md-6 flex align-items-center justify-content-end"
              ></div>
            </div>
            <div class="row">
              <div class="col-md-5 justify-content-end">
                <div
                  class="text-h6"
                  style="
                    font-size: 18px;
                    font-weight: 900;
                    font-family: Poppins;
                  "
                >
                  {{item.apy}}
                </div>
                <span class="TokenInfo__SubText-sc-15z5ssg-5 kHFrFx"
                  >Up to APY</span
                >
              </div>
              <div class="col-md-7 text-right">
                <q-btn :label="item.btnLabel" outline rounded />
              </div></div
          ></a>
        </div>
      </div>
    </div>
    <div class="cal-to-action-main" v-if="$route.path == '/'">
      <div class="container-fluid">
        <div class="row row-custom">
          <div class="col-lg-6 col-content-otr">
            <div class="col-content-inr">
              <h2 class="heading heading-h2">
                Invest, monitor &amp; manage <br />
                your investment <span class="heading-inr">potfolio</span>
              </h2>
              <p class="desc heading-M">
                You can filter strategies by assets, risk and performance,
                <br />
                and find one that fits your risk profile.
              </p>
              <div class="btn-otr">
                <div class="action">
                  <a
                    href="./Upload.html"
                    class="btn-primary-1 btn-action heading-SB"
                    >Explore funds</a
                  >
                </div>
                <div class="action">
                  <a
                   @click="clickBtn('connectBtn')"
                    href="javascript:void(0)"
                    class="btn-primary-2 btn-action heading-SB"
                    >Connect Wallet</a
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-lg-6 logos flex flex-center"
            style="
              will-change: transform;
              transition: all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s;
              transform: perspective(1000px) rotateX(0deg) rotateY(0deg)
                scale3d(1, 1, 1);
            "
          >
            <div class="relative">
              <span
                class="absolute inset-0 bg-gradient-to-t from-white z-10"
              ></span>
              <div class="flex flex-col items-center justify-center z-0">
                <div class="flex justify-around">
                  <span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x4575f41308ec1483f3d399aa9a2826d74da13deb"
                      alt="Orchid" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
                      alt="Maker" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x123151402076fc819b7564510989e475c9cd93ca"
                      alt="wrapped-DGLD" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x0000000000085d4780b73119b644ae5ecd22b376"
                      alt="TrueUSD" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x0ae055097c6d159879521c384f1d2123d1f195e6"
                      alt="STAKE" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0xba11d00c5f74255f56a5e366f4f77f5a186d7f55"
                      alt="BandToken" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b"
                      alt="DefiPulse Index" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x584bc13c7d411c00c01a62e8019472de68768430"
                      alt="Hegic" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0xb8c77482e45f1f44de1745f52c74426c631bdd52"
                      alt="BNB"
                  /></span>
                </div>
                <div class="flex justify-around">
                  <span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x56d811088235f11c8920698a204a5010a788f4b3"
                      alt="bZx Protocol Token" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x4f9254c83eb525f9fcf346490bbb3ed28a81c667"
                      alt="CelerToken" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0xed91879919b71bb6905f23af0a68d231ecf87b14"
                      alt="DMM: Governance" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0xe41d2489571d322189246dafa5ebde1f4699f498"
                      alt="0x Protocol Token" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x4c19596f5aaff459fa38b0f7ed92f11ae6543784"
                      alt="TrueFi" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0xdd974d5c2e2928dea5f71b9825b8b646686bd200"
                      alt="Kyber Network Crystal" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0xd533a949740bb3306d119cc777fa900ba034cd52"
                      alt="Curve DAO Token" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x3845badade8e6dff049820680d1f14bd3903a5d0"
                      alt="SAND"
                  /></span>
                </div>
                <div class="flex justify-around">
                  <span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0xec67005c4e498ec7f55e092bd1d35cbc47c91892"
                      alt="Melon Token" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                      alt="USD Coin" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x4fe83213d56308330ec302a8bd641f1d0113a4cc"
                      alt="NuCypher" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x06af07097c9eeb7fd685c692751d5c66db49c215"
                      alt="Chai" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x5a98fcbea516cf06857215779fd812ca3bef1b32"
                      alt="Lido DAO Token" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e"
                      alt="yearn.finance" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x4e15361fd6b4bb609fa63c81a2be19d873717870"
                      alt="Fantom Token"
                  /></span>
                </div>
                <div class="flex justify-around">
                  <span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x0000000000095413afc295d19edeb1ad7b71c952"
                      alt="Tokenlon" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9"
                      alt="Swipe" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x3155ba85d5f96b2d030a4966af206230e46849cb"
                      alt="THORChain ETH.RUNE" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"
                      alt="Aave Token" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0xdac17f958d2ee523a2206206994597c13d831ec7"
                      alt="Tether USD" /></span
                  ><span
                    class="
                      rounded-full
                      lg:w-16 lg:h-16
                      md:m-4 md:w-12 md:h-12
                      m-2
                      w-10
                      h-10
                    "
                    ><img
                      src="https://token.enzyme.finance/0x0d8775f648430679a709e98d2b0cb6250d2887ef"
                      alt="Basic Attention Token"
                  /></span>
                </div>
              </div>
            </div>
            <div
              class="glare-wrapper"
              style="
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                overflow: hidden;
              "
            >
              <div
                class="glare"
                style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform-origin: 0% 0%;
                  pointer-events: none;
                  width: 1336.36px;
                  height: 1336.36px;
                  transform: rotate(0deg) translate(-50%, -50%);
                  opacity: 0;
                  background: linear-gradient(
                    0deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgb(255, 255, 255) 100%
                  );
                  transition: opacity 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99)
                    0s;
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Faqs style="margin-top:-50px" v-if="$route.path == '/'" />
    <div class="footer-main">
      <div class="container-fluid">
        <div class="row row-custom">
          <div class="col-lg-3 col-md-6 col-logo-otr">
            <div class="col-logo-inr">
              <div class="logo-otr">
                <a href="javascript:void(0)" @click="$router.push('/');" class="logo-inr">
                  <img
                    class="img-logo"
                    src="/statics/img/white-logo-staider.png"
                    alt="Logo"
                  />
                </a>
              </div>
              <div class="social-icon">
                <ul class="icon-ul">
                  <li class="icon-li">
                    <a href="javascript:void(0)" class="icon-a">
                      <img
                        class="icon"
                        src="https://ethernal-blue.ansarians.com/assets/img/social-icon1.svg"
                        alt="icon"
                      />
                    </a>
                  </li>
                  <li class="icon-li">
                    <a href="javascript:void(0)" class="icon-a">
                      <img
                        class="icon"
                        src="https://ethernal-blue.ansarians.com/assets/img/social-icon2.svg"
                        alt="icon"
                      />
                    </a>
                  </li>
                  <li class="icon-li">
                    <a href="javascript:void(0)" class="icon-a">
                      <img
                        class="icon"
                        src="https://ethernal-blue.ansarians.com/assets/img/social-icon3.svg"
                        alt="icon"
                      />
                    </a>
                  </li>
                  <li class="icon-li">
                    <a href="javascript:void(0)" class="icon-a">
                      <img
                        class="icon"
                        src="https://ethernal-blue.ansarians.com/assets/img/social-icon4.svg"
                        alt="icon"
                      />
                    </a>
                  </li>
                  <li class="icon-li">
                    <a href="javascript:void(0)" class="icon-a">
                      <img
                        class="icon"
                        src="https://ethernal-blue.ansarians.com/assets/img/social-icon5.svg"
                        alt="icon"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-explore-otr">
            <div class="col-explore-inr">
              <div class="explore-otr">
                <h4 class="heading heading-h4">Explore</h4>
                <ul class="explore-ul">
                  <li class="explore-li">
                    <a
                      href="javascript:void(0)"
                      class="explore-a heading-S"
                      >Explore funds</a
                    >
                  </li>
                  <li class="explore-li">
                    <a
                    href="javascript:void(0)"
                      class="explore-a heading-S"
                      >Team</a
                    >
                  </li>
                  <li class="explore-li">
                    <a
                      href="javascript:void(0)"
                      class="explore-a heading-S"
                      >Roadmap</a
                    >
                  </li>

                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-md-6 col-navigation-otr">
            <div class="col-navigation-inr">
              <div class="navigation-otr">
                <h4 class="heading heading-h4">Support</h4>
                <ul class="navigation-ul">
                  <li class="navigation-li">
                    <a href="javascript:void(0)" class="navigation-a heading-S"
                      >Faqs</a
                    >
                  </li>
                  <li class="navigation-li">
                    <a
                      href="javascript:void(0)"
                      class="navigation-a heading-S"
                      >Telegram</a
                    >
                  </li>
                  <li class="navigation-li">
                    <a
                       href="javascript:void(0)"
                      class="navigation-a heading-S"
                      >Contact us</a
                    >
                  </li>

                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-subscribe-otr">
            <div class="col-subscribe-inr">
              <h4 class="heading heading-h4">
                Receive Updates
              </h4>
              <div class="email-otr">
                <input
                  type="Email"
                  class="input heading-SB"
                  placeholder="Email Address"
                />
              </div>
              <div class="action">
                <a href="" class="btn-primary-1 heading-SB">Subscribe Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright-main">
      <div class="container-fluid">
        <div class="wrapper">
          <p class="copy-right heading-S">
            Copyright © 2021 by
            <a href="#" target="_blank" class="linkk heading-SB">
              Volentix Labs
            </a>
            . All rights reserved.
          </p>
          <div class="linkk-otr">
            <p class="linkk-inr">
              <a
                href="../Pages/Privacy-policy.html"
                class="linkk-page heading-S"
                >Privacy Policy
              </a>
              •
              <a
                href="../Pages/Terms-of-services.html"
                class="linkk-page heading-S"
              >
                Terms of Service</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Lib from '@/util/walletlib'
import MetamaskConnect from 'components/Moralis/MetamaskConnect'
import Formatter from '../mixins/Formatter'
import GetStarted from 'pages/Staider/HowToGetStarted'
import Faqs from 'pages/Staider/Faqs.vue'
export default {
  components: {
    MetamaskConnect,
    GetStarted,
    Faqs
  },
  watch: {
    '$store.state.currentwallet.user': async function (val) {
      if (val) {
        let wallets = Lib.getWallets('eth')
        let nfts = []
        wallets.forEach(async (element, i) => {
          if (nfts.length) return
          nfts = await Lib.fetchNfts(element.key)
          if (nfts && nfts.length) {
            this.$store.state.currentwallet.user.avatar = nfts[0].assetImg
          }
        }
        )
      }
    }
  },
  data () {
    return {
      funds: [
        { symbol: 'USDC',
          icon: 'https://token.enzyme.finance/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          apy: 'N/A',
          btnLabel: 'Deposit',
          network: 'Ethereum',
          to: '/staider/fund/0x185a02fd5576817fa0c9847cd6f2acc6707bfa0a'
        },
        {
          symbol: 'DAI',
          icon: 'https://token.enzyme.finance/0x6b175474e89094c44da98b954eedeac495271d0f',
          apy: 'N/A',
          btnLabel: 'Deposit',
          network: 'Ethereum',
          to: '/staider/fund/0x1da7ea480ed3f6a681f3e6069c07adb3eed9d6dd'
        },
        {
          symbol: 'WETH',
          icon: 'https://token.enzyme.finance/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          apy: 'N/A',
          btnLabel: 'Deposit',
          network: 'Ethereum',
          to: '/staider/fund/0x9b8b0b8730adb767b79d80839215b733c4357e9f'
        }
      ],
      explore: false
    }
  },
  mixins: [Formatter],
  created () {
    let c = window.localStorage.getItem('currency')
    if (!c) {
      window.localStorage.setItem('currency', 'usd')
    }
    this.$store.dispatch('tokens/getTokenList')
    this.$store.state.settings.lightMode = 'true'

    this.$store.dispatch('tokens/getTokenList')
    this.$store.dispatch('settings/getSettings')

    let ids = ['volentix-vtx']
    this.$store.dispatch('tokens/getTokenMarketData', ids)
    this.$store.dispatch('tokens/getEvmsTokensData')
  }
}
</script>
<style scoped>
.active-menu {
  color:#019dea !important
}
*,
::after,
::before {
  box-sizing: border-box;
}
h1,
h2,
h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}
h1 {
  font-size: calc(1.375rem + 1.5vw);
}
@media (min-width: 1200px) {
  h1 {
    font-size: 2.5rem;
  }
}
h2 {
  font-size: calc(1.325rem + 0.9vw);
}
@media (min-width: 1200px) {
  h2 {
    font-size: 2rem;
  }
}
h4 {
  font-size: calc(1.275rem + 0.3vw);
}
@media (min-width: 1200px) {
  h4 {
    font-size: 1.5rem;
  }
}
p {
  margin-top: 0;
  margin-bottom: 1rem;
}
ul {
  padding-left: 2rem;
}
ul {
  margin-top: 0;
  margin-bottom: 1rem;
}
ul ul {
  margin-bottom: 0;
}
a {
  color: #0d6efd;
  text-decoration: underline;
}
a:hover {
  color: #0a58ca;
}
img {
  vertical-align: middle;
}
input {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
::-moz-focus-inner {
  padding: 0;
  border-style: none;
}
.img-fluid {
  max-width: 100%;
  height: auto;
}
.container-fluid {
  width: 100%;
  padding-right: var(--bs-gutter-x, 0.75rem);
  padding-left: var(--bs-gutter-x, 0.75rem);
  margin-right: auto;
  margin-left: auto;
}
.row {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(var(--bs-gutter-y) * -1);
  margin-right: calc(var(--bs-gutter-x) * -0.5);
  margin-left: calc(var(--bs-gutter-x) * -0.5);
}
.row > * {
  flex-shrink: 0;
  max-width: 100%;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  margin-top: var(--bs-gutter-y);
}
@media (min-width: 768px) {
  .col-md-6 {
    flex: 0 0 auto;
    width: 50%;
  }
}
@media (min-width: 992px) {
  .col-lg-2 {
    flex: 0 0 auto;
    width: 16.66666667%;
  }
  .col-lg-3 {
    flex: 0 0 auto;
    width: 25%;
  }
  .col-lg-4 {
    flex: 0 0 auto;
    width: 33.33333333%;
  }
  .col-lg-6 {
    flex: 0 0 auto;
    width: 50%;
  }
}

[class^="ri-"] {
  font-family: "remixicon" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.ri-file-copy-line:before {
  content: "\ecd5";
}
.ri-menu-4-line:before {
  content: "\ef36";
}
.ri-notification-2-line:before {
  content: "\ef92";
}

.navbar-main-2 .container-fluid .wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0;
  position: relative;
  z-index: 10;
}
@media (max-width: 1199px) {
  .navbar-main-2 .container-fluid .wrapper {
    padding: 24px 0;
  }
}
.navbar-main-2 .container-fluid .wrapper .logo-otr .logo-a .logo-img {
  width: 234px;
}
@media (max-width: 575px) {
  .navbar-main-2 .container-fluid .wrapper .logo-otr .logo-a .logo-img {
    width: 110px;
  }
}
.navbar-main-2 .container-fluid .wrapper .navigation-otr {
  margin: 0 auto;
}
@media (max-width: 1199px) {
  .navbar-main-2 .container-fluid .wrapper .navigation-otr {
    display: none;
  }
}
.navbar-main-2 .container-fluid .wrapper .navigation-otr .navigation-inr {
  display: flex;
  align-items: center;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li {
  position: relative;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li:not(:last-child) {
  margin-right: 40px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li:hover
  .drop-down-ul {
  visibility: visible;
  opacity: 1;
  top: 50px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .nav-a {
  color: #ffffff;
  font-family: "Poppins-Medium";
  line-height: 50px;
  transition: 0.2s;
  cursor: pointer;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .nav-a:hover {
  color: #019dea;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .dots-menu {
  letter-spacing: 2px;
  position: relative;
  font-family: "Poppins-Bold";
  top: -2px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul {
  position: absolute;
  left: -24px;
  top: 70px;
  width: 230px;
  border-radius: 24px;
  background-color: #222f45;
  padding: 16px 24px 20px 24px;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 10;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li {
  position: relative;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li:not(:last-child) {
  margin-bottom: 12px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li:hover
  .drop-down-ul-other {
  opacity: 1;
  visibility: visible;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li
  .drop-down-a {
  color: #ffffff;
  display: inline;
  font-family: "Poppins-Medium";
  transition: 0.2s;
  cursor: pointer;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li
  .drop-down-a:hover {
  color: #019dea;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li
  .drop-down-ul-other {
  position: absolute;
  left: 180px;
  top: -24px;
  width: 230px;
  border-radius: 24px;
  background-color: #222f45;
  padding: 16px 24px 20px 24px;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 10;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li
  .drop-down-ul-other
  .drop-down-li-other {
  position: relative;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li
  .drop-down-ul-other
  .drop-down-li-other:not(:last-child) {
  margin-bottom: 12px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li
  .drop-down-ul-other
  .drop-down-li-other
  .drop-down-a-other {
  color: #ffffff;
  font-family: "Poppins-Medium";
  display: inline;
  transition: 0.2s;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .navigation-otr
  .navigation-inr
  .navigation-li
  .drop-down-ul
  .drop-down-li
  .drop-down-ul-other
  .drop-down-li-other
  .drop-down-a-other:hover {
  color: #019dea;
}
.navbar-main-2 .container-fluid .wrapper .action-nav {
  display: flex;
  align-items: center;
}
@media (max-width: 1199px) {
  .navbar-main-2 .container-fluid .wrapper .action-nav .action {
    display: none;
  }
}
.navbar-main-2 .container-fluid .wrapper .action-nav .notification-main {
  position: relative;
}
@media (max-width: 991px) {
  .navbar-main-2 .container-fluid .wrapper .action-nav .notification-main {
    display: block !important;
  }
}
@media (max-width: 767px) {
  .navbar-main-2 .container-fluid .wrapper .action-nav .notification-main {
    position: inherit;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .icon-notification-otr {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: rgba(255, 255, 255, 0.05);
}
@media (max-width: 575px) {
  .navbar-main-2
    .container-fluid
    .wrapper
    .action-nav
    .notification-main
    .icon-notification-otr {
    width: 40px;
    height: 40px;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .icon-notification-otr
  .notification-icon {
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
}
@media (max-width: 575px) {
  .navbar-main-2
    .container-fluid
    .wrapper
    .action-nav
    .notification-main
    .icon-notification-otr
    .notification-icon {
    font-size: 18px;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .icon-notification-otr
  .dot {
  width: 8px;
  height: 8px;
  border-radius: 50px;
  background-color: #019dea;
  position: absolute;
  top: 4px;
  right: 4px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop {
  position: absolute;
  background-color: #222f45;
  width: 400px;
  border-radius: 24px;
  padding: 24px 28px 32px 28px;
  top: 100px;
  right: 0;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
}
@media (max-width: 767px) {
  .navbar-main-2
    .container-fluid
    .wrapper
    .action-nav
    .notification-main
    .notification-drop {
    width: 100%;
    padding: 24px 15px 32px 15px;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop
  .Heading-otr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 24px 0;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop
  .Heading-otr
  .heading {
  color: #ffffff;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop
  .Heading-otr
  .linkk {
  color: #019dea;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop
  .notification-ul
  .notification-li:not(:last-child) {
  margin: 0 0 16px 0;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop
  .notification-ul
  .notification-li
  .notification-a {
  display: flex;
  align-items: center;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop
  .notification-ul
  .notification-li
  .notification-a
  .img-otr {
  width: 70px;
  height: 70px;
  margin: 0 16px 0 0;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop
  .notification-ul
  .notification-li
  .notification-a
  .img-otr
  .img {
  height: 100%;
  border-radius: 6px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop
  .notification-ul
  .notification-li
  .notification-a
  .content-otr
  .name {
  color: #ffffff;
  margin: 0 0 6px 0;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .notification-main
  .notification-drop
  .notification-ul
  .notification-li
  .notification-a
  .content-otr
  .price {
  color: #b7b7b7;
}
@media (max-width: 991px) {
  .navbar-main-2 .container-fluid .wrapper .action-nav .right-space {
    display: none;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .right-space:not(:last-child) {
  margin-right: 24px;
}
@media (max-width: 575px) {
  .navbar-main-2
    .container-fluid
    .wrapper
    .action-nav
    .right-space:not(:last-child) {
    margin-right: 0;
  }
}
.navbar-main-2 .container-fluid .wrapper .action-nav .profile-nav-main {
  position: relative;
}
@media (max-width: 1199px) {
  .navbar-main-2 .container-fluid .wrapper .action-nav .profile-nav-main {
    margin-right: 24px;
  }
}
@media (max-width: 767px) {
  .navbar-main-2 .container-fluid .wrapper .action-nav .profile-nav-main {
    position: inherit;
  }
}
@media (max-width: 575px) {
  .navbar-main-2 .container-fluid .wrapper .action-nav .profile-nav-main {
    margin: 0 12px;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-nav {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  height: 56px;
}
@media (max-width: 575px) {
  .navbar-main-2
    .container-fluid
    .wrapper
    .action-nav
    .profile-nav-main
    .profile-nav {
    height: 40px;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-nav
  .img-otr
  .nav-prof-img {
  height: 56px;
  width: 56px;
  border-radius: 12px 0 0 12px;
}
@media (max-width: 575px) {
  .navbar-main-2
    .container-fluid
    .wrapper
    .action-nav
    .profile-nav-main
    .profile-nav
    .img-otr
    .nav-prof-img {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-nav
  .desc {
  color: #ffffff;
  font-family: "Poppins-Medium";
  padding: 0 16px;
}
@media (max-width: 575px) {
  .navbar-main-2
    .container-fluid
    .wrapper
    .action-nav
    .profile-nav-main
    .profile-nav
    .desc {
    display: none;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr {
  position: absolute;
  background-color: #222f45;
  width: 300px;
  border-radius: 24px;
  padding: 24px 28px 32px 28px;
  top: 100px;
  right: 0;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
}
@media (max-width: 767px) {
  .navbar-main-2
    .container-fluid
    .wrapper
    .action-nav
    .profile-nav-main
    .profile-pop-otr {
    width: 100%;
    padding: 24px 15px;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .copy-icon-otr {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .copy-icon-otr
  .text {
  color: #ffffff;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .copy-icon-otr
  .copy-icon {
  font-size: 24px;
  color: #ffffff;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .balance-otr {
  display: flex;
  align-items: center;
  margin: 16px 0;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .balance-otr
  .img-etherem {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  width: 56px;
  height: 56px;
  border-radius: 100%;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .balance-otr
  .img-etherem
  .etherem {
  height: 32px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .balance-otr
  .balance {
  margin-left: 16px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .balance-otr
  .balance
  .text {
  color: #b7b7b7;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .balance-otr
  .balance
  .price {
  color: #ffffff;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .link-profile-ul
  .link-profile-li:not(:last-child) {
  margin-bottom: 12px;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .link-profile-ul
  .link-profile-li
  .link-profile-a {
  display: inline;
  font-family: "Poppins-Medium";
  color: #ffffff;
  transition: 0.3s;
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .profile-nav-main
  .profile-pop-otr
  .link-profile-ul
  .link-profile-li
  .link-profile-a:hover {
  color: #019dea;
}
.navbar-main-2 .container-fluid .wrapper .action-nav .burger-icon-otr {

  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  cursor: pointer;
}
@media (max-width: 1199px) {
  .navbar-main-2 .container-fluid .wrapper .action-nav .burger-icon-otr {
    display: flex;
  }
}
@media (max-width: 575px) {
  .navbar-main-2 .container-fluid .wrapper .action-nav .burger-icon-otr {
    width: 40px;
    height: 40px;
  }
}
.navbar-main-2
  .container-fluid
  .wrapper
  .action-nav
  .burger-icon-otr
  .burger-icon {
  font-size: 24px;
  color: #ffffff;
}
@media (max-width: 575px) {
  .navbar-main-2
    .container-fluid
    .wrapper
    .action-nav
    .burger-icon-otr
    .burger-icon {
    font-size: 18px;
  }
}
.footer-main {
  overflow: hidden;
  position: relative;
  padding: 88px 0;
  background: linear-gradient(
    252.07deg,
    rgba(1, 156, 234, 0.05) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
}
.footer-main::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(https://ethernal-blue.ansarians.com/assets/img/footer-bg-img.png);
  top: 0;
  left: 0;
  opacity: 0.6;
}
.footer-main .container-fluid .row-custom {
  position: relative;
  z-index: 2;
}
@media (max-width: 767px) {
  .footer-main .container-fluid .row-custom .col-logo-otr .col-logo-inr {
    padding: 0 0 48px 0;
  }
}
.footer-main
  .container-fluid
  .row-custom
  .col-logo-otr
  .col-logo-inr
  .logo-otr {
  margin: 0 0 8px 0;
}
.footer-main
  .container-fluid
  .row-custom
  .col-logo-otr
  .col-logo-inr
  .logo-otr
  .logo-inr
  .img-logo {
  width: 140px;
}
.footer-main
  .container-fluid
  .row-custom
  .col-logo-otr
  .col-logo-inr
  .social-icon
  .icon-ul {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.footer-main
  .container-fluid
  .row-custom
  .col-logo-otr
  .col-logo-inr
  .social-icon
  .icon-ul
  .icon-li {
  margin-top: 16px;
}
.footer-main
  .container-fluid
  .row-custom
  .col-logo-otr
  .col-logo-inr
  .social-icon
  .icon-ul
  .icon-li:not(:last-child) {
  margin-right: 16px;
}
.footer-main
  .container-fluid
  .row-custom
  .col-logo-otr
  .col-logo-inr
  .social-icon
  .icon-ul
  .icon-li
  .icon-a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  transition: 0.3s;
}
.footer-main
  .container-fluid
  .row-custom
  .col-logo-otr
  .col-logo-inr
  .social-icon
  .icon-ul
  .icon-li
  .icon-a:hover {
  background-color: #019dea;
}
.footer-main .container-fluid .row-custom .col-explore-otr .col-explore-inr {
  padding: 0 0 0 100px;
}
@media (max-width: 1300px) {
  .footer-main .container-fluid .row-custom .col-explore-otr .col-explore-inr {
    padding: 0 0 0 60px;
  }
}
@media (max-width: 1100px) {
  .footer-main .container-fluid .row-custom .col-explore-otr .col-explore-inr {
    padding: 0 0 0 30px;
  }
}
@media (max-width: 991px) {
  .footer-main .container-fluid .row-custom .col-explore-otr .col-explore-inr {
    padding: 0 0 48px 0;
  }
}
.footer-main
  .container-fluid
  .row-custom
  .col-explore-otr
  .col-explore-inr
  .explore-otr {
  margin: 0 0 36px 0;
}
@media (max-width: 767px) {
  .footer-main
    .container-fluid
    .row-custom
    .col-explore-otr
    .col-explore-inr
    .explore-otr {
    margin: 0 0 48px 0;
  }
}
.footer-main
  .container-fluid
  .row-custom
  .col-explore-otr
  .col-explore-inr
  .explore-otr
  .heading {
  color: #ffffff;
  margin: 0 0 12px 0;
}
.footer-main
  .container-fluid
  .row-custom
  .col-explore-otr
  .col-explore-inr
  .explore-otr
  .explore-ul
  .explore-li:not(:last-child) {
  margin: 0 0 8px 0;
}
.footer-main
  .container-fluid
  .row-custom
  .col-explore-otr
  .col-explore-inr
  .explore-otr
  .explore-ul
  .explore-li
  .explore-a {
  color: #b7b7b7;
  display: inline;
  transition: 0.3s;
}
.footer-main
  .container-fluid
  .row-custom
  .col-explore-otr
  .col-explore-inr
  .explore-otr
  .explore-ul
  .explore-li
  .explore-a:hover {
  color: #019dea;
}
.footer-main
  .container-fluid
  .row-custom
  .col-navigation-otr
  .col-navigation-inr {
  padding: 0 0 0 40px;
}
@media (max-width: 1300px) {
  .footer-main
    .container-fluid
    .row-custom
    .col-navigation-otr
    .col-navigation-inr {
    padding: 0 0 0 20px;
  }
}
@media (max-width: 1100px) {
  .footer-main
    .container-fluid
    .row-custom
    .col-navigation-otr
    .col-navigation-inr {
    padding: 0;
  }
}
@media (max-width: 767px) {
  .footer-main
    .container-fluid
    .row-custom
    .col-navigation-otr
    .col-navigation-inr {
    padding: 0 0 48px 0;
  }
}
.footer-main
  .container-fluid
  .row-custom
  .col-navigation-otr
  .col-navigation-inr
  .navigation-otr
  .heading {
  color: #ffffff;
  margin: 0 0 12px 0;
}
.footer-main
  .container-fluid
  .row-custom
  .col-navigation-otr
  .col-navigation-inr
  .navigation-otr
  .navigation-ul
  .navigation-li:not(:last-child) {
  margin: 0 0 8px 0;
}
.footer-main
  .container-fluid
  .row-custom
  .col-navigation-otr
  .col-navigation-inr
  .navigation-otr
  .navigation-ul
  .navigation-li
  .navigation-a {
  color: #b7b7b7;
  display: inline;
  transition: 0.3s;
}
.footer-main
  .container-fluid
  .row-custom
  .col-navigation-otr
  .col-navigation-inr
  .navigation-otr
  .navigation-ul
  .navigation-li
  .navigation-a:hover {
  color: #019dea;
}
.footer-main
  .container-fluid
  .row-custom
  .col-subscribe-otr
  .col-subscribe-inr {
  padding: 0 0 0 150px;
}
@media (max-width: 1300px) {
  .footer-main
    .container-fluid
    .row-custom
    .col-subscribe-otr
    .col-subscribe-inr {
    padding: 0 0 0 100px;
  }
}
@media (max-width: 1100px) {
  .footer-main
    .container-fluid
    .row-custom
    .col-subscribe-otr
    .col-subscribe-inr {
    padding: 0 0 0 70px;
  }
}
@media (max-width: 991px) {
  .footer-main
    .container-fluid
    .row-custom
    .col-subscribe-otr
    .col-subscribe-inr {
    padding: 0;
  }
}
.footer-main
  .container-fluid
  .row-custom
  .col-subscribe-otr
  .col-subscribe-inr
  .heading {
  color: #ffffff;
}
.footer-main
  .container-fluid
  .row-custom
  .col-subscribe-otr
  .col-subscribe-inr
  .email-otr {
  margin: 24px 0 32px 0;
}
.footer-main
  .container-fluid
  .row-custom
  .col-subscribe-otr
  .col-subscribe-inr
  .email-otr
  input {
  width: 100%;
}
.footer-main
  .container-fluid
  .row-custom
  .col-subscribe-otr
  .col-subscribe-inr
  .action {
  display: flex;
}
.copyright-main .container-fluid .wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0;
}
@media (max-width: 767px) {
  .copyright-main .container-fluid .wrapper {
    flex-direction: column;
    text-align: center;
  }
}
.copyright-main .container-fluid .wrapper .copy-right {
  color: #ffffff;
}
@media (max-width: 767px) {
  .copyright-main .container-fluid .wrapper .copy-right {
    margin: 0 0 16px 0;
  }
}
.copyright-main .container-fluid .wrapper .copy-right .linkk {
  display: inline;
  color: #019dea;
}
.copyright-main .container-fluid .wrapper .linkk-otr .linkk-inr {
  color: #ffffff;
}
.copyright-main .container-fluid .wrapper .linkk-otr .linkk-inr .linkk-page {
  display: inline;
  color: #ffffff;
  transition: 0.3s;
}
.copyright-main
  .container-fluid
  .wrapper
  .linkk-otr
  .linkk-inr
  .linkk-page:hover {
  color: #019dea;
}
.cal-to-action-main {
  margin: 128px 0;
  overflow: hidden;
}
.cal-to-action-main .container-fluid {
  position: relative;
}
.cal-to-action-main .container-fluid .row-custom {
  position: relative;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(
    252.07deg,
    rgba(1, 156, 234, 0.05) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
}
.cal-to-action-main .container-fluid .row-custom::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(https://ethernal-blue.ansarians.com/assets/img/footer-bg-img.png);
  top: 0;
  left: 0;
  opacity: 0.6;
}
.cal-to-action-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr {
  position: relative;
  padding: 72px 0 96px 72px;
  z-index: 2;
}
@media (min-width: 992px) and (max-width: 1199px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr {
    padding: 72px 0 96px 32px;
  }
}
@media (max-width: 575px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr {
    padding: 48px 15px 56px 15px;
  }
}
.cal-to-action-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .heading {
  color: #ffffff;
}
@media (max-width: 1100px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .heading
    br {
    display: none;
  }
}
@media (max-width: 1100px) and (max-width: 991px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .heading
    br {
    display: block;
  }
}
@media (max-width: 1100px) and (max-width: 575px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .heading
    br {
    display: none;
  }
}
.cal-to-action-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .heading
  .heading-inr {
  color: #019dea;
}
.cal-to-action-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .desc {
  color: #b7b7b7;
  margin: 8px 0 32px 0;
}
@media (max-width: 1100px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .desc
    br {
    display: none;
  }
}
@media (max-width: 1100px) and (max-width: 991px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .desc
    br {
    display: block;
  }
}
@media (max-width: 1100px) and (max-width: 575px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .desc
    br {
    display: none;
  }
}
.cal-to-action-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .btn-otr {
  display: flex;
  align-items: center;
}
@media (max-width: 420px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .btn-otr {
    flex-direction: column;
  }
}
@media (max-width: 420px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .btn-otr
    .action {
    width: 100%;
    text-align: center;
  }
}
.cal-to-action-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .btn-otr
  .action:not(:last-child) {
  margin: 0 24px 0 0;
}
@media (max-width: 420px) {
  .cal-to-action-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .btn-otr
    .action:not(:last-child) {
    margin: 0 0 24px 0;
  }
}
.cal-to-action-main .container-fluid .art-img {
  position: absolute;
  right: 130px;
  bottom: 0;
  height: 95%;
}
@media (max-width: 991px) {
  .cal-to-action-main .container-fluid .art-img {
    display: none;
  }
}
.hero4-main .container-fluid .row-custom {
  position: relative;
  width: 100%;
  margin: 0;
  background-image: url(https://ethernal-blue.ansarians.com/assets/img/hero-bg-img2.png);
  padding: 58px 15px;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 24px;
}
@media (min-width: 576px) and (max-width: 767px) {
  .hero4-main .container-fluid .row-custom {
    position: center;
  }
}
.hero4-main .container-fluid .row-custom .col-content-otr .col-content-inr {
  text-align: center;
}
.hero4-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .tag {
  color: #b7b7b7;
  margin-bottom: 12px;
}
.hero4-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .heading {
  color: #ffffff;
}
@media (max-width: 767px) {
  .hero4-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .heading
    br {
    display: none;
  }
}
@media (max-width: 575px) {
  .hero4-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .heading {
    font-size: 36px;
    line-height: 60px;
  }
}
.hero4-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .desc {
  color: #b7b7b7;
  margin: 20px 0 40px 0;
}
@media (max-width: 575px) {
  .hero4-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .desc {
    font-size: 16px;
    line-height: 28px;
  }
}
.hero4-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .action {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 420px) {
  .hero4-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .action {
    flex-direction: column;
    text-align: center;
  }
}
@media (max-width: 420px) {
  .hero4-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .action
    .btn-hero {
    width: 100%;
  }
}
.hero4-main
  .container-fluid
  .row-custom
  .col-content-otr
  .col-content-inr
  .action
  .btn-hero:not(:last-child) {
  margin: 0 24px 0 0;
}
@media (max-width: 420px) {
  .hero4-main
    .container-fluid
    .row-custom
    .col-content-otr
    .col-content-inr
    .action
    .btn-hero:not(:last-child) {
    margin: 0 0 24px 0;
  }
}
.hero4-main .container-fluid .row-custom .lines {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}
@media (max-width: 1100px) {
  .hero4-main .container-fluid .row-custom .lines {
    display: none;
  }
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
.body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background-color: #091830;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
a {
  display: block;
  text-decoration: none;
}
a:hover {
  text-decoration: none;
}
h1,
h2,
h4,
p {
  margin: 0px;
  padding: 0px;
}
.container-fluid {
  padding: 0 50px;
}
@media (max-width: 991px) {
  .container-fluid {
    padding: 0 15px;
  }
}
.heading-h1 {
  font-size: 56px;
  line-height: 90px;
  font-family: "Montserrat-Bold";
}
@media (max-width: 575px) {
  .heading-h1 {
    font-size: 40px;
    line-height: 72px;
  }
}
.heading-h2 {
  font-size: 40px;
  line-height: 72px;
  font-family: "Montserrat-Bold";
}
@media (max-width: 575px) {
  .heading-h2 {
    font-size: 32px;
    line-height: 48px;
  }
}
.heading-h4 {
  font-size: 24px;
  line-height: 40px;
  font-family: "Montserrat-Bold";
}
@media (max-width: 575px) {
  .heading-h4 {
    font-size: 20px;
    line-height: 36px;
  }
}
.heading-L {
  font-size: 20px;
  line-height: 36px;
  font-family: "Poppins-Medium";
}
.heading-LB {
  font-size: 20px;
  line-height: 36px;
  font-family: "Poppins-Medium";
}
.heading-M {
  font-size: 18px;
  line-height: 32px;
  font-family: "Poppins-Medium";
}
.heading-S {
  font-size: 16px;
  line-height: 28px;
  font-family: "Poppins-Regular";
}
.heading-SB {
  font-size: 16px;
  line-height: 28px;
  font-family: "Poppins-Medium";
}
.btn-primary-1 {
  padding: 13px 24px 13px 24px;
  border-radius: 12px;
  background-color: #019dea;
  color: #ffffff;
  text-transform: capitalize;
  font-family: "Poppins-Medium";
  border: 1px solid transparent;
  transition: 0.2s;
}
.btn-primary-1:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid #019dea;
  color: #ffffff;
}
.btn-primary-2 {
  padding: 14px 24px 12px 24px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  text-transform: capitalize;
  font-family: "Poppins-Medium";
  border: 1px solid #019dea;
  color: #ffffff;
  transition: 0.2s;
}
.btn-primary-2:hover {
  background-color: #019dea;
  color: #ffffff;
  border: 1px solid transparent;
}
.input {
  padding: 14px 48px 14px 24px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-family: "Poppins-Medium";
  color: #ffffff;
  border: none;
}
.input:focus {
  outline: none;
}
.input::-moz-placeholder {
  color: #ffffff;
}
.input:-ms-input-placeholder {
  color: #ffffff;
}
.input::placeholder {
  color: #ffffff;
}
/*! CSS Used fontfaces */
@font-face {
  font-family: "remixicon";
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/libs/remixicon/fonts/remixicon.eot?t=1590207869815");
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/libs/remixicon/fonts/remixicon.eot?t=1590207869815#iefix")
      format("embedded-opentype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/libs/remixicon/fonts/remixicon.woff2?t=1590207869815")
      format("woff2"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/libs/remixicon/fonts/remixicon.woff?t=1590207869815")
      format("woff"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/libs/remixicon/fonts/remixicon.ttf?t=1590207869815")
      format("truetype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/libs/remixicon/fonts/remixicon.svg?t=1590207869815#remixicon")
      format("svg");
  font-display: swap;
}
@font-face {
  font-family: "Poppins-Medium";
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Medium.eot");
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Medium.eot#iefix")
      format("embedded-opentype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Medium.woff2")
      format("woff2"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Medium.woff")
      format("woff"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Medium.ttf")
      format("truetype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Medium.svg#Poppins-Medium")
      format("svg"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Medium.otf")
      format("otf");
}
@font-face {
  font-family: "Poppins-Bold";
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Bold.eot");
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Bold.eot#iefix")
      format("embedded-opentype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Bold.woff2")
      format("woff2"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Bold.woff")
      format("woff"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Bold.ttf")
      format("truetype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Bold.svg#Poppins-Bold")
      format("svg"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Bold.otf")
      format("otf");
}
@font-face {
  font-family: "Montserrat-Bold";
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Montserrat-Bold.eot");
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Montserrat-Bold.eot#iefix")
      format("embedded-opentype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Montserrat-Bold.woff2")
      format("woff2"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Montserrat-Bold.woff")
      format("woff"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Montserrat-Bold.ttf")
      format("truetype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Montserrat-Bold.svg#Montserrat-Bold")
      format("svg"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Montserrat-Bold.otf")
      format("otf");
}
@font-face {
  font-family: "Poppins-Regular";
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Regular.eot");
  src: url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Regular.eot#iefix")
      format("embedded-opentype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Regular.otf")
      format("otf"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Regular.svg#Poppins-Regular")
      format("svg"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Regular.ttf")
      format("truetype"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Regular.woff")
      format("woff"),
    url("https://cache.volentix.io/https://ethernal-blue.ansarians.com/assets/fonts/Poppins-Regular.woff2")
      format("woff2");
}
.logos img {
  max-width: 76px;
  padding: 12px;
}

.hLWUXo {
  min-height: 226px;
  display: flex;
  color: rgb(34, 34, 34);
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;
  background: rgb(36 55 80);
  border-radius: 10px;
  position: relative;
  z-index: 10;
  padding: 27px 25px 25px;
  margin-bottom: 20px;
  box-shadow: rgb(0 0 0 / 5%) 0px 4px 15px;
  cursor: pointer;
  transition: transform 0.3s linear 0s;
}
.funds {
  max-width: 1200px;
  margin: 0 auto;
}
.funds * {
  color: white;
}
.hLWUXo:hover {
  background: #0a1830;
  box-shadow: 1px 2px 18px #959393;
}

.d-inline-block {
  display: inline-block !important;
}

.d-flex {
  display: flex !important;
}

.flex-column {
  flex-direction: column !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

.align-items-center {
  align-items: center !important;
}

@media (min-width: 576px) {
  .align-items-sm-end {
    align-items: flex-end !important;
  }
}

.position-relative {
  position: relative !important;
}

.h-100 {
  height: 100% !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mt-1 {
  margin-top: 0.25rem !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mt-3 {
  margin-top: 1rem !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

.ml-3 {
  margin-left: 1rem !important;
}

.mt-4 {
  margin-top: 1.5rem !important;
}

.mt-5 {
  margin-top: 3rem !important;
}

.p-0 {
  padding: 0 !important;
}

.pr-0 {
  padding-right: 0 !important;
}

.pt-2 {
  padding-top: 0.5rem !important;
}

.pt-3 {
  padding-top: 1rem !important;
}

.p-4 {
  padding: 1.5rem !important;
}

@media (min-width: 576px) {
  .pr-sm-3 {
    padding-right: 1rem !important;
  }
}

@media (min-width: 768px) {
  .mt-md-5 {
    margin-top: 3rem !important;
  }
  .mb-md-5 {
    margin-bottom: 3rem !important;
  }
  .pt-md-5 {
    padding-top: 3rem !important;
  }
}

.text-right {
  text-align: right !important;
}

.text-uppercase {
  text-transform: uppercase !important;
}

.font-weight-bold {
  font-weight: 700 !important;
}

.text-dark {
  color: #343a40 !important;
}

a.text-dark:focus,
a.text-dark:hover {
  color: #121416 !important;
}

/*! CSS Used from: Embedded */

.yfGKD {
  font-style: normal;
  font-weight: 500;
  text-align: center;
  background-color: transparent;
  color: rgb(0, 0, 0);
  width: 210px;
  height: 50px;
  border: 1px solid rgb(34, 34, 34);
  border-radius: 10px;
  font-size: 14px;
  transition: background-color 0.4s ease 0s;
}

.yfGKD:hover {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
}

.yfGKD:disabled {
  background-color: transparent;
  border: 1px solid rgb(226, 225, 224);
  color: rgb(226, 225, 224);
}

@media only screen and (min-width: 768px) {
  .yfGKD {
    font-size: 16px;
    font-weight: 400;
  }
}

.gfOGd {
  font-style: normal;
  font-weight: 500;
  text-align: center;
  background-color: transparent;
  color: rgb(0, 0, 0);
  width: 100%;
  height: 40px;
  border: 1px solid rgb(34, 34, 34);
  border-radius: 10px;
  font-size: 14px;
  transition: background-color 0.4s ease 0s;
}

.gfOGd:hover {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
}

.gfOGd:disabled {
  background-color: transparent;
  border: 1px solid rgb(226, 225, 224);
  color: rgb(226, 225, 224);
}

@media only screen and (min-width: 768px) {
  .gfOGd {
    font-size: 16px;
    font-weight: 400;
  }
}

.fahheg {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color:rgb(36 54 80);
  box-shadow: rgba(0, 18, 80, 0.1) 0px 5px 20px;
  border-radius: 20px;
  font-size: 13px;
  height: 100%;
      max-width: 500px;
}

.fahheg h5 {
  font-weight: 700;
}

.heMQma {
  padding: 1.5rem;
  border-radius: 10px 10px 0px 0px;
  background-color:rgb(36 54 80);
}

.iqwhds {
  min-height: 36px;
  font-size: 12px;
}

@media only screen and (min-width: 768px) {
  .iqwhds {
    font-size: 16px;
  }
}

.cYqNQH {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  max-height: 175px;
}

.iXbspm {
  align-items: flex-start;
  min-height: 74px;
}

.ijLJAP {
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  cursor: pointer;
}

@media only screen and (min-width: 768px) {
  .ijLJAP {
    font-size: 1.25rem;
  }
}

.dmPCjI {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 400;
}

@media only screen and (min-width: 768px) {
  .dmPCjI {
    font-size: 16px;
  }
}

.egWYwc {
  font-size: 14px;
}

@media only screen and (min-width: 768px) {
  .egWYwc {
    font-size: 1.25rem;
  }
}

.lfRDjd {
  font-family: "Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-weight: bold;
  font-size: 2rem;
  word-break: break-word;
  color: rgb(7, 6, 2);
}

.bDysHy {
  width: 45px;
  height: 45px;
  border-radius: 5px;
}

.gNCqqB {
  font-size: 29px;
  color:white
}

@media only screen and (min-width: 768px) {
  .gNCqqB {
    font-size: 38px;
  }
}

.kNjIeX {
  margin-top: 2rem;
}

@media only screen and (min-width: 768px) {
  .kNjIeX {
    margin-top: 69px;
  }
}

.fseeQh {
  font-size: 14px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  color: white;
  font-style: normal;
  font-weight: 400;
  text-align: left;
}

@media only screen and (min-width: 768px) {
  .fseeQh {
    font-size: 20px;
  }
}

.hgcTzH {
  padding: 0px;
}

@media only screen and (min-width: 768px) {
  .hgcTzH {
    padding-left: 15px;
    padding-right: 15px;
  }
}

.eBhvSM .fadeIn {
  animation-name: lbWRkT;
  animation-duration: 4s;
}
.fahheg h5 {

    margin-block-start: 0em;
    margin-block-end: 0em;

}
.container-fluid-vaults {
  max-width:1240px;
  margin:0 auto !important ;
  margin-bottom:140px !important ;
}
.fahheg p, .fahheg h5  {
      color:#dadada
}

.fahheg button  {
      color:white !important ;
      border: 1px solid #dadada !important ;

}
.fahheg small {
      color:white !important
}
</style>
