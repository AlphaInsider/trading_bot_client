<template>
<div>
  <!-- watch query params -->
  <v-query-params v-model="query"></v-query-params>
  
  <!-- watch websockets -->
  <v-websocket :channels="['wsActivity']" @message="[$event.type, ''].includes(query.a_filter.value) && (activity=[$event].concat(activity))"></v-websocket>
  <v-websocket :channels="['wsStatus']" @message="$store.dispatch('setBotStatus', {status: $event})"></v-websocket>
  
  <!-- page -->
  <div class="container my-3 my-lg-4">
    <!-- control panel -->
    <div class="control-panel d-flex justify-content-center mt-2">
      <!-- on -->
      <div v-if="$store.state.bot.status === 'on'" class="d-flex flex-column align-items-center">
        <button @click="$store.dispatch('stopBot')" type="button" class="btn power-btn btn-outline-success"><i class="fas fa-power-off"></i></button>
        <h3 class="mt-2 mb-0">
          <span class="text-uppercase text-success">On</span>
        </h3>
        <p class="mb-0">Watching for strategy changes.</p>
      </div>
      <!-- rebalancing -->
      <div v-else-if="$store.state.bot.status === 'rebalancing'" class="d-flex flex-column align-items-center">
        <button @click="$store.dispatch('stopBot')" type="button" class="btn power-btn btn-outline-success"><i class="fas fa-power-off"></i></button>
        <h3 class="mt-2 mb-0">
          <span class="text-uppercase text-success">Rebalancing</span>
        </h3>
        <p class="mb-0">Adjusting positions to match your strategy.</p>
      </div>
      <!-- scheduled_rebalance -->
      <div v-else-if="$store.state.bot.status === 'scheduled_rebalance'" class="d-flex flex-column align-items-center">
        <button @click="$store.dispatch('stopBot')" type="button" class="btn power-btn btn-outline-success"><i class="fas fa-power-off"></i></button>
        <h3 class="mt-2 mb-0">
          <span class="text-uppercase text-success">Scheduled Rebalance</span>
        </h3>
        <p class="mb-0">Rebalancing positions at the next viable time.</p>
      </div>
      <!-- closing -->
      <div v-else-if="$store.state.bot.status === 'closing'" class="d-flex flex-column align-items-center">
        <button @click="$store.dispatch('stopBot')" type="button" class="btn power-btn btn-outline-warning"><i class="fas fa-power-off"></i></button>
        <h3 class="mt-2 mb-0">
          <span class="text-uppercase text-warning">Closing</span>
        </h3>
        <p class="mb-0">Closing all positions.</p>
      </div>
      <!-- scheduled_close -->
      <div v-else-if="$store.state.bot.status === 'scheduled_close'" class="d-flex flex-column align-items-center">
        <button @click="$store.dispatch('stopBot')" type="button" class="btn power-btn btn-outline-warning"><i class="fas fa-power-off"></i></button>
        <h3 class="mt-2 mb-0">
          <span class="text-uppercase text-warning">Scheduled Close</span>
        </h3>
        <p class="mb-0">Closing positions at the next viable time.</p>
      </div>
      <!-- setup -->
      <div v-else-if="!$store.state.bot.alphainsider || !$store.state.bot.broker || $store.state.allocation.length <= 0" class="d-flex flex-column align-items-center">
        <button :disabled="true" type="button" class="btn power-btn btn-outline-secondary"><i class="fas fa-power-off"></i></button>
        <h3 class="mt-2 mb-0">
          <span class="text-uppercase text-secondary">Setup Required</span>
        </h3>
        <p class="mb-0">Please finish <router-link to="/setup">setting up the bot</router-link> before running.</p>
      </div>
      <!-- invalid account type -->
      <div v-else-if="!['reg_t', 'portfolio'].includes($store.state.bot.broker.margin_type)" class="d-flex flex-column align-items-center">
        <button :disabled="true" type="button" class="btn power-btn btn-outline-secondary"><i class="fas fa-power-off"></i></button>
        <h3 class="mt-2 mb-0">
          <span class="text-uppercase text-secondary">Margin Required</span>
        </h3>
        <p class="mb-0">Your brokerage account must have Reg T or Portfolio margin enabled.</p>
      </div>
      <!-- insufficient funds -->
      <div v-else-if="$math.evaluate('a < b', {a: $store.state.bot.broker.value, b: ($store.state.bot.broker.asset_class === 'stock' ? '25000' : '100')})" class="d-flex flex-column align-items-center">
        <button :disabled="true" type="button" class="btn power-btn btn-outline-secondary"><i class="fas fa-power-off"></i></button>
        <h3 class="mt-2 mb-0">
          <span class="text-uppercase text-secondary">Insufficient Funds</span>
        </h3>
        <p v-if="$store.state.bot.broker.asset_class === 'stock'" class="mb-0">Broker must maintain at least $25,000 due to <a href="https://www.investopedia.com/terms/p/patterndaytrader.asp" target="_blank">PDT</a> rules.</p>
        <p v-else class="mb-0">Broker must maintain at least $100 to run trading bot.</p>
      </div>
      <!-- off -->
      <div v-else-if="$store.state.bot.status === 'off'" class="d-flex flex-column align-items-center">
        <button @click="showRiskModal = true" type="button" class="btn power-btn btn-outline-danger"><i class="fas fa-power-off"></i></button>
        <h3 class="mt-2 mb-0">
          <span class="text-uppercase text-danger">Off</span>
        </h3>
        <p class="mb-0">Not activity trading or monitoring.</p>
      </div>
    </div>
    
    <!-- RegT alert-->
    <div class="d-flex justify-content-center">
      <div v-if="$store.state.bot.broker && $store.state.bot.broker.margin_type === 'reg_t'" class="alert alert-info my-2" role="alert">
        <i class="fas fa-info-circle"></i> Expect 40% of strategy's performance due to your account using Reg T margin while AlphaInsider uses Portfolio margin.
      </div>
    </div>
    
    <!-- activity list -->
    <div class="d-flex align-items-baseline">
      <h3 class="text-primary mt-3 mb-0">Recent Activity</h3>
      <!-- filter -->
      <div class="ml-auto">
        <div class="filter-dropdown dropdown px-2 py-1">
          <h6 @click="showActivityFilterDropdown = !showActivityFilterDropdown" class="text-primary text-capitalize text-nowrap pointer m-0">
            {{ ((query.a_filter.value === 'info') ? 'Info' : (query.a_filter.value === 'warning') ? 'Warning' : (query.a_filter.value === 'error') ? 'Error' : 'All') }} <i class="fas fa-caret-down"></i>
          </h6>
          <v-dropdown-menu v-if="showActivityFilterDropdown" :arrow="true" @close="showActivityFilterDropdown = false">
            <button @click="query.a_filter.value = ''" :class="{'active': query.a_filter.value === ''}" class="dropdown-item">
              <i class="fal fa-layer-group text-muted"></i>
              All
            </button>
            <button @click="query.a_filter.value = 'info'" :class="{'active': query.a_filter.value === 'info'}" class="dropdown-item">
              <i class="fal fa-info text-muted"></i>
              Info
            </button>
            <button @click="query.a_filter.value = 'warning'" :class="{'active': query.a_filter.value === 'warning'}" class="dropdown-item">
              <i class="fal fa-bug text-muted"></i>
              Warning
            </button>
            <button @click="query.a_filter.value = 'error'" :class="{'active': query.a_filter.value === 'error'}" class="dropdown-item">
              <i class="fal fa-exclamation-triangle text-muted"></i>
              Error
            </button>
          </v-dropdown-menu>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column">
      <!-- Timelines -->
      <transition-group v-if="activity.length > 0" enter-active-class="animate__animated animate__fadeIn animate__faster" mode="out-in">
        <div v-for="(event, index) in activity" :key="event.activity_id">
          <v-activity :activity="event" class="mt-2"></v-activity>
        </div>
      </transition-group>
      <!-- infinite loading -->
      <infinite-loading :identifier="$route.fullPath" spinner="waveDots" @infinite="getActivity($event)" @$InfiniteLoading:reset="activity = []">
        <!-- no results -->
        <div slot="no-results">
          <div class="d-flex-column text-center my-5">
            <h3 class="text-muted">No results found</h3>
          </div>
        </div>
        <!-- error -->
        <div slot="error">
          <div class="d-flex-column text-center my-5">
            <h3 class="text-muted">An error has occurred</h3>
          </div>
        </div>
        <!-- no more results -->
        <div slot="no-more"></div>
      </infinite-loading>
    </div>
  </div>
  
  <!-- modals -->
  <v-risk-modal v-if="showRiskModal" @close="showRiskModal = false" @confirmed="showRiskModal = false, $store.dispatch('startBot')"></v-risk-modal>
</div>
</template>


<script>
import InfiniteLoading from 'vue-infinite-loading';
import vActivity from '@/components/v-activity.vue';
import vRiskModal from '@/components/v-risk-modal.vue';
import vQueryParams from '@/components/v-query-params.vue';
import vDropdownMenu from '@/components/v-dropdown-menu.vue';
import vWebsocket from '@/components/v-websocket.vue';

export default {
  components: {InfiniteLoading, vActivity, vRiskModal, vQueryParams, vDropdownMenu, vWebsocket},
  data() {
    return {
      //query params
      query: {
        a_filter: {value: '', default: '', valid: ['', 'info', 'warning', 'error']}
      },
      // activity
      activity: [],
      activityLimit: 10,
      // show
      showActivityFilterDropdown: false,
      showRiskModal: false
    }
  },
  async mounted() {
    await this.$store.dispatch('getBotInfo');
    await this.$store.dispatch('getAllocation');
  },
  methods: {
    getActivity($state) {
      //get activity type filter
      let type = [];
      if(['info', 'warning', 'error'].includes(this.query.a_filter.value)) type = [this.query.a_filter.value];
      //request getActivity
      return this.$store.dispatch('request', {
        type: 'get',
        auth: true,
        url: 'getActivity',
        query: {
          type: type,
          limit: this.activityLimit,
          offset_id: (this.activity.length > 0 ? _.last(this.activity).activity_id : undefined)
        }
      })
      //success, set timelines
      .then((data) => {
        this.activity = _.unionBy(this.activity, data, 'activity_id');
        ((data.length > 0) ? $state.loaded() : $state.complete())
      })
      //error
      .catch((error) => {
        toastr.error('Failed to get activity.');
        $state.complete();
      });
    },
  }
}
</script>


<style lang="scss" scoped>
.control-panel {
  .power-btn {
    border-radius: 50%;
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 6em;
    border-width: 3px;
    &:not(:disabled):hover {
      color: white;
    }
  }
}
</style>