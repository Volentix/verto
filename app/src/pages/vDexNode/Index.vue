<template>
<q-layout>
    <div class="titlebar"></div>
    <q-page-container class="vdexNode">
        <q-page class="bg-vblack q-pa-lg " :class="blur ? 'blur' : ''">
            <!-- Topbar -->
            <div class="row bg-vdark items-center q-mb-lg titilium">
                <div class="col q-py-sm q-px-md">
                    <div class="text-h6 text-uppercase text-weight-bolder text-vgrey border-right titilium">
                        <div class="row no-wrap">
                            <img src="@/statics/icons/logo.png" class="q-mr-sm" style="height: 32px; max-width: 32px" />
                            <div>
                                Volentix Node
                                <q-badge color="vgold" class="q-mx-sm" text-color="vblack" align="top" transparent>{{ version }}</q-badge>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col q-py-sm q-px-sm">
                    <div class="text-h6 text-vgreen text-weight-bolder text-uppercase titilium">
                        Volentix Node
                        <span class="text-vgrey text-weight-regular text-lowercase">Control Panel</span>
                    </div>
                    <div class="row items-center">
                        <div class="text-italic text-vgrey titilium">Contribute to the Node Network and get VTX</div>
                        <q-btn color="vgrey" size="7px" flat round icon="fas fa-question" class="q-mx-xs" @click="helpDialog = true">
                            <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to know more</q-tooltip>
                        </q-btn>
                    </div>
                </div>

                <div class="col q-py-sm q-px-sm">
                    <div class="row justify-end">
                      <q-select   class="text-vgreen"  color="vgreen" rounded outline  @input="accountName = account.name ; trigger++ ; initAccount(account.name)" v-model="account" :options="$store.state.wallets.tokens.filter(o => o.origin == 'eos_testnet').map(w => {

                          w.value  = w.name,
                          w.label = w.name

                        return w
                      })">
                    <template v-slot:selected>
                        <q-item>
                            <q-item-section avatar>
                                <q-icon class="option--avatar" :name="`img:https://files.coinswitch.co/public/coins/eos.png`" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-vgreen">Change account</q-item-label>
                                <q-item-label caption class="ellipsis mw200 text-white">{{ account.name }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                    <!-- <template v-slot:append>
                        <q-avatar>
                            <img src="https://www.volentix.io/statics/icons_svg/svg_logo.svg">
                        </q-avatar>
                    </template> -->
                </q-select>
                        <q-btn outline rounded color="vgreen" class="q-mx-xs" label="Get vDex node" @click="installDialog = true" />
                        <q-btn icon="arrow_back_ios" label="Back to verto" flat rounded color="vgreen" class="q-mx-xs" to="/verto/dashboard" />
                    </div>
                </div>
            </div>

            <!-- Identity, List panel, vote panel -->
            <div class="row q-col-gutter-x-lg q-mb-lg titilium">
                <!-- Identity -->
                <div class="col-3">
                    <q-banner dense class="text-vgrey bg-vdark q-pa-md">
                        <div class="row">
                            <div class="col">
                                <div class="text-subtitle2 text-uppercase">Welcome</div>
                            </div>
                            <div class="col text-right">
                                <div class="text-subtitle2 text-vgreen text-weight-bolder text-uppercase">{{ identity.accountName }}</div>
                            </div>
                        </div>
                    </q-banner>
                    <q-separator dark />
                    <q-list dense separator class="bg-vdark text-vgrey">
                        <q-item v-if="!status.accountRegistered">
                            <q-item-section>
                                <!-- <q-btn outline rounded dense color="vgreen" icon="fas fa-user-plus" class="q-my-xs" @click="addNode()" label="Add">
                    <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Add the node</q-tooltip>
                  </q-btn> -->
                                <q-btn outline rounded color="vgreen" icon="fas fa-address-card" class="q-mx-xs" @click="registerNode()" label="Register">
                                    <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Register the node</q-tooltip>
                                </q-btn>
                            </q-item-section>
                        </q-item>
                        <q-separator color="vseparator" v-if="!status.accountRegistered" />
                        <q-item v-if="!status.accountRun && false">
                            <q-item-section>
                                <q-btn outline rounded dense color="vgreen" icon="fas fa-running" class="q-my-xs" @click="retreiveReward()" label="Run">
                                    <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">
                                        You need to init your node by pushing the retreive reward
                                        action first time.
                                    </q-tooltip>
                                </q-btn>
                            </q-item-section>
                        </q-item>
                        <q-separator color="vseparator" v-if="!status.accountRun" />
                        <q-item>
                            <q-item-section class="text-left">
                                <q-item-label>
                                    <q-btn size="sm" rounded outline dense class="q-my-xs q-px-sm" color="vgrey" @click="publicDialog = true" label="Get public key">
                                        <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to get your public key</q-tooltip>
                                    </q-btn>
                                </q-item-label>
                            </q-item-section>
                            <q-item-section class="text-right">
                                <q-item-label class="text-weight-bolder" :class="parseFloat(identity.balance) > 0 ? 'text-vgrey' : 'text-vred' ">{{ identity.balance }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator color="vseparator" />
                        <q-item v-if="parseFloat(identity.balance) == 0">
                            <q-item-section>
                                <q-btn label="Get VTX" outline rounded dense color="vred" @click="$utils.openExternal('https://www.stex.com/')" />
                            </q-item-section>
                        </q-item>
                        <q-separator color="vseparator" v-if="parseFloat(identity.balance) == 0" />
                        <q-item>
                            <q-item-section>
                                <q-item-label>
                                    Rank:
                                    <q-btn size="7px" class="q-mx-xs" dense flat round icon="fas fa-question" @click="rankDialog = true">
                                        <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to know more</q-tooltip>
                                    </q-btn>
                                </q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label caption class="text-vgrey">Total ranks: {{ identity.totalRanks }}</q-item-label>
                            </q-item-section>
                            <q-item-section avatar class="text-weight-bolder text-vgrey">
                                <q-item-label>#{{ identity.rank }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator color="vseparator" />
                        <q-item>
                            <q-item-section>
                                <div align="center" class="text-subtitle2 text-vgreen text-uppercase">
                                    <div content-style="font-size: 12px"> daily reward countdown </div>
                                    <div content-style="font-size: 24px" class="text-weight-bolder">
                                        {{ daily_reward_calculation_countdown.hours }} : {{daily_reward_calculation_countdown.minutes}} : {{daily_reward_calculation_countdown.seconds}}
                                    </div>
                                </div>
                            </q-item-section>
                        </q-item>
                        <q-separator color="vseparator" />
                        <q-item>
                            <q-item-section disabled>
                                <q-item-label>VTX earned:</q-item-label>
                            </q-item-section>
                            <q-item-section avatar disabled>
                                <q-item-label>{{ identity.earned }} VTX</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator color="vseparator" />
                        <q-item>
                            <q-item-section align="left">
                                <q-item-label>
                                    RAM
                                    <sup>(used)</sup>
                                </q-item-label>
                                <q-item-label class="text-vgrey">{{ status.ram }}</q-item-label>
                            </q-item-section>
                            <q-item-section align="center">
                                <q-item-label>
                                    NET
                                    <sup>(used)</sup>
                                </q-item-label>
                                <q-item-label class="text-vgrey">{{ status.net }}</q-item-label>
                            </q-item-section>
                            <q-item-section align="right">
                                <q-item-label>
                                    CPU
                                    <sup>(avail)</sup>
                                </q-item-label>
                                <q-item-label :class="parseFloat(status.cpu) == 0 ? 'text-vred' : 'text-vgrey'">{{ status.cpu }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator color="vseparator" />
                        <q-item v-if="parseFloat(status.cpu) == 0" class="bg-vred text-white">
                            <q-item-section>
                                <q-item-label>Not enough CPU time to complete transactions! You can wait for the network to be less loaded or stake more CPU.</q-item-label>
                            </q-item-section>
                            <q-item-section avatar>
                                <q-btn label="Stake CPU" outline rounded dense size="sm" class="q-px-sm" color="white" @click="$utils.openExternal('https://docs.bloks.io/wallet/staking-cpu-+-net')" />
                            </q-item-section>
                        </q-item>
                        <q-separator color="vseparator" v-if="parseFloat(status.cpu) == 0" />
                        <q-item align="center">
                            <q-item-section>
                                <div align="center" class="text-subtitle2  text-uppercase">
                                    <div content-style="font-size: 12px"> available for retrieval </div>
                                    <div content-style="font-size: 24px" class="text-weight-bolder">
                                        {{identity.availble_for_retrieval}}
                                    </div>
                                </div>
                                <q-btn label="Retrieve reward" v-if="false" outline rounded color="vgreen" class="q-my-xs" @click="retreiveReward()" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <!-- List panel -->
                <div class="col-6">
                    <q-banner dense inline-actions class="text-vgrey bg-vdark q-px-md q-pt-md">
                        <div class="row">
                            <div class="column">
                                <div class="col">
                                    <div class="text-subtitle2 text-uppercase">
                                        List of Nodes on the network
                                        <q-btn size="7px" class="q-mx-xs" dense flat round icon="fas fa-question">
                                            <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">
                                                List of the nodes is automatically updated every 5
                                                minutes
                                            </q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>
                                <div class="col">
                                    <q-badge color="vgrey" class="text-vdark q-mr-xs">Running: {{ nodes.length }}</q-badge>
                                    <q-badge color="vgrey" class="text-vdark q-mr-xs">
                                        Registered: {{ registered_nodes.length }}
                                        <q-tooltip content-class="bg-grey text-dark">
                                            <q-badge color="vdark" class="text-vgrey q-pa-xs q-ma-xs" v-for="node in registered_nodes" :key="node">{{ node }}</q-badge>
                                        </q-tooltip>
                                    </q-badge>
                                    <q-badge color="vgrey" class="text-vdark q-mr-xs" v-if="identity.voted_for.length > 0">
                                        Voted for you: {{ this.identity.voted_for.length }}
                                        <q-tooltip content-class="bg-grey text-dark">
                                            <q-badge color="vdark" class="text-vgrey q-pa-xs q-ma-xs" v-for="node in identity.voted_for" :key="node">{{ node }}</q-badge>
                                        </q-tooltip>
                                    </q-badge>
                                    <q-badge color="vgrey" class="text-vdark q-mr-xs q-mb-sm" v-if="identity.voted_i.length > 0">
                                        I voted for: {{ this.identity.voted_i.length }}
                                        <q-tooltip content-class="bg-grey text-dark">
                                            <q-badge color="vdark" class="text-vgrey q-pa-xs q-ma-xs" v-for="node in identity.voted_i" :key="node">{{ node }}</q-badge>
                                        </q-tooltip>
                                    </q-badge>
                                </div>
                            </div>
                        </div>
                        <template v-slot:action>
                            <q-btn outline rounded size="xs" dense :disabled="!voting_list.length && nodes.length && nodes.every(item => item.balance !== '' && item.account) ? false : true " color="vgold" class="q-px-sm q-mx-xs" @click="getVoteBackList('random')" label="Vote back (random)" />
                            <q-btn outline rounded size="xs" dense :disabled="!voting_list.length && nodes.length && nodes.every(item => item.balance !== '' && item.account) ? false : true " color="vgold" class="q-px-sm q-mx-xs" @click="getVoteBackList('top')" label="Vote back (top)" />
                            <q-btn outline flat round color="vgold" size="sm" icon="fas fa-sync-alt" class="q-mx-xs" :disabled="nodes.length && nodes.every(item => item.balance !== '' && item.account) ? false : false " v-on:click="refresh()" />
                        </template>
                    </q-banner>
                    <q-separator dark />
                    <q-linear-progress dark indeterminate track-color="vgrey" color="vgreen" v-if="nodes.length === 0" />
                    <!-- Table example -->
                    <div class="bg-vdark">
                    <div  style="background: #e9e9e9;" class="q-pb-md">
                     <RequirementChecker @registerAccount="registerNode" :key="trigger" :name="account.name"/>
                     </div>
                        <q-table dense :data="nodes" :columns="nodesColumns" row-key="name" virtual-scroll :pagination.sync="nodesPagination" :rows-per-page-options="[0]" table-style="max-height: 190pt;" hide-bottom class="bg-vdark text-vgrey">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="account" :props="props">
                                        <q-btn dense flat size="sm" :color="props.row.balance > 0 ? 'vgreen' : 'vgold'" class="code" @click="$utils.openExternal('https://bloks.io/account/', props.row.account ) " :label="props.row.account" :disabled="props.row.account !== 'No account found' ? false : true " />
                                    </q-td>
                                    <q-td key="rank" :props="props" class="code">{{ props.row.rank }}</q-td>
                                    <q-td key="balance" :props="props" class="code" :class="props.row.balance > 0 ? 'text-vgrey' : 'text-vgold'">{{ props.row.balance }} VTX</q-td>
                                    <q-td key="voted_for" :props="props">
                                        <q-icon name="fas fa-check" class="text-vgrey" v-show="props.row.voted_for" />
                                        <q-icon name="fas fa-times" class="text-vblack" v-show="!props.row.voted_for" />
                                    </q-td>
                                    <q-td key="voted_i" :props="props">
                                        <q-icon name="fas fa-check" class="text-vgrey" v-show="props.row.voted_i" />
                                        <q-icon name="fas fa-times" class="text-vblack" v-show="!props.row.voted_i" />
                                    </q-td>
                                    <q-td key="vote" :props="props">
                                        <div v-if="
                          props.row.vote &&
                            props.row.account != identity.accountName
                        ">
                                            <q-btn outline dense size="xs" class="q-px-md" rounded color="vgold" v-on:click="addToVote(props.row)" v-if="!voting_list.includes(props.row)">Vote</q-btn>
                                            <q-btn size="xs" dense rounded color="vgold" class="text-vdark q-px-md" v-on:click="addToVote(props.row)" v-if="voting_list.includes(props.row)">Vote</q-btn>
                                        </div>
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </div>
                </div>
                <!-- Vote panel -->
                <div class="col-3">
                    <q-banner dense class="text-vgrey bg-vdark q-px-md q-pt-md">
                        <div class="row items-center">
                            <div class="col">
                                <div class="text-uppercase">
                                    Voting
                                    <q-btn size="7px" color="vgrey" dense flat round icon="fas fa-question" @click="rulesDialog = true">
                                        <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to see the voting rules</q-tooltip>
                                    </q-btn>
                                </div>
                            </div>
                            <div class="col">
                                <q-badge color="vgrey" class="text-vdark text-weight-bolder text-caption" v-if="voting_list.length > 0">{{ voting_list.length }}/21</q-badge>
                                <q-btn size="xs" class="q-mx-xs" color="vgrey" flat round icon="fas fa-backspace" v-if="voting_list.length > 0" @click="voting_list = []">
                                    <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to clear the voting list</q-tooltip>
                                </q-btn>
                            </div>
                            <div class="col q-pa-sm text-right">
                                <div class="text-caption" v-if="voting_list.length == 0">Choose nodes</div>
                                <q-btn color="vgold" rounded size="sm" dense class="text-vdark text-weight-bolder q-px-md" v-on:click="vote()" v-if="voting_list.length > 0">Vote now</q-btn>
                            </div>
                        </div>
                    </q-banner>
                    <q-separator dark />
                    <div class="bg-vdark">
                        <q-table v-if="voting_list.length > 0" dense flat :data="voting_list" :columns="voting_listColumns" row-key="name" virtual-scroll :pagination.sync="voting_listPagination" :rows-per-page-options="[0]" table-style="max-height: 190pt;" hide-bottom class="bg-vdark text-vgrey">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="account" :props="props">
                                        <q-btn dense flat size="sm" color="vgreen" class="code" @click="
                          $utils.openExternal('https://bloks.io/account/',  props.row.account )
                        " :label="props.row.account" />
                                    </q-td>
                                    <q-td key="rank" :props="props">{{ props.row.rank }}</q-td>
                                    <q-td key="balance" :props="props">{{ props.row.balance }} VTX</q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </div>
                </div>
            </div>

            <!-- Map, chat -->
            <div class="row q-col-gutter-x-lg titilium">
                <!-- Map Widget -->
                <div class="col-12">
                    <MapWidget v-bind:nodes="nodes" />
                </div>
                <!-- Chat -->
                <div class="col-5">
                    <ChatWidget v-if="false" />
                </div>
            </div>

            <!-- Public key dialog -->
            <q-dialog v-model="publicDialog">
                <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
                    <q-card-section>
                        <div class="text-h6">Public key</div>
                        <q-separator dark />
                    </q-card-section>
                    <q-card-section>
                        <q-list bordered round class="bg-vgrey text-vdark">
                            <q-item clickable v-ripple @click="$utils.copyToClipboard(identity.publicKey)">
                                <q-item-section>{{ identity.publicKey }}</q-item-section>
                                <q-item-section avatar>
                                    <q-icon color="vdark" name="fas fa-copy" />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn outline rounded color="vgold" label="Got it" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <!-- Help dialog -->
            <q-dialog v-model="helpDialog">
                <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
                    <q-card-section>
                        <div class="text-h6">Help</div>
                        <q-separator dark />
                    </q-card-section>
                    <q-card-section style="max-height: 60vh" class="scroll">
                        <div class="text-subtitle1">1. Private key.</div>
                        <p>
                            It used to define your public key, EOS account name and other
                            required information.
                        </p>

                        <div class="text-subtitle1">2. Add the account</div>
                        <p>It will add your account name into distribution contract.</p>

                        <div class="text-subtitle1">3. Register the account</div>
                        <p>It will register your account in the voting contract.</p>

                        <div class="text-subtitle1">4. Run</div>
                        <p>
                            It will start monitor the uptime of your node in the voting
                            contract.
                        </p>

                        <div class="text-subtitle1">5. Vote</div>
                        <p>
                            You can choose a number of nodes from the list you want to vote
                            for.
                        </p>

                        <div class="text-subtitle1">6. Retreive reward</div>
                        <p>
                            To receive your reward for the running node click on the button
                            retreive reward.
                        </p>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn outline rounded color="vgold" label="Got it" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <!-- Install dialog -->
            <q-dialog v-model="installDialog">
                <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
                    <q-card-section>
                        <div class="text-h6">Install VDEX Node</div>
                        <q-separator dark />
                    </q-card-section>
                    <q-card-section>

                        <div v-if="!status.accountRegistered">
                            <div class="text-subtitle1">1. Register node</div>
                            <template>
                                <div class="q-pa-md" style="max-width: auto">
                                    <q-btn outline rounded color="vgreen" icon="fas fa-address-card" class="q-mx-xs" @click="registerNode()" label="Register">
                                        <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Register the node</q-tooltip>
                                    </q-btn>
                                </div>
                            </template>
                        </div>
                        <div v-if="!status.accountRegistered" class="text-subtitle1">2.  Get the instructions</div>
                        <div v-if="status.accountRegistered" class="text-subtitle1">1.  Get the instructions</div>
                        <template>
                            <div class="q-pa-md" style="max-width: auto">
                                <q-input v-model="script" filled color="vgreen" style="background-color: white;" type="textarea" />
                            </div>
                        </template>

                        <q-btn outline rounded color="vgreen" class="q-mx-xs" label="Copy instructions" @click="$utils.copyToClipboard(script)">
                            <q-icon color="vgreen" style="margin-left: 20px" name="fas fa-copy" />
                        </q-btn>

                        <div v-if="!status.accountRegistered" class="text-subtitle1" style="margin-top: 20px">Instructions are taken from the <a href="https://github.com/Volentix/vdexnode" target="_blank">official Github repository</a> </div>
                        <div v-if="status.accountRegistered" class="text-subtitle1" style="margin-top: 20px">Instructions are taken from the <a href="https://github.com/Volentix/vdexnode" target="_blank">official Github repository</a></div>

                        <q-card-section>
                            <q-list bordered round class="bg-vgrey text-vdark">
                                <q-item clickable v-ripple @click="$utils.copyToClipboard(commandLine)">
                                    <q-item-section>{{ commandLine }}</q-item-section>
                                    <q-item-section avatar>
                                        <q-icon color="vdark" name="fas fa-copy" />
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>

                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn outline rounded color="vgold" label="Got it" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <!-- Rank  dialog -->
            <q-dialog v-model="rankDialog">
                <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
                    <q-card-section>
                        <div class="text-h6">Rank</div>
                        <q-separator dark />
                    </q-card-section>
                    <q-card-section style="max-height: 60vh" class="scroll">
                        <div class="text-subtitle1">How the rank works</div>
                        <ul>
                            <li>
                                Rank is your position among all registered nodes based on the
                                vote points.
                            </li>
                            <li>
                                Those users who vote for your node give you their points based
                                on the power of their vote. The sum of points and its position
                                harm the other nodes forms the rank. Foe example #1 means you
                                have the most vote points.
                            </li>
                            <li>
                                The power of the vote depends on the VTX balance. The more VTX
                                you have, the stronger your vote.
                            </li>
                            <li>
                                Votes are divided by the number of nodes for which you vote.
                                For example, if the strength of your vote is 10 points and you
                                vote for 1 node, you give all 10 points to this node, but if
                                you vote for 5 nodes, each will receive 2 points only.
                            </li>
                        </ul>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn outline rounded color="vgold" label="Got it" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <!-- Voting rules dialog -->
            <q-dialog v-model="rulesDialog">
                <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
                    <q-card-section>
                        <div class="text-h6">Voting rules</div>
                        <q-separator dark />
                    </q-card-section>
                    <q-card-section style="max-height: 60vh" class="scroll">
                        <div class="text-subtitle1">1. Voting.</div>
                        <ul>
                            <li>You can't vote for the node without account name.</li>
                            <li>You can't vote for the yourself (node with your account name).</li>
                            <li>
                                You can't vote for the node which is not registered in the
                                contracts.
                            </li>
                        </ul>
                        <div class="text-subtitle1">2. Reward.</div>
                        <ul>
                            <li>For being rewared your node should be running.</li>
                            <li>
                                Your node assigned account name should be added and registered
                                in the contracts.
                            </li>
                            <li>The uptime of your node should be at least 24 hours.</li>
                            <li>You have to vote for at least 2 other nodes to get the reward.</li>
                        </ul>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn outline rounded color="vgold" label="Got it" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </q-page>
    </q-page-container>
</q-layout>
</template>

<script>
import MapWidget from '../../components/vDexNode/MapWidget.vue'
import ChatWidget from '../../components/vDexNode/ChatWidget.vue'
import RequirementChecker from '../../components/Verto/Testnet/RequirementChecker'
let rpc
// import ualTrigger from '../../components/vDexNode/ualTrigger.vue'

/**
 * Main page. Loads other components
 * @vue-data {*} identity - Set of variables for storing user identification information
 *
 * @vue-event {} checkAccountAdded
 * @vue-event {} checkAccountRegistered
 * @vue-event {} checkAccountRun
 * @vue-event {} refresher
 * @vue-event {} identify
 * @vue-event {} getUptime
 * @vue-event {} getVoted
 * @vue-event {} getRank
 * @vue-event {} getBalance
 * @vue-event {} updatePrivate
 * @vue-event {} showPrivate
 * @vue-event {} refresh
 * @vue-event {} getInstaller
 * @vue-event {} forceFileDownload
 * @vue-event {} addNode
 * @vue-event {} registerNode
 * @vue-event {} getAccountName
 * @vue-event {} getNodes
 * @vue-event {} getListOfNodes
 * @vue-event {} addToVote
 * @vue-event {} vote
 * @vue-event {} retreiveReward
 */
let votingContract = 'volentixvote' // vdexdposvote

import VDexNodeConfigManager from '@/util/VDexNodeConfigManager'
import {
  mapState
} from 'vuex'
import {
  EosRPC, EosAPI
} from '@/util/EosInterac'
export default {
  name: 'index',
  components: {
    MapWidget,
    ChatWidget,
    RequirementChecker
  },
  data () {
    return {
      version: '',
      commandLine: 'https://github.com/Volentix/vdexnode',
      publicDialog: false,
      helpDialog: false,
      installDialog: false,
      rankDialog: false,
      rulesDialog: false,
      trigger: 1029,
      voting_list: [],
      group: ['vote'],
      options: [{
        label: 'Vote',
        value: 'vote',
        color: 'vgreen'
      },
      {
        label: 'MPT Bitcoin',
        value: 'btcmpt',
        color: 'vgreen'
      },
      {
        label: 'Bitcoin host',
        value: 'btc',
        color: 'vgreen'
      }
      ],
      future_group: [],
      future_options: [{
        label: 'Gateway',
        value: 'gateway',
        color: 'vgreen',
        disable: true
      },
      {
        label: 'Database',
        value: 'db',
        color: 'vgreen',
        disable: true
      },
      {
        label: 'Oracle',
        value: 'oracle',
        color: 'vgreen',
        disable: true
      },
      {
        label: 'MPT Ethereum',
        value: 'ethmpt',
        color: 'vgreen',
        disable: true
      },
      {
        label: 'Chat server',
        value: 'chat',
        color: 'vgreen',
        disable: true
      }
      ],
      voting_listColumns: [{
        name: 'account',
        align: 'left',
        label: 'Account',
        field: 'account'
      },
      {
        name: 'rank',
        align: 'center',
        label: 'Rank',
        field: 'rank'
      },
      {
        name: 'balance',
        align: 'right',
        label: 'Balance',
        field: 'balance'
      }
      ],
      voting_listPagination: {
        rowsPerPage: 0
      },
      nodes: [],
      nodesColumns: [{
        name: 'account',
        align: 'left',
        label: 'Account',
        field: 'account',
        sortable: true
      },
      {
        name: 'rank',
        align: 'center',
        label: 'Rank',
        field: 'rank',
        sortable: true
      },
      {
        name: 'balance',
        align: 'right',
        label: 'Balance',
        field: 'balance',
        sortable: true
      },
      {
        name: 'voted_for',
        align: 'center',
        label: 'Voted for you',
        field: 'voted_for'
      },
      {
        name: 'voted_i',
        align: 'center',
        label: 'I voted for',
        field: 'voted_i'
      },
      {
        name: 'vote',
        align: 'center',
        label: 'Vote',
        field: 'vote'
      }
      ],
      nodesPagination: {
        rowsPerPage: 0,
        sortBy: 'rank',
        descending: false
      },
      script: '',
      now: '',
      eosApi: null,
      account: null,
      accounts: [],
      daily_reward_calculation_countdown: {
        hours: '',
        minutes: '',
        seconds: ''
      }
    }
  },
  computed: {
    ...mapState('vdexnode', ['loggedIn', 'status', 'identity', 'registered_nodes', 'daily_reward_next_calculation']),
    blur: function () {
      return this.helpDialog || this.rankDialog || this.rulesDialog || this.publicDialog || this.installDialog
    }
  },
  mounted () {
    rpc = new EosRPC(process.env[this.$store.state.settings.network].EOS_HISTORYAPI)

    // let tableData = this.$store.state.wallets.tokens
    this.accounts = this.$store.state.wallets.tokens.filter(o => o.origin === 'eos_testnet').map(w => {
      w.value = w.name
      w.label = w.name
      return w
    })
    if (this.accounts.length) {
      this.account = this.accounts[0]
      this.accountName = this.account.name
      this.initAccount(this.accountName)
    }

    /*
    this.accountName =
    tableData.filter(w => w.chain === 'eos' && w.type === 'eos').map(o => {
      o.label = o.name
      o.value = o.name
      return o
    })
 */
  },
  watch: {
    group: function (val, oldVal) {
      this.$nextTick(function () {
        this.options.forEach(element => {
          var re = `\n${element.value}=[0-1]\n`
                    var newValue = `\n${element.value}=${this.group.includes(element.value) ? '1' : '0' }\n` // eslint-disable-line
          this.script = this.script.replace(new RegExp(re, 'g'), newValue)
        })
      })
    }
  },
  beforeDestroy () {
    this.destroyIntervals()
  },
  methods: {
    resetAccount () {
      this.identity.accountName = this.account.name
      this.$store.commit('vdexnode/setAccountName', this.account.name)
      this.$store.commit('vdexnode/setPublicKey', this.account.key)
      this.initEosAPI(this.account.privateKey)
      this.$vDexNodeConfigManager.accountRegistered(this.identity.accountName)
      this.$vDexNodeConfigManager.accountRun(this.identity.accountName)
    },
    initAccount (account) {
      this.$vDexNodeConfigManager = new VDexNodeConfigManager(process.env[this.$store.state.settings.network].EOS_HISTORYAPI)
      this.identity.accountName = this.account.name
      this.destroyIntervals()
      this.$store.commit('vdexnode/setAccountName', this.account.name)
      this.$store.commit('vdexnode/setPublicKey', account.key)
      // account.privateKey = this.accounts[0].privateKey
      this.initEosAPI(this.account.privateKey)

      // to load countdown faster call getRewardHistoryData firstly
      this.$vDexNodeConfigManager.getRewardHistoryData()
      this.$vDexNodeConfigManager.getAvailbleForRetrieval(this.identity.accountName)
      this.int1 = setInterval(() => this.updateNow(), 1000)
      this.int2 = setInterval(() => this.updateDailyRewardCountdown(), 1000)
      this.int3 = setInterval(() => this.$vDexNodeConfigManager.getAvailbleForRetrieval(this.identity.accountName), 15000)
      this.version = '1.0' // this.$utils.getVersion()
      this.$vDexNodeConfigManager.accountRegistered(this.identity.accountName)
      this.$vDexNodeConfigManager.accountRun(this.identity.accountName)
      // TODO: not implemented yet
      this.$store.commit('vdexnode/setEarned', '0.0000')
      this.$store.state.vdexnode.status.time = this.$utils.getTime()
      this.m1 = this.getInfoRare()

      this.m2 = this.getInfoOften()
      this.m3 = setInterval(() => this.getInfoOften(), 60000) // 60 sec
      // TODO: uncomment when API fix the issue with different number of nodes in response
      // this.m4 = setInterval(() => this.checkAccountRun(), 3600000)
      this.m5 = setInterval(() => this.refresh(), 300000) // 5 min
      this.m6 = setInterval(() => this.$vDexNodeConfigManager.getUserResources(this.identity.accountName), 5000)
      this.getInstallScript()
      this.getReadmeFromRepo()
      // Pass public key
      var re = '\neoskey="KEY"\n'
        var newValue = `\neoskey="${this.identity.publicKey }"\n` // eslint-disable-line
      this.script = this.script.replace(new RegExp(re, 'g'), newValue)
    },
    destroyIntervals () {
      clearInterval(this.m3)
      // TODO: uncomment when feature will be enabled
      // clearInterval(this.m4)
      clearInterval(this.m5)
      clearInterval(this.m6)
      clearInterval(this.m7)
      clearInterval(this.int1)
      clearInterval(this.int2)
      clearInterval(this.int3)

      this.getRegisteredNodesData()
    },
    initEosAPI (privateKey) {
      this.eosApi = new EosAPI(privateKey, process.env[this.$store.state.settings.network].EOS_HISTORYAPI)
    },
    updateNow () {
      this.now = Math.round(new Date().getTime() / 1000)
    },
    getReadmeFromRepo () {
      this.$axios.get('https://raw.githubusercontent.com/Volentix/vdexnode/master/README.md')
        .then((response) => {
          console.log(response)
          this.script = response.data
        })
    },
    updateDailyRewardCountdown () {
      let timeDelta = this.daily_reward_next_calculation > this.now ? this.daily_reward_next_calculation - this.now : 0
      let hours = Math.floor(timeDelta / (60 * 60))
      let minutes = Math.floor((timeDelta - hours * 60 * 60) / 60)
      let seconds = timeDelta - hours * 60 * 60 - minutes * 60

      function timeUnitToStr (unit) {
        return unit < 10 ? '0' + unit : unit.toString()
      }
      this.daily_reward_calculation_countdown = {
        hours: timeUnitToStr(hours),
        minutes: timeUnitToStr(minutes),
        seconds: timeUnitToStr(seconds)
      }
    },
    getInstallScript () {
      // this.script = require('../../assets/install.sh').default // eslint-disable-line global-require
    },
    checkAccountRun () {
      if (this.nodes.length > 0 && !this.nodes.some(item => item.account === this.identity.accountName)) {
        this.$userError(
          "Oops, I can't see your node in the list. Try to update the list or check your node.",
          'Check node running action'
        )
      }
    },
    addToVote (node) {
      if (this.voting_list.includes(node)) {
        var i = this.voting_list.indexOf(node)
        this.voting_list.splice(i, 1)
      } else {
        if (this.voting_list.length !== 21) {
          this.voting_list.push(node)
        } else {
          this.$userError('You can vote for no more than 21 nodes', 'Add to vote action')
        }
      }
    },
    refresh () {
      this.nodes = []
      this.voting_list = []
      this.getInfoRare()
      this.getInfoOften()
      this.getRegisteredNodesData()
      console.log(1)
      // this.$vDexNodeConfigManager.getRewardHistoryData()
    },
    getInfoRare () {
      // this.getListOfNodes()
      this.$vDexNodeConfigManager.getUserRank(this.identity.accountName)
      this.$vDexNodeConfigManager.getRegisteredNodes()
    },
    getInfoOften () {
      this.$vDexNodeConfigManager.getUserBalance(this.identity.accountName)
      this.$vDexNodeConfigManager.getUserVoted(this.identity.accountName)
    },
    getVoteBackList (option) {
      let self = this
      let bank = this.nodes.filter(function (item) {
        return self.identity.voted_for.includes(item.account)
      })

      if (bank.length <= 21) {
        bank.forEach(item => {
          this.addToVote(item)
        })
        bank = []
      } else {
        if (option === 'random') {
          for (let i = 0; i < 21; i++) {
            let rand = Math.random()
            let total = bank.length
            let randIndex = Math.floor(rand * total)
            this.addToVote(bank[randIndex])
            bank.splice(randIndex, 1)
          }
          bank = []
        } else if (option === 'top') {
          bank.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
          let top = bank.slice(0, 21)
          top.forEach(item => {
            this.addToVote(item)
          })
        }
      }
    },
    sortByField (field) {
      this.nodes = this.$utils.sortByKey(this.nodes, field)
    },
    addNode () {
      this.$vDexNodeConfigManager
        .addNode(this.identity.accountName, this.eosApi)
        .then(() => {})
        .catch(error => {
          throw new Error(error)
        })
    },
    registerNode (account = false) {
      console.log(account, '64')
      if (account && account.name !== this.identity.accountName) {
        this.account = account
        this.resetAccount(account.name)
      }

      this.$vDexNodeConfigManager
        .registerNode(this.identity.accountName, this.group, this.eosApi)
        .then(() => {
        //  this.initAccount(this.account)
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    retreiveReward () {
      this.$vDexNodeConfigManager
        .retreiveReward(this.identity.accountName, this.eosApi)
        .then(() => {
          setTimeout(() => this.getInfoOften(), 3000)
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    vote () {
      this.$vDexNodeConfigManager
        .vote(this.voting_list, this.identity.accountName, this.eosApi)
        .then(() => {
          this.voting_list = []
          setTimeout(() => {
            this.getInfoOften()
            this.$vDexNodeConfigManager.getUserRank(this.identity.accountName)
          }, 3000)
        })
        .catch(error => {
          this.$userError(error, 'Get nodes action')
        })
    },
    async getListOfNodes () {
      await this.getNodes()
      const ranks = await rpc.getTable(votingContract, votingContract, 'producers')
      for (var id in this.nodes) {
        this.getNodesData(id, this.nodes[id].key, ranks)
      }
    },
    async getNodes () {
      return new Promise((resolve) => {
        this.$axios
          .get(this.$vDexNodeConfigManager.getEndpoint('nodes_api') + '/getConnectedNodes')
          .then(result => {
            // TODO: Handler if the object is empty of has result: null or result: try later
            // result.data = result.data.concat(result.data).concat(result.data).concat(result.data).concat(result.data).concat(result.data)
            for (var key in result.data) {
              if (result.data[key].includes('EOS')) {
                this.nodes.push({
                  id: key,
                  key: result.data[key].trim(),
                  account: '',
                  balance: '',
                  rank: '',
                  voted_for: false,
                  voted_i: false,
                  vote: true
                })
              }
            }
            this.nodes = this.$utils.getUnique(this.nodes, 'key')
            resolve()
          })
          .catch(error => {
            this.$userError(error, 'Get nodes action')
          })
      })
    },
    async getRegisteredNodesData () {
      const producers = await rpc.getTable(votingContract, votingContract, 'producers')
      this.nodes = []
      producers.map(async (p, index) => {
        let name = p.producer_name
        let node = {}

        if (name) {
          node.id = index
          let balance = await this.$vDexNodeConfigManager.getUserBalance(name, false, 0)
          node.account = name
          node.balance = balance // Math.floor(balance)
          node.vote = this.registered_nodes.includes(name)
          node.voted_for = this.identity.voted_for.includes(name)
          node.voted_i = this.identity.voted_i.includes(name)
          console.log(4)
          let voteStats = producers.find(row => row.owner === name)
          if (voteStats) {
            let rk = []
            producers.forEach(item => {
              let owner = item.owner
              let votes = item.total_votes
              rk.push({
                owner,
                votes
              })
            })
            rk.sort((a, b) => b.votes - a.votes)
            node.rank = rk.map(e => e.owner).indexOf(name) + 1
          } else {
            node.rank = 'unknown'
          }
          console.log(6)
        } else {
          node.account = 'No account found'
          node.balance = 0
          node.vote = false
          node.rank = 'unknown'
        }
        this.nodes.push(node)
      })
    },
    async getNodesData (id, key, ranks) {
      try {
        let accounts = await rpc.getAccounts(key)
        let name = accounts.account_names[0] ? accounts.account_names[0] : ''

        if (name) {
          let balance = this.$vDexNodeConfigManager.getUserBalance(name)
          this.nodes[id].account = name
          this.nodes[id].balance = Math.floor(balance.balance)
          this.nodes[id].vote = this.registered_nodes.includes(name)
          this.nodes[id].voted_for = this.identity.voted_for.includes(name)
          this.nodes[id].voted_i = this.identity.voted_i.includes(name)

          let voteStats = ranks.find(row => row.owner === name)
          if (voteStats) {
            let rk = []
            ranks.forEach(item => {
              let owner = item.owner
              let votes = item.total_votes
              rk.push({
                owner,
                votes
              })
            })
            rk.sort((a, b) => b.votes - a.votes)
            this.nodes[id].rank = rk.map(e => e.owner).indexOf(name) + 1
          } else {
            this.nodes[id].rank = 'unknown'
          }
        } else {
          this.nodes[id].account = 'No account found'
          this.nodes[id].balance = 0
          this.nodes[id].vote = false
          this.nodes[id].rank = 'unknown'
        }
      } catch (error) {
        this.$userError(error, 'Get account name action')
      }
    }
  } // end of methods
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap');
@import url('https://fonts.googleapis.com/css?family=Titillium+Web&display=swap');
@import url('https://unpkg.com/leaflet@1.5.1/dist/leaflet.css');
.vdexNode .q-notifications .block {
    color:white !important ;
}
.vdexNode .bg-vblack {
    background: #000 !important;
}

.vdexNode ::-webkit-scrollbar {
    width: 5px;
}

.vdexNode ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 20px #161616;
    border-radius: 0px;
}

.vdexNode ::-webkit-scrollbar-thumb {
    border-radius: 0px;
    -webkit-box-shadow: inset 0 0 10px #000000;
}

.vdexNode .titilium {
    font-family: 'Titillium Web', sans-serif;
}

.vdexNode .code {
    font-family: 'Source Code Pro', monospace;
}

.vdexNode .blink {
    animation: blinker 1s linear infinite;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
}

.vdexNode .background-gradient {
    background-image: linear-gradient(to bottom right, #00F7A9, #A000FD);
}

.vdexNode .blur {
    opacity: 0.7;
    -webkit-filter: blur(10px) grayscale(90%);
    -moz-filter: blur(10px) grayscale(90%);
    -o-filter: blur(10px) grayscale(90%);
    -ms-filter: blur(10px) grayscale(90%);
    filter: blur(10px) grayscale(90%);
}

.vdexNode .border-right {
    border-right: 1px solid #CECFD0;
}

.vdexNode .bg-vgrey {
    background: #CECFD0;
}

.vdexNode .bg-vpurple {
    background: #A000FD;
}

.vdexNode .bg-vgreen {
    background: #00F7A9;
}

.vdexNode .bg-vdark {
    background: #1F1F1F;
}

.vdexNode .bg-vdarker {
    background: #161616;
}

.vdexNode .bg-vblack {
    background: #000;
}

.vdexNode .bg-vdarkgrey {
    background: #514f4f;
}

.vdexNode .bg-vgold {
    background: #c5c6a6;
}

.vdexNode .bg-vred {
    background: #FF0066;
}

.vdexNode .bg-vseparator {
    background: #333333;
}

.vdexNode .text-vgrey {
    color: #CECFD0;
}

.vdexNode .text-vpurple {
    color: #A000FD !important;
}

.vdexNode .text-vgreen {
    color: #00F7A9 !important;
}

.vdexNode .text-vdark {
    color: #1F1F1F !important;
}

.vdexNode .text-vblack {
    color: #000 !important;
}

.vdexNode .text-vdarkgrey {
    color: #CECFD0 !important;
}

.vdexNode .text-vgold {
    color: #c5c6a6 !important;
}

.vdexNode .text-vseparator {
    color: #3333333 !important;
}

.vdexNode .text-vred {
    color: #FF0066 !important;
}

.vdexNode .pointer-cursor {
    cursor: pointer;
}

.vdexNode .titlebar {
    -webkit-app-region: drag;
    width: 100%;
    height: 20pt;
    background-color: #000;
    top: 0;
    left: 0;
    position: absolute;
}

.vdexNode .q-table thead,
.vdexNode .q-table tr,
.vdexNode .q-table th,
.vdexNode .q-table td {
    border-color: #333333;
}
</style>
