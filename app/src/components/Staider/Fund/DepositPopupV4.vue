<template>
  <div>
    <q-dialog dark v-model="alert" @hide="$emit('hide')">
      <q-card dark class="deposit-withdraw-popup-wrapper">
        <q-card-section class="row items-center q-pb-none">
          <div class="popup-title q-pl-sm text-uppercase">{{actionType}}</div>
          <q-space />
          <q-btn
            icon="close"
            @click="depositPopup = false"
            size="sm"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
           <div v-if="actionType == 'withdraw' && pendingAction == 'pending'" class=" flex flex-center">
            <q-circular-progress
              indeterminate
              size="100px"
              color="white"
              class="q-ma-md"
            />

           </div>
           <div v-else-if="actionType == 'withdraw' && pendingAction" class="text-body1 q-pa-lg bg-black q-mt-lg" >
          This vault requires you to hold your shares for at least
          {{ pendingAction.time }} before
          {{ actionType == "deposit" ? "depositing" : "withdrawing" }}. You will
          be able to {{ actionType }} {{ pendingAction.timer }}.
        </div>
         <div class="q-pa-md" v-else-if="whitelistRequired">
          <p class="text-body1 vault_operates_text" :class="{ 'text-white': $store.state.settings.lightMode === 'true' }">
            This vault operates a depositor whitelist and your wallet address
            ({{ user.address }}) is not on it. If you want your address to be
            whitelisted, please contact by submitting this form.
          </p>
          <Contact />
        </div>
        <q-card-section   v-else-if="(status && status.length) || txHash">
        <div  class="text-h6 text-bold full-width text-center text-grey-6">
            Transaction submitted
          </div>
           <br />
          <p class="text-body1 full-width text-center">
            Status:
            <span
              :class="
                status == 'Success' ? 'text-green' : 'text-yellow'
              "
              >{{ status }}</span
            >
          </p>
        <div
            v-if="txHash"
            style="width: 300px; margin: 0 auto"
            :class="{ 'text-grey-6': $store.state.settings.lightMode === 'true' }"
            class="cursor-pointer  q-pa-sm q-mt-md flex flex-center"
          >
            <a target="_blank" :href="'https://etherscan.io/tx/' + txHash"
              ><div>{{ getKeyFormat(txHash, 30) }}</div></a
            >
          </div>

          <br />
          <div
            class="flex flex-center"
            v-if="!['Success', 'Failed'].includes(status)"
          >
            <q-spinner
              color="text-grey-6"
              class="q-pt-md"
              size="4em"
              :thickness="2"
            />
          </div>

          <br />
          <div class="flex flex-center q-pb-md">
            <q-btn
              v-if="status == 'Success' && approvalRequired"
              flat
              @click="
                reviewStep = false ;

                status = false;
                txHash = null;
                getTransactionObject();
                approvalRequired = false;
              "
              label="Go back to deposit"
            />
            <a
              v-else-if="txHash"
              target="_blank"
              :href="'https://etherscan.io/tx/' + txHash"
              ><q-btn
                flat
                color="grey-6"
                label="View Tx"
                :icon="'img:https://etherscan.io/images/favicon3.ico'" /><q-icon
                name="navigate_next"
            /></a>
          </div>

        </q-card-section>
        <q-card-section v-else-if="reviewStep" align="left">
          <span class="text-h6 text-grey-6">Review transaction</span>
          <div v-if="!approvalRequired" class="summary q-pa-md bg-black q-mt-md text-body1 text-grey-6">
            <b class="text-h6"> Buy Shares</b><br />
            Deposit {{ amount }} {{ selected.type }} to buy shares for
            {{ vault.name }}.
          </div>
           <div v-else class="summary q-pa-md bg-black q-mt-md text-body1 text-grey-6">
            <b class="text-h6">Approve {{ vault.name }}</b><br />
             to spend your USD.
          </div>
          <div class="share-lockup-time q-mt-md">
            <span class="label text-body1 text-grey-6"
              >Expected Transaction Fee</span
            >
          </div>
          <span class="share-lockup-amount text-grey-6 text-bold text-body1"
            >{{ formatNumber(gas.eth, 4) }} ETH</span
          ><br />
          <span class="share-lockup-amount text-grey-6"
            >{{ formatNumber(gas.usd, 0) }} $US</span
          >
        </q-card-section>

        <q-card-section v-else-if="actionType == 'withdraw'" align="left">
          <div class="row">
            <div class="col-10 column q-pa-sm">
              <span class="instruction">Your current Balance</span>
              <div class="deposit-amount-component column">
                <span class="label flex justify-between text-grey-7 q-mb-sm">
                  <span>{{shares}} shares</span>
                </span>
                <span class="hint text-grey-6 q-mt-md flex text-bold"
                  >Quantity of shares</span
                >
                <div class="input-wrapper q-mt-xs">
                  <q-input
                    dark
                    outlined
                    v-model="amount"
                    class="amount-input"
                  />
                  <span class="hint text-grey-6 q-mt-sm flex"
                    >The number of the shares you would like to withdraw.</span
                  >
                  <div class="max-wrapper withdraw flex items-center">
                    <q-btn
                    @click="amount = shares"
                      color="yellow"
                      unelevated
                      text-color="black"
                      class="max-btn yellow"
                      label="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else align="left">
          <div class="row depositPopup">
            <div
              class="column q-pa-sm"
              :class="{
                'col-md-7': $q.screen.width > 643,
                'col-12': $q.screen.width < 643,
              }"
            >
              <span class="instruction"
                >Choose Amount and Token to deposit</span
              >
              <div class="deposit-amount-component column q-mt-md">
                <span   @click="amount = maxDeposit; getTransactionObject()" class="cursor-pointer label flex justify-between text-grey-6 q-mb-sm">
                  <span>Amount</span>
                  <span
                    >{{
                      maxDeposit.toString().includes("0.0000")
                        ? maxDeposit
                        : maxDeposit.toFixed(4)
                    }}
                    {{
                      actionType == "deposit" && selected ? selected.type : ""
                    }}</span
                  >
                </span>
                <div class="input-wrapper">
                  <q-input
                    @input="getTransactionObject()"
                    dark
                    outlined
                    v-model="amount"
                    class="amount-input"
                  />
                  <span
                    v-if="tokens[0].price && actionType === 'deposit'"
                    class="hint text-grey-6 q-mt-sm flex"
                    >{{ formatNumber(selected.price * amount, 2) }} $US</span
                  >
                  <div
                    class="max-wrapper flex items-center depositPopup"
                    v-if="selected"
                  >
                    <q-btn-dropdown
                      :key="selected.type"
                      class="coin-dropdown-wrapper-btn"
                      flat
                      no-caps
                      dark
                      align="left"
                      content-class="vault-dropdown-wrapper coin-drop"
                    >
                      <template v-slot:label>
                        <div class="flex text-white coin-item justify-start">
                          <span class="imgs flex flex-center q-mr-md">
                            <img height="22" :src="selected.image" alt="" />
                          </span>
                          <span
                            class="
                              column
                              pairs
                              vault-name
                              coin
                              justify-center
                              items-start
                            "
                          >
                            <span
                              class="
                                value
                                flex
                                justify-start
                                text-capitalize text-bold
                              "
                              >{{ selected.type }}</span
                            >
                          </span>
                        </div>
                      </template>
                      <div
                        class="
                          column
                          no-wrap
                          dropdown-content
                          q-pt-sm q-pb-sm
                          coin-dropdown
                        "
                        v-close-popup
                      >
                        <div
                          @click="selected = tokens[0]"
                          class="
                            flex
                            text-white
                            q-pl-md q-pr-md q-pb-xs q-pt-xs
                            coin-item
                            justify-start
                          "
                        >
                          <span class="imgs flex flex-center q-mr-md">
                            <img
                              height="22"
                              src="statics/staider/coins/eth.svg"
                              alt=""
                            />
                          </span>
                          <span
                            class="
                              column
                              pairs
                              vault-name
                              coin
                              justify-center
                              items-start
                            "
                          >
                            <span
                              class="
                                value
                                flex
                                justify-start
                                text-capitalize text-bold
                              "
                              >ETH</span
                            >
                          </span>
                        </div>
                        <div
                          v-if="tokens[1]"
                          @click="selected = tokens[1]"
                          v-close-popup
                          class="
                            flex
                            text-white
                            q-pl-md q-pr-md q-pb-xs q-pt-xs
                            coin-item
                            justify-start
                          "
                        >
                          <span class="imgs flex flex-center q-mr-md">
                            <img :height="22" :src="tokens[1].image" alt="" />
                          </span>
                          <span
                            class="
                              column
                              pairs
                              vault-name
                              coin
                              justify-center
                              items-start
                            "
                          >
                            <span
                              class="
                                value
                                flex
                                justify-start
                                text-capitalize text-bold
                              "
                              >{{ tokens[1].type }}</span
                            >
                          </span>
                        </div>
                      </div>
                    </q-btn-dropdown>
                    <q-btn
                      v-if="selected && selected.type.toLowerCase() !== 'eth'"
                      color="transparent"
                      unelevated
                      @click="amount = maxDeposit;  getTransactionObject()"
                      text-color="white"
                      class="max-btn"
                      label="Max"
                    />
                  </div>
                </div>
              </div>
              <div class="share-lockup-time q-mt-md">
                <span class="label">Shares Lockup Time</span>
                <span
                  class="info"
                  @mouseenter="showInfo = true"
                  @mouseleave="showInfo = false"
                  >?</span
                >
                <span class="infobull-wrapper" :class="{ show: showInfo }"
                  >Amount of time an account has to wait between deposit and
                  withdrawal</span
                >
              </div>
              <span class="share-lockup-amount text-grey-6">{{
                sharesActionTimelock
              }}</span>
              <q-btn
                color="white"
                flat
                class="advanced-settings-btn q-mt-sm q-pa-none"
                @click="advancedSettings = !advancedSettings"
                text-color="white"
                label="Advanced settings"
                no-caps
                :icon-right="advancedSettings ? 'expand_less' : 'expand_more'"
              />
              <div v-if="advancedSettings" class="column full-width">
                <div class="share-lockup-time q-mt-md q-mb-md">
                  <span class="label">Maximum Slippage</span>
                  <span
                    class="info"
                    @mouseenter="showInfoSlippage = true"
                    @mouseleave="showInfoSlippage = false"
                    >?</span
                  >
                  <span
                    class="infobull-wrapper"
                    :class="{ show: showInfoSlippage }"
                    >Amount of time an account has to wait between deposit and
                    withdrawal</span
                  >
                </div>
                <q-input
                  dark
                  outlined
                  v-model="slippage"
                  class="amount-input q-mb-md"
                />
              </div>
              <div class="flex items-center">
                <q-checkbox
                  dark
                  v-model="termsConditions"
                  class="termsConditions"
                  ><span>I agree to the</span></q-checkbox
                >
                <q-btn
                  color="yellow"
                  flat
                  no-caps
                  text-color="yellow"
                  @click="termsConditionPopup = true"
                  label="Terms & Conditions."
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="action-label q-mr-md q-mb-md"  v-if="!whitelistRequired && (!status || !txHash)">
          <q-btn
            v-if="reviewStep"
            color="white"
            class="q-pl-lg q-pr-lg"
            no-caps
            text-color="white"
            @click="reviewStep = false ; txHash = null ; status = null"
            flat
            label="Go back"
          />
          <q-btn
            v-if="!whitelistRequired && [null,'pending'].includes(pendingAction)"
            color="white"
            class="q-pl-lg q-pr-lg text-uppercase"
            no-caps
            text-color="white"
            :disable="!termsConditions || !txObject"
            @click="reviewStep ? pushTransaction() : (reviewStep = true)"
            :loading="spinnerVisible"
            outline
            rounded
            :label="reviewStep ? 'Submit' : (approvalRequired ? 'Approve '+ this.selected.type.toUpperCase() : actionType)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog dark v-model="termsConditionPopup">
      <q-card dark class="deposit-withdraw-popup-wrapper">
        <q-card-section class="row items-center q-pb-none">
          <div class="popup-title q-pl-sm">Terms and conditions</div>
          <q-space />
          <q-btn
            icon="close"
            @click="termsConditionPopup = false"
            size="sm"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-card-section align="left">
          <q-scroll-area
            class="terms_scroll q-pa-md full-width height-auto"
            :visible="true"
            dark
          >
            <h4>Terms Of Service</h4>
            <p>
              PLEASE READ THIS TERMS OF USE AGREEMENT (THE “TERMS”) CAREFULLY AS
              THEY FORM A BINDING LEGAL AGREEMENT BETWEEN YOU AND VOLENTIX LABS
              INC (“VLABS” OR “WE: AND ITS DERIVATIVES). THIS SITE AND ANY OTHER
              SITES OF VOLENTIX LABS INC (COLLECTIVELY, THE “SITE”) AND THE
              INFORMATION ON IT ARE CONTROLLED BY VLABS, INC. ON BEHALF OF
              STAIDER LLC. THESE TERMS GOVERN THE USE OF THE SITE AND APPLY TO
              ALL VISITORS TO THE SITE AND THOSE WHO USE THE BLOCKCHAIN CURRENCY
              MANAGEMENT SOFTWARE THAT IS FREELY DOWNLOADABLE OR USABLE FROM THE
              SITE (THE “SOFTWARE”), AS WELL AS OTHER SERVICES AND RESOURCES
              AVAILABLE OR ENABLED VIA THE SITE, (EACH A “SERVICE” AND
              COLLECTIVELY, THE “SERVICES”, WHICH TERM INCLUDES THE SOFTWARE AND
              THE SITE UNLESS EXPLICITLY SET FORTH BELOW). BY CLICKING ON THE “I
              ACCEPT” BUTTON, DOWNLOADING THE SOFTWARE, COMPLETING THE
              REGISTRATION PROCESS AND/OR BROWSING THE SITE, YOU REPRESENT THAT
              (1) YOU HAVE READ, UNDERSTAND, AND AGREE TO BE BOUND BY THE TERMS,
              (2) YOU ARE OF LEGAL AGE TO FORM A BINDING CONTRACT WITH VLABS,
              INC, AND (3) YOU HAVE THE AUTHORITY TO ENTER INTO THE TERMS
              PERSONALLY OR ON BEHALF OF THE LEGAL ENTITY ON FOR WHOM YOU ARE
              USING THE SERVICES. THE TERM “YOU” REFERS TO YOU INDIVIDUALLY OR
              THE LEGAL ENTITY ON WHOSE BEHALF THE SERVICES ARE USED, AS
              APPLICABLE. IF YOU DO NOT AGREE TO BE BOUND BY THE TERMS, YOU MAY
              NOT ACCESS OR USE THE SERVICES.
            </p>
            <h4>LIMITATION OF LIABILITY.</h4>
            <p>
              DISCLAIMER. IN NO EVENT WILL VLABS, INC BE LIABLE FOR ANY LOST
              PROFITS, REVENUE OR DATA, INDIRECT, INCIDENTAL, SPECIAL, OR
              CONSEQUENTIAL DAMAGES, OR DAMAGES OR COSTS DUE TO LOSS OF
              PRODUCTION OR USE, BUSINESS INTERRUPTION, OR PROCUREMENT OF
              SUBSTITUTE GOODS OR SERVICES ARISING OUT OF OR IN CONNECTION WITH
              THE SERVICES, WHETHER OR NOT VOLENTIX LABS INC HAS BEEN ADVISED OF
              THE POSSIBILITY OF SUCH DAMAGES, AND REGARDLESS OF THE THEORY OF
              LIABILITY ASSERTED. VOLENTIX LABS INC may modify these Terms at
              any time and in our sole discretion. If we do so, we will change
              the “Last Updated” date at the beginning of these Terms and, as
              available, inform you through or within the Services. By
              Continuing to use the Site or Services following the release of
              updated Terms you consent to such updated Terms. We invite you to
              check this page regularly for updates to the Terms.
            </p>
            <h4>Use of the Services.</h4>
            <p>
              The Software, the Site, the Services, and the information and
              content available therein (“VOLENTIX LABS INC Content”) are
              protected worldwide by copyright laws. Subject to the Terms,
              VOLENTIX LABS INC grants you a limited license to reproduce
              portions of VERTO Content solely as required to use the Services
              for your personal purposes. Unless otherwise specified by VOLENTIX
              LABS INC in a separate license, your right to use any VERTO code
              is subject to these Terms.
            </p>
            <p>
              VOLENTIX LABS INC is not a bank or financial institution and does
              not provide investment or financial advice or consulting services
              to users of the Services. We are solely the provider of the
              Software.
            </p>
            <h4>1.1 – VOLENTIX LABS INC Software.</h4>
            <p>
              Use of the Software (VERTO Wallet or other) is governed by these
              Terms. VOLENTIX LABS INC delivers the Software via open source
              licence to download or use through any front end and VOLENTIX LABS
              INC will not provide you with any tangible copy of the Software.
              Subject to your compliance with the Terms, VOLENTIX LABS INC
              grants you a non-assignable, non-transferable, non-sub-licensable,
              revocable, and non-exclusive license to use the Software on
              computers you own or control solely for your go personal purposes.
              Because the Software is locally installed, or managed by your
              browser, you are responsible for the security of the device on
              which it is installed, including ensuring that you keep anti-virus
              software current, all patches and fixes offered by vendors, and
              otherwise protect the device on which the Software is installed
              against malware by all means. VOLENTIX LABS INC is not responsible
              for any loss or damages – including loss of funds or lockout from
              accounts accessed via the Software – resulting from your failure
              to keep the device on which the Software is installed safe and
              free of any malware. VOLENTIX LABS INC cannot recover passwords or
              unlock account information stored on the Software in any
              circumstances, including if the Software is compromised by malware
              on your computer, and it is your sole responsibility to take all
              reasonable precautions to secure and backup your copy of the
              Software and the information stored on it.
            </p>
            <h4>1.2 – Updates.</h4>
            <p>
              The Software and Services are evolving and you may be required to
              accept or install updates to the Software or Services, or update
              third party software (i.e., browsers or OS) in order to keep using
              the Software or Services or access their latest features,
              including security updates. We may update the Software and
              Services at any time, without providing notice. However VERTO is
              only a front end and your assets are always unaffected by any
              updates as they remain on the respective blockchain networks and
              can be accessed without VERTO provided you have tour seeds and
              private keys stored safely offline.
            </p>
            <h4>1.3 – Third-Party Services.</h4>
            <p>
              The Services may incorporate, or may provide access to,
              applications or materials that are hosted by another party,
              including the EOS network and Block Producer Candidates
              information sources, (collectively, “Third-Party Services”) or any
              other Blockchains in a similar manner. You agree that it is
              impossible for VOLENTIX LABS INC to monitor Third Party Services
              and that you access them at your own risk. Do not share any
              credential, private key, or other sensitive information with any
              third party without validating their legitimacy. To the extent
              Third Party Services incorporated into or linked to from the
              Services (i.e., communications functionality) have terms that
              differ from these Terms, you may be required to agree to those
              terms in order to access the Third-Party Service. We do not
              control the terms, policies, or performance of any third party,
              and are not responsible for any performance, or failure to
              perform, of any Third-Party Services, including with respect to
              exchange rates, processing of transactions, and similar
              activities.
            </p>
            <h4>1.4 – User Content.</h4>
            <p>
              You are responsible for all data and information provided or
              uploaded by you to the Services (“User Content”), whether publicly
              posted (i.e., in a user forum, if applicable) or privately
              transmitted (i.e., to us in connection with a support request).
              You are solely responsible for the accuracy and completeness of
              User Content you submit, and represent and warrant that you have
              all rights required in order to post such User Content. We may, in
              our sole discretion, delete any User Content that we determine
              violates these Terms. To the extent that you provide us with or we
              may have access to any information that allows us to identify you
              or any other individual (“Personal Information”) in connection
              with your use of the Services, we will preserve, safeguard, and
              use such information as set forth in our Privacy Policy.
            </p>
            <h4>1.5 – Necessary Equipment and Software.</h4>
            <p>
              You must provide all equipment and software necessary to connect
              to use the Services. You are solely responsible for any fees,
              including Internet connection or mobile fees, that you incur when
              accessing or using the Services.
            </p>
            <h4>2. Ownership.</h4>
            <h4>2.1 – Generally.</h4>
            <p>
              VOLENTIX LABS INC and its suppliers own all right, title and
              interest in and to the Site, Services, Software, and VOLENTIX LABS
              INC Content. You will not remove, alter or obscure any copyright,
              trademark, service mark or other proprietary rights notices
              incorporated in or accompanying the Site, the Services, or
              VOLENTIX LABS INC Content.
            </p>
            <h4>2.2 – Trademarks.</h4>
            <p>
              VOLENTIX LABS INC and other related graphics, logos, service marks
              and trade names used on or in connection with the Services are the
              trademarks of VOLENTIX LABS INC and may not be used without
              permission in connection with any third-party products or
              services. Other trademarks, service marks and trade names that may
              appear on or in the Site or Services are the property of their
              respective owners.
            </p>
            <h4>2.4 – User Content.</h4>
            <p>
              You own your User Content. By posting, displaying, sharing or
              distributing User Content on or through the Services, you grant
              us, and any Third Party Services used in connection with the
              Services, a nonexclusive license to use the User Content solely
              for the purpose of operating the Services. Except as prohibited by
              applicable law, we may disclose any information in our possession
              (including User Content) in connection with your use of the
              Services, to (a) comply with legal process; (b) enforce these
              Terms, (c) respond to your requests for customer service, or (d)
              protect the rights, property or personal safety of VOLENTIX LABS
              INC, our employees, directors or officers, partners and agents, or
              members of the public.
            </p>
            <h4>2.4 – Feedback.</h4>
            <p>
              You may provide ideas, suggestions, documents, and/or proposals
              about the Services to VOLENTIX LABS INC through any means
              (“Feedback”), and you grant VOLENTIX LABS INC a fully paid,
              royalty-free, perpetual, irrevocable, worldwide, non-exclusive,
              and sublicensable right and license to use Feedback for any
              legitimate purpose.
            </p>
            <h4>3. User Conduct.</h4>
            <p>
              You may not use the Services for any purpose that is prohibited by
              the Terms or applicable law. You will not (and will not permit any
              third party to) take any action or make available any content on
              or through the Services that: (a) infringes any intellectual
              property rights of any person or entity; (b) is unlawful,
              threatening, harassing, defamatory, libelous, deceptive,
              fraudulent, invasive of another’s privacy, tortious, obscene, or
              offensive; (c) is unauthorized or unsolicited advertising, junk or
              bulk e-mail; (d) involves commercial activities and/or sales, such
              as contests, sweepstakes, barter, advertising, or pyramid schemes;
              (e) impersonates any person or entity, including any employee or
              representative of VOLENTIX LABS INC; (f) interferes with the
              proper functioning of the Services; (g) engages in any potentially
              harmful acts directed against the Services, including violating
              any security features of the Services, introducing viruses, worms,
              or similar harmful code into the Services; or (h) attempts to do
              any of the foregoing.
            </p>
            <h4>4.Third-Party Properties.</h4>
            <p>
              The Services may contain links to third-party websites and
              applications (collectively, “Third-Party Properties”). When you
              click on a link to a Third-Party Property, we will not warn you
              that you have left the Services and are subject to the terms and
              conditions (including privacy policies) of another website or
              application. VOLENTIX LABS INC provides these Third-Party
              Properties only as a convenience and does not make any
              representations with respect to Third-Party Properties, or their
              products or services. You use Third-Party Properties at your own
              risk. You should review applicable terms and policies, including
              privacy and data gathering practices, of any Third-Party
              Properties, and should make whatever investigation you feel
              necessary or appropriate before proceeding with any transaction
              with any third party.
            </p>
            <h4>5. Indemnification.</h4>
            <p>
              You agree to indemnify and hold VOLENTIX LABS INC, its parents,
              subsidiaries, affiliates, officers, employees, agents, partners
              and licensors (collectively, the “VOLENTIX LABS INC Parties”)
              harmless from any losses, costs, liabilities and expenses
              (including reasonable attorneys’ fees) relating to or arising out
              of: (a) your use of, or inability to use, the Services; (b) your
              violation of the Terms; (c) your violation of any rights of
              another party, including any other users of the Services; or (d)
              your violation of any applicable laws, rules or regulations.
              VOLENTIX LABS INC may, at its own cost, assume the exclusive
              defense and control of any matter otherwise subject to
              indemnification by you, in which event you will fully cooperate
              with VOLENTIX LABS INC in asserting any available defenses. This
              provision does not require you to indemnify any VOLENTIX LABS INC
              Party for any fraud, gross negligence, or willful misconduct in
              connection with the Services.
            </p>
            <h4>6. Term and Termination.</h4>
            <h4>6.1 – Term.</h4>
            <p>
              The Terms commence on the date when you accept them (as described
              in the preamble above) and remain in full force and effect for so
              long as you access or use the Site, Services, or Software, unless
              terminated earlier in accordance with this Section.
            </p>
            <h4>6.2 – Termination by VOLENTIX LABS INC.</h4>
            <p>
              VOLENTIX LABS INC cannot at any time and for any reason, cease
              providing any or all of the Services, and/or terminate the service
              as it is not reliant on the webapp that is provided as VERTO,
              VERTO is only a convenient front end to access blockchain services
              that can be accessed in may other ways regardless of VERTO’s
              status.
            </p>
            <p>
              VOLENTIX LABS INC is required to do so by law (e.g., where the
              provision of the Services is, or becomes, unlawful).
            </p>
            <h4>6.3 – Termination by You.</h4>
            <p>
              Except as set forth in Section 6.4, these Terms will be of no
              further force and effect with respect to you if you cease all use
              of the Services and Software and no longer visit the Site.
            </p>
            <h4>6.4 – Effect of Termination.</h4>
            <p>
              Upon termination of any Service, your right to use such Service
              will automatically terminate immediately from any front end
              provided by VOLENTIX LABS INC. VOLENTIX LABS INC will not have any
              liability whatsoever to you for any suspension or termination. All
              provisions of the Terms which by their nature should survive
              termination of Services will do so, including Sections 2, 5, 6.4,
              7 and 8.
            </p>
            <h4>7. Disclaimer of Warranties.</h4>
            <h4>7.1 – As Is.</h4>
            <p>
              THE SITE, SERVICES AND SOFTWARE ARE PROVIDED ON AN “AS IS” AND “AS
              AVAILABLE” BASIS, WITH ALL FAULTS, AND VOLENTIX LABS INC EXPRESSLY
              DISCLAIMS ALL WARRANTIES, REPRESENTATIONS, AND CONDITIONS OF ANY
              KIND ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF THE
              SITE, SERVICES, AND SOFTWARE, INCLUDING THE IMPLIED WARRANTIES OF
              MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. YOU
              ACKNOWLEDGE THAT, TO THE EXTENT ALLOWED BY APPLICABLE LAW, ALL
              RISK OF USE OF THE SITE, SERVICES, AND SOFTWARE RESTS ENTIRELY
              WITH YOU.
            </p>
            <h4>7.2 – Beta Releases.</h4>
            <p>
              FROM TIME TO TIME, VOLENTIX LABS INC MAY OFFER NEW “BETA” FEATURES
              OR TOOLS WITH WHICH ITS USERS MAY EXPERIMENT. SUCH FEATURES OR
              TOOLS ARE OFFERED SOLELY FOR EXPERIMENTAL PURPOSES, WITHOUT ANY
              WARRANTY OF ANY KIND, AND MAY BE MODIFIED OR DISCONTINUED AT
              VOLENTIX LABS INC’ SOLE DISCRETION.
            </p>
            <h4>7.3 – Third Party Conduct.</h4>
            <p>
              VOLENTIX LABS INC IS NOT LIABLE, AND YOU AGREE NOT TO SEEK TO HOLD
              VOLENTIX LABS INC LIABLE, FOR THE CONDUCT OF THIRD PARTIES ON OR
              ACCESSED VIA THE SERVICES, INCLUDING OPERATORS OF THIRD PARTY
              SERVICES AND THIRD-PARTY PROPERTIES AND OTHER USERS OF THE
              SERVICES, AND THAT THE RISK OF INJURY FROM SUCH THIRD PARTIES
              RESTS ENTIRELY WITH YOU.
            </p>
            <h4>7.4 – Cap on Liability.</h4>
            <p>
              UNDER NO CIRCUMSTANCES WILL VOLENTIX LABS INC BE LIABLE TO YOU FOR
              DAMAGES ARISING OUT OF THE SERVICES.
            </p>
            <h4>8. General Provisions.</h4>
            <h4>8.1 – Assignment.</h4>
            <p>
              The Terms, and your rights and obligations hereunder, may not be
              assigned, subcontracted, delegated or otherwise transferred by you
              without VOLENTIX LABS INC’ prior written consent.
            </p>
            <h4>8.2 – Force Majeure.</h4>
            <p>
              VOLENTIX LABS INC will not be liable for any delay or failure to
              perform resulting from causes outside its reasonable control,
              including, but not limited to, acts of God, war, terrorism, riots,
              embargos, acts of civil or military authorities, fire, floods,
              accidents, strikes or shortages of transportation facilities,
              fuel, energy, labor or materials.
            </p>
            <h4>8.3 – Electronic Communications.</h4>
            <p>
              Communications between you and VOLENTIX LABS INC use electronic
              means, whether made via the Site or Services or sent via e-mail,
              or whether VOLENTIX LABS INC posts notices on the Site or
              Services. For contractual purposes, you (1) consent to receive
              communications from VOLENTIX LABS INC in an electronic form; and
              (2) agree that all terms and conditions, agreements, notices,
              disclosures, and other communications that VOLENTIX LABS INC
              provides to you electronically satisfy any legal requirement that
              such communications would satisfy if it were to be in writing. The
              foregoing does not affect your statutory rights.
            </p>
            <h4>8.4 – Questions, Complaints, Claims.</h4>
            <p>
              If you have any questions, complaints or claims with respect to
              the Site, Services or Software, please contact us at:
              support@volentixlabs.com
            </p>
            <h4>8.5 – Waiver.</h4>
            <p>
              Any waiver or failure to enforce any provision of the Terms on one
              occasion will not be deemed a waiver of any other provision or of
              such provision on any other occasion.
            </p>
            <h4>8.6 – Severability.</h4>
            <p>
              If any portion of these Terms is held invalid or unenforceable,
              that portion will be construed in a manner to reflect, as nearly
              as possible, the original intention of the parties, and the
              remaining portions will remain in full force and effect.
            </p>
            <h4>8.7 – Notice.</h4>
            <p>
              Where and If VOLENTIX LABS INC requires that you provide an e-mail
              address, you are responsible for providing VOLENTIX LABS INC with
              your most current e-mail address. In the event that the last
              e-mail address you provided to VOLENTIX LABS INC is not valid, or
              for any reason is not capable of delivering to you any notices
              required/ permitted by the Terms, VOLENTIX LABS INC’s dispatch of
              the e-mail containing such notice will nonetheless constitute
              effective notice.
            </p>
            <h4>8.8 – Export Control.</h4>
            <p>
              You may not use, export, import, or transfer the Services except
              as authorized by Canadian law, the laws of the jurisdiction in
              which you obtained the Services, and any other applicable laws. In
              particular, but without limitation, the Services may not be
              exported or re-exported (a) into any United States embargoed
              countries, or (b) to anyone on the U.S. Treasury Department’s list
              of Specially Designated Nationals or the U.S. Department of
              Commerce’s Denied Person’s List or Entity List. By using the
              Services, you represent and warrant that (i) you are not located
              in the United States of America or a country that is subject to a
              U.S. Government embargo, or that has been designated by the U.S.
              Government as a “terrorist supporting” country and (ii) you are
              not listed on any U.S. Government list of prohibited or restricted
              parties. You also will not use the Services for any purpose
              prohibited by U.S. law, including the development, design,
              manufacture or production of missiles, nuclear, chemical or
              biological weapons. You acknowledge and agree that products,
              services or technology provided by VOLENTIX LABS INC are subject
              to the export control laws and regulations of the United States.
              You will comply with these laws and regulations and will not,
              without prior U.S. government authorization, export, re-export, or
              transfer VOLENTIX LABS INC products, services or technology,
              either directly or indirectly, to any country in violation of such
              laws and regulations.
            </p>
            <h4>8.9 – Entire Agreement.</h4>
            <p>
              These Terms are the final, complete and exclusive agreement of the
              parties with respect to the subject matter hereof and supersedes
              and merges all prior discussions between the parties with respect
              to such subject matter.
            </p>
            <h4>8.10 – Governing Law and jurisdiction.</h4>
            <p>
              THE TERMS AND ANY ACTION RELATED THERETO WILL BE GOVERNED AND
              INTERPRETED BY AND UNDER THE LAWS OF CANADA, WITHOUT GIVING EFFECT
              TO ANY PRINCIPLES THAT PROVIDE FOR THE APPLICATION OF THE LAW OF
              ANOTHER JURISDICTION. THE UNITED NATIONS CONVENTION ON CONTRACTS
              FOR THE INTERNATIONAL SALE OF GOODS DOES NOT APPLY TO THESE TERMS.
              To the extent the parties are permitted under these Terms to
              initiate litigation in a court, both you and VOLENTIX LABS INC
              agree that all claims and disputes arising out of or relating to
              the Terms will be litigated exclusively in the courts located in
              the city of Montreal, Quebec, Canada.
            </p>
            <p><small>Version 1.3 updated on August 25, 2021.</small></p>
            <p><small>END OF AGREEMENT</small></p>
          </q-scroll-area>
        </q-card-section>
        <q-card-actions align="center" class="action-label q-mb-md">
          <q-btn
            color="white"
            class="q-pl-md q-pr-md text-bold"
            no-caps
            text-color="white"
            @click="termsConditions = true"
            v-close-popup
            outline
            rounded
            label="Accept"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import Web3 from 'web3'
import EnzymeV4 from '../../../util/Staider/EnzymeV4'
import ParseDb from '../../../util/Staider/ParseWrapper'
import Formatter from '../../../mixins/Formatter'
import Contact from './Contact.vue'
const Parse = require('parse')
export default {
  components: {
    Contact
  },
  mixins: [Formatter],
  props: [
    'fundAddress',
    'actionType',
    'EnzymeData',
    'action',
    'provider',
    'vault'
  ],
  methods: {
    async getTransactionObject () {
      this.error = false
      this.confirmWindow = false
      if (!parseFloat(this.amount)) return
      this.spinnerVisible = true
      if (this.actionType === 'withdraw') {
        this.EnzymeData.getWithdrawalTxObject(this.user.address, this.amount, {
          decimals: 18
        })
          .then((tx) => {
            this.gas.eth = (tx.gas * tx.gasPrice) / 10 ** 18
            this.gas.usd = this.gas.eth * this.tokens[0].price
            this.txObject = tx
            this.spinnerVisible = false
          })
          .catch((e) => {
            if (e.toString().includes('INVESTOR_WHITELIST')) {
              this.whitelistRequired = true
            } else if (e.toString().includes('insufficient funds')) {
              this.error = 'Insufficient funds'
            } else if (e.toString().includes('Shares action timelocked')) {
              this.error =
                'You have to wait before redeeming shares (Shares Lockup)'
            } else {
              this.error = e
            }
            this.spinnerVisible = false
          })
      } else if (this.selected.type.toLowerCase() !== 'eth') {
        let approval = await EnzymeV4.isErc20ApprovalRequired(
          this.user.address,
          this.selected,
          this.amount,
          this.vault.comptroller.id
        )
        console.log(approval, 'approval')
        if (approval.required) {
          this.spinnerVisible = false
          this.txObject = approval.transactionObject
          this.gas.eth =
            (this.txObject.gas * this.txObject.gasPrice) / 10 ** 18
          this.gas.usd = this.gas.eth * this.tokens[0].price
          this.approvalRequired = true
        } else {
          EnzymeV4.getBuyShareTxObjectForErc20(
            this.user.address,
            this.amount,
            this.selected,
            this.vault.comptroller.id
          )
            .then((tx) => {
              console.log(tx, 'tx')
              this.gas.eth = (tx.gas * tx.gasPrice) / 10 ** 18
              this.gas.usd = this.gas.eth * this.tokens[0].price
              this.txObject = tx
              this.spinnerVisible = false
            })
            .catch((e) => {
              if (e.toString().includes('INVESTOR_WHITELIST')) {
                this.whitelistRequired = true
              } else if (e.toString().includes('insufficient funds')) {
                this.error = 'Insufficient funds'
              } else if (e.toString().includes('Shares action timelocked')) {
                this.error =
                  'You have to wait before creating new shares (Shares Lockup)'
              } else {
                this.error = e
              }
              this.spinnerVisible = false
            })
        }
      } else {
        let expectedAmount = parseInt(this.amount * this.vault.comptroller.denomination.decimals * this.tokens[0].price / this.tokens[1].price)
        EnzymeV4.getNativeDepositTransaction(
          this.vault.comptroller.id,
          this.vault.comptroller.denomination.id,
          this.amount,
          this.$store.state.currentwallet.user.address,
          expectedAmount
        )
          .then((tx) => {
            console.log(tx, 'tx')
            this.gas.eth = (tx.gas * tx.gasPrice) / 10 ** 18
            this.gas.usd = this.gas.eth * this.tokens[0].price
            this.txObject = tx
            this.spinnerVisible = false
          })
          .catch((e) => {
            if (e.toString().includes('INVESTOR_WHITELIST')) {
              this.whitelistRequired = true
            } else if (e.toString().includes('insufficient funds')) {
              this.error = 'Insufficient funds'
            } else if (e.toString().includes('Shares action timelocked')) {
              this.error =
                'You have to wait before creating new shares (Shares Lockup)'
            } else {
              this.error = e
            }
            this.spinnerVisible = false
          })
      }
    },
    async pushTransaction () {
      /* global Moralis */
      if (
        this.user.wallet === 'metamask' ||
        this.user.wallet === 'walletconnect'
      ) {
        let web3 = null
        this.status = 'Requesting signature...'
        this.spinnerVisible = true

        if (this.user.wallet === 'metamask') {
          await Moralis.enableWeb3()
          web3 = new Web3(Moralis.provider)
        } else {
          web3 = new Web3(this.provider)
        }

        web3.eth
          .sendTransaction(this.txObject, async (error, hash) => {
            if (hash) {
              this.txHash = hash
              this.status = 'Pending'
              localStorage.setItem('last_order', { hash: this.txHash })
              let status = await EnzymeV4.checkEvmTxStatus(hash)

              if (status) {
                this.status = 'Success'
              } else {
                this.status = 'Failed'
              }
            } else {
              this.status = false
              this.error = error.toString()
            }

            this.spinnerVisible = false
          })
          .catch((error) => {
            this.error = error.toString()
            this.status = false
            this.spinnerVisible = false
          })
      } else if (this.user.wallet === 'verto') {
        if (this.confirmWindow) {
          this.spinnerVisible = true
          this.txObject.chain = 'eth'
          let tx = await ParseDb.createUseACLObject(
            'Transaction',
            this.txObject,
            {
              read: true,
              write: false
            }
          )
          let user = Parse.User.current()
          this.listenToData(tx.id)
          this.openInNewTab(
            this.$app.getUrl() + 'sign/' + tx.id + '/' + user.getSessionToken()
          )
        } else {
          this.confirmWindow = true
        }
      }
    },
    listenToData (objectId) {
      let query = new Parse.Query('TransactionEvents')
      query.equalTo('txId', objectId)
      query.subscribe().then((response) => {
        response.on('create', async (response) => {
          let hash = response.get('hash')
          let status = response.get('status')
          if (hash) {
            this.confirmWindow = false
            this.txHash = hash
            this.status = 'Pending'
            localStorage.setItem('last_order', { hash: this.txHash })
            let status = await this.EnzymeData.checkEvmTxStatus(hash)

            if (status) {
              this.status = 'Success'
            } else {
              this.status = 'Failed'
            }
          } else if (status === 'declined') {
            this.xf = 'Transaction was rejected'
          }
          this.spinnerVisible = false
        })
      })
    },
    checkData () {
      setTimeout(() => {
        this.getTransactionObject()
      }, 100)
    },
    async getDeposits () {
      let deposits = await EnzymeV4.getActivity(this.vault.id, 'deposit', this.$store.state.currentwallet.user.address)
      if (deposits.length) {
        const getLatestAction = (o) => {
          let now = new Date()
          return (now.getTime() - parseFloat(o.timestamp) * 1000) / 1000
        }
        let pending = deposits.find(
          (o) =>
            getLatestAction(o) <
              parseFloat(this.vault.comptroller.sharesActionTimelock)
        )
        if (pending) {
          let i = parseFloat(
            this.vault.comptroller.sharesActionTimelock
          ) - getLatestAction(pending)
          let days =
              this.vault.comptroller.sharesActionTimelock / 3600

          this.pendingAction = {
            time: days + ' hours',
            timer: this.secondsTotime(i, true)
          }
          // this.pendingAction = null
        } else {
          this.pendingAction = null
        }
      } else {
        this.pendingAction = null
      }
    },
    async initWithdrawal () {
      this.getDeposits()
      let data = await EnzymeV4.getUserVaults(this.$store.state.currentwallet.user.address, this.vault.id)
      if (data && data.length) {
        this.shares = data[0].shares
      }
    },
    getUserBalance () {
      this.$axios
        .get(
          process.env[this.$store.state.settings.network].CACHE +
            'https://api.ethplorer.io/getAddressInfo/' +
            this.user.address +
            '?apiKey=EK-kJ7LW-wCWTsAy-ALujf'
        )
        .then((res) => {
          let ethplorer = res ? res.data : false
          if (ethplorer && ethplorer.ETH) {
            this.tokens[0].usd =
              ethplorer.ETH.balance * ethplorer.ETH.price.rate
            this.tokens[0].amount = ethplorer.ETH.balance
            this.tokens[0].price = ethplorer.ETH.price.rate
            let data = ethplorer.tokens
              ? ethplorer.tokens.find(
                (o) =>
                  o.tokenInfo.address.toLowerCase() ===
                    this.denominationData.id.toLowerCase()
              )
              : false

            this.tokens.push({
              address: this.denominationData.id,
              type: this.denominationData.symbol,
              decimals: data ? data.tokenInfo.decimals : null,
              image: 'https://env.enzyme.finance/ethereum/assets/' + this.denominationData.id + '/logo.png',
              amount: data ? data.balance / 10 ** data.tokenInfo.decimals : 0,
              usd: data
                ? (data.balance / 10 ** data.tokenInfo.decimals) *
                  data.tokenInfo.price.rate
                : 0,
              price: data ? data.tokenInfo.price.rate : 0
            })

            if (this.actionType === 'deposit') {
              this.selected =
                this.tokens[0].amount === 0 ? this.tokens[1] : this.tokens[0]
            }
          }
        })
    }
  },
  computed: {
    user () {
      return this.$store.state.currentwallet.user
    },
    maxDeposit () {
      let amount = 0
      if (this.actionType === 'deposit') {
        amount = this.selected
          ? this.selected.amount -
            (this.gas.eth && this.selected && this.selected.type === 'ETH'
              ? this.gas.eth
              : 0)
          : 0
      } else if (this.actionType === 'withdraw' && this.currentUserDeposits) {
        amount = this.shares
      }
      return amount
    }
  },
  watch: {
    maxDeposit () {
      if (parseFloat(this.amount) > this.maxDeposit) {
        this.amount = this.maxDeposit
        this.message =
          'Max deposit amount changed to ' +
          this.maxDeposit +
          ' because of gas fees'
        this.txObject = null
        this.getTransactionObject()
      }
    }
  },
  data () {
    return {
      alert: true,
      shares: 0,
      slippage: '3%',
      reviewStep: false,
      showInfoSlippage: false,
      sharesActionTimelock: null,
      termsConditions: false,
      advancedSettings: false,
      withdrawPopup: false,
      showInfo: false,
      termsConditionPopup: false,
      currentUserDeposits: null,
      approvalRequired: false,
      confirmWindow: false,
      status: null,
      pendingAction: 'pending',
      txObject: null,
      whitelistRequired: false,
      message: '',
      selected: null,
      denominationData: null,
      gas: {
        usd: null,
        eth: null
      },
      txHash: null,
      spinnerVisible: false,
      error: null,
      amount: 0,
      tokens: [
        {
          type: 'ETH',
          image: 'statics/staider/coins/eth.svg',
          amount: null,
          usd: null
        }
      ]
    }
  },
  async created () {
    if (this.actionType === 'whitelistRequired') {
      this.whitelistRequired = true
    } else {
      this.denominationData = this.vault.comptroller.denomination
      // this.getDeposits()
      this.sharesActionTimelock =
      parseInt(this.vault.comptroller.sharesActionTimelock) / 24 / 60 / 60
      this.sharesActionTimelock =
      this.sharesActionTimelock.toString() +
      ' day' +
      (this.sharesActionTimelock > 1 ? 's' : '')

      this.spinnerVisible = false
      if (this.actionType === 'withdraw') {
        this.initWithdrawal()
      } else {
        this.getUserBalance()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/staider_theme/helpers.scss";
.depositPopup {
  flex-wrap: nowrap !important;
}
.vault-section {
  min-height: 600px;
  .vaults-tabs-centent {
    /deep/ .q-tab-panel {
      padding: 0px !important;
      @media screen and (max-width: 768px) {
        margin-top: 20px;
      }
    }
    .body-table-col .imgs {
      margin-top: 5px;
      min-width: 30px;
    }
    .body-table-col .imgs img {
      border-radius: 40px;
      height: 30px;
    }
  }
  .vaults-tabs-wrapper {
    width: fit-content;
    border: 2px solid #2d2d30;
    border-radius: 6px;
    /deep/ .q-tab {
      margin-right: 20px;
      border-radius: 6px !important;
      @media screen and (max-width: 768px) {
        margin-right: 0px;
        .q-tab__label {
          font-size: 12px !important;
          line-height: 1.715em;
          font-weight: 500;
        }
      }
    }
    /deep/ .q-tab--active {
      img {
        opacity: 1;
      }
    }
    /deep/ .q-tab--inactive {
      img {
        opacity: 0.5;
      }
    }
  }
  .vaults-table {
    width: 96%;
    /deep/ .th-header-style {
      color: rgba(white, 0.4);
      font-family: $MainFont;
      font-size: 14px;
      font-weight: 400;
    }
    /deep/ .q-table__control {
      opacity: 0.5;
    }
  }
  .mobile-table {
    border: 1px solid #2d2d30;
    border-radius: 10px;
    font-family: $MainFont;
    font-weight: 400;
    font-size: 12px;
    .row {
      border-bottom: 1px solid #2d2d30;
    }
    .net-label {
      font-size: 12px;
    }
    .net-value {
      font-size: 14px;
      font-weight: 600;
    }
    .vault-name {
      font-size: 16px;
      line-height: 20px;
    }
    .standard-label {
      font-size: 16px;
      font-weight: 600;
    }
    .standard-value {
      font-size: 14px;
      font-weight: 400;
    }
  }
  .stats-wrapper {
    border: 2px solid #2d2d30;
    border-radius: 6px;
    min-height: 80px;
    margin-top: 15px;
    cursor: default;
    transition: border ease 0.3s;
    .label {
      font-family: $MainFont;
      font-size: 15px;
      font-weight: 400;
    }
    .value {
      font-family: $MainFont;
      font-size: 18px;
      font-weight: 700;
    }
    &.hovered,
    &:hover {
      border: 2px solid $MainYellow;
    }
  }
  .sticky-header {
    position: sticky;
    top: 0px;
    border-radius: 20px 20px 0px 0px;
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    z-index: 999;
    background: rgba(#1d1d21, 0.6);
    padding-top: 10px;
    padding-bottom: 10px;
    @media screen and (max-width: 768px) {
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }
  .vault-dropdown-col {
    margin-top: 0px;
    @media screen and (max-width: 768px) {
      margin-top: -20px;
    }
    .daily-change {
      position: absolute;
      top: 80%;
      left: 21px;
      font-size: 11px;
      font-family: $MainFont;
    }
    .imgs {
      margin-top: -10px;
      @media screen and (max-width: 768px) {
        margin-top: -10px;
      }
    }
    .coin-name {
      font-family: $MainFont;
    }
    .vault-name {
      font-family: $MainFont;
      .pair {
        font-size: 14px;
        font-weight: 200;
        @media screen and (max-width: 768px) {
          display: none;
        }
      }
      .value {
        font-size: 16px;
        font-weight: 600;
        margin-top: -5px;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          margin-top: 0px;
        }
      }
    }
  }
  .share-price-wrapper {
    position: relative;
    z-index: 10;
    transform: scale(0.85);
    @media screen and (max-width: 768px) {
      margin-top: 5px;
    }
    .label {
      font-family: $MainFont;
      font-size: 14px;
      font-weight: 200;
      margin-bottom: -5px;
    }
    .value {
      font-family: $MainFont;
      font-size: 32px;
      font-weight: 700;
      small {
        font-size: 16px;
        font-weight: 600;
      }
    }
    .daily-change {
      font-size: 12px;
      font-family: $MainFont;
      font-weight: 400;
      margin-top: -5px;
    }
    .action-btn-wrapper {
      position: absolute;
      top: calc(100% + 15px);
      /deep/ button {
        background: #1d1d21 !important;
      }
    }
  }
  .network-wrapper {
    padding-right: 0px;
    transform: translateX(-25px);
    margin-top: 0px;
    @media screen and (max-width: 768px) {
      margin-top: 5px;
    }
    .pair {
      font-size: 14px;
      font-family: $MainFont;
      font-weight: 200;
      @media screen and (max-width: 768px) {
        font-size: 12px;
      }
    }
    .value {
      font-size: 17px;
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
      font-family: $MainFont;
      font-weight: 600;
    }
  }
  .chart-row {
    margin-top: 0px;
  }
}
.deposit-withdraw-popup-wrapper {
  background: #1d1d21;
  width: 100%;
  min-height: 274px;
  max-width: 600px;
  border-radius: 20px;
  box-shadow: 0px 36px 36px 0px #000 !important;
  .popup-title {
    font-size: 12px;
    font-family: $MainFont;
    font-weight: 600;
  }
  .action-label {
    font-size: 12px;
    font-family: $MainFont;
    font-weight: 400;
    opacity: 1;
    .cancel {
      background: #2d2d30 !important;
      opacity: 0.8;
    }
  }
  .input-wrapper {
    position: relative;
    .max-wrapper {
      position: absolute;
      top: 0px;
      left: 100%;
      width: 80%;
      height: 44px;
      &.withdraw {
        width: auto;
      }
      @media screen and (max-width: 643px) {
        &:not(.withdraw) {
          position: relative;
          top: 0px;
          left: 0%;
          width: 100%;
          height: 44px;
          margin-top: 10px;
        }
      }
      .max-btn {
        background: rgba(#2d2d30, 0.8) !important;
        font-family: $MainFont !important;
        font-weight: 400 !important;
        font-size: 12px !important;
        border-radius: 7px !important;
        margin-left: 5px;
        height: 44px;
        &.yellow {
          background: $MainYellow !important;
        }
        /deep/ .q-btn__wrapper {
          padding: 0px 10px !important;
        }
      }
      .coin-dropdown-wrapper-btn {
        background: rgba(#2d2d30, 0.8) !important;
        font-family: $MainFont !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        border-radius: 7px !important;
        margin-left: 5px;
        height: 44px;
        @media screen and (max-width: 643px) {
          margin-left: 0px;
        }
      }
    }
  }
  .instruction {
    font-size: 16px;
    font-family: $MainFont;
    font-weight: 400;
  }
  .connecting-wrapper {
    min-height: 140px;
    .name {
      font-family: $MainFont;
      font-size: 14px;
      font-weight: 600;
    }
  }
  /deep/ .advanced-settings-btn {
    color: $MainYellow !important;
    font-family: $MainFont !important;
    font-size: 14px !important;
    font-weight: 400 !important;
    opacity: 0.6;
    width: fit-content;
    margin-left: -15px;
    &:hover {
      opacity: 1;
    }
    .q-focus-helper {
      display: none;
    }
  }
  .share-lockup-time {
    position: relative;
    width: fit-content;
    .infobull-wrapper {
      position: absolute;
      left: calc(100% + 10px);
      top: 50%;
      color: #fff;
      font-family: $MainFont;
      font-size: 12px;
      font-weight: 200;
      background: #1d1d21 !important;
      box-shadow: 0px 14px 14px 0px rgba(#000, 0.5) !important;
      padding: 10px 15px;
      border-radius: 8px;
      transition: transform ease 0.3s, opacity ease 0.3s;
      opacity: 0;
      transform: translate(10px, -50%);
      visibility: hidden;
      width: 244px;
      &.show {
        opacity: 1;
        transform: translate(0px, -50%);
        visibility: visible;
      }
    }
    .info {
      background: #fff;
      display: inline-flex;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      justify-content: center;
      color: #333;
      font-family: $MainFont;
      font-size: 13px;
      align-items: center;
      font-weight: 700;
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        background: $MainYellow;
      }
    }
  }
  /deep/ .termsConditions {
    margin-left: -9px;
    opacity: 0.8;
    .q-checkbox__inner--truthy .q-checkbox__bg,
    .q-checkbox__inner--indet .q-checkbox__bg {
      background: rgba($MainYellow, 0.4);
      border-color: $MainYellow;
    }
    .q-checkbox__bg {
      border-color: #333;
    }
    a {
      color: $MainYellow;
      text-decoration: none;
    }
  }
  /deep/ .amount-input {
    background: #16161a !important;
    font-family: $MainFont !important;
    font-size: 16px !important;
    border-radius: 8px !important;
    margin-left: -2px;
    height: 44px;
    /deep/ .q-input__wrapper:before {
      border: 2px solid #2d2d2d !important;
    }
    &.q-field--dark .q-field__control {
      height: 44px;
      .q-field__native {
        font-weight: 700 !important;
      }
      &:before {
        border: 2px solid #2d2d2d !important;
      }
      &:hover:before {
        border: 2px solid #353535 !important;
      }
    }
  }
}
.terms_scroll {
  border-radius: 20px;
  overflow: hidden;
  // max-width: calc(100% - 180px);
  max-height: 50vh;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0px;
  border-radius: 20px;
  // padding: 0px;
  padding-bottom: 20px;
  margin-left: -8px !important;
  margin-right: -8px !important;
  &.height-auto {
    margin-top: 0px;
    border-radius: 0px;
    max-width: 100%;
    height: calc(100vh - 101px) !important;
  }
  p {
    font-family: $MainFont;
    font-size: 12px;
    font-weight: 400;
    opacity: 0.8;
    line-height: 20px;
    text-align: justify;
  }
  h4 {
    font-family: $MainFont;
    font-size: 16px;
    font-weight: 600;
    margin: 0px;
    padding: 0px;
    opacity: 0.8;
  }
  &.blur-effect {
    filter: blur(5px);
  }
}
/deep/ .q-scrollarea--dark .q-scrollarea__thumb {
  background: #fff;
  right: 0px;
  border-radius: 20px;
  width: 10px;
  transform: scale(0.8);
  z-index: 9999;
}
/deep/ .q-page-container {
  padding-top: 0px !important;
}
a {
        text-decoration: none;
    color: #9e9e9e;
}
</style>
<style>
.vault-dropdown-wrapper {
  background: #1d1d21 !important;
  box-shadow: 0px 36px 36px 0px !important;
}
.vault-dropdown-wrapper.coin-drop {
  width: 180px !important;
  max-width: 180px !important;
  margin-top: 10px !important;
  transform: translateX(48px);
}
.vault-dropdown-wrapper .dropdown-content {
  background: #1d1d21 !important;
}
.vault-dropdown-wrapper .dropdown-content.coin-dropdown {
  border: 2px solid #f6f973;
  border-radius: 10px;
}
.vault-dropdown-wrapper .dropdown-content hr {
  opacity: 0.2 !important;
}
.vault-dropdown-wrapper-btn .q-btn-dropdown__arrow-container {
  /* display: none !important; */
}
.vault-dropdown-wrapper-btn {
  margin-left: 0px;
  opacity: 0.9;
  transform: scale(1);
}
.vault-dropdown-wrapper-btn:hover {
  opacity: 1;
}
.vault-dropdown-wrapper-btn .q-focus-helper {
  display: none;
}
.vault-dropdown-wrapper-btn.active {
  /* border: 3px solid #F6F973; */
}
.vault-dropdown-wrapper .vault-name.coin .value {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
}
.vault-dropdown-wrapper .coin-item {
  cursor: pointer;
  opacity: 0.7;
}
.vault-dropdown-wrapper .coin-item:hover {
  opacity: 1;
}
.vault-dropdown-wrapper .dropdown-content a {
  text-decoration: none;
  padding: 5px 15px;
  margin-bottom: 5px;
  margin-top: 5px;
  font-family: "Inter", sans-serif;
  font-size: 12px;
  letter-spacing: 0.2px;
  font-weight: 400;
  opacity: 0.7;
}
.vault-dropdown-wrapper .dropdown-content a:hover {
  opacity: 1;
}
</style>
