<template>
<div>
  <!-- watch query params -->
  <v-query-params v-model="query"></v-query-params>
  
  <!-- page -->
  <div class="container my-3 my-lg-4">
    <!-- control panel -->
    <div class="control-panel d-flex justify-content-center mt-2">
      <div class="d-flex flex-column align-items-center">
        <!-- power button -->
        <button @click="toggleTradingBot()" :class="{'btn-outline-success': ['on', 'rebalancing', 'scheduled_rebalance'].includes(status), 'btn-outline-danger': status === 'off', 'btn-outline-warning': ['closing', 'scheduled_close'].includes(status)}" :disabled="disablePowerButton" type="button" class="btn power-btn">
          <i class="fas fa-power-off"></i>
        </button>
        <!-- bot status -->
        <h3 class="mt-2 mb-0">
          <span :class="{'text-success': ['on', 'rebalancing', 'scheduled_rebalance'].includes(status), 'text-danger': status === 'off', 'text-warning': ['closing', 'scheduled_close'].includes(status)}" class="text-uppercase">{{ $_.replace(status, '_', ' ') }}</span>
        </h3>
        <!-- setup redirect -->
        <p v-if="disablePowerButton" class="mb-0">Please finish <router-link to="/setup">setting up the bot</router-link> before running.</p>
        <p v-else-if="status === 'on'" class="mb-0">Watching for strategy changes.</p>
        <p v-else-if="status === 'rebalancing'" class="mb-0">Adjusting positions to match your strategy.</p>
        <p v-else-if="status === 'scheduled_rebalance'" class="mb-0">Waiting for the market to open to rebalance positions.</p>
        <p v-else-if="status === 'closing'" class="mb-0">Closing all positions.</p>
        <p v-else-if="status === 'scheduled_close'" class="mb-0">Waiting for the market to open to close all positions.</p>
        <p v-else-if="status === 'off'" class="mb-0">Not activity trading or monitoring.</p>
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
  <v-risk-modal v-if="showRiskModal" @close="showRiskModal = false" @confirmed="startBot()"></v-risk-modal>
</div>
</template>


<script>
import InfiniteLoading from 'vue-infinite-loading';
import vActivity from '@/components/v-activity.vue';
import vRiskModal from "@/components/v-risk-modal.vue";
import vQueryParams from '@/components/v-query-params.vue';
import vDropdownMenu from '@/components/v-dropdown-menu.vue';

export default {
  components: {InfiniteLoading, vActivity, vRiskModal, vQueryParams, vDropdownMenu},
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
  computed: {
    status() {
      //status: on, rebalancing, scheduled_rebalance, closing, scheduled_close, off
      return this.$store.state.bot.status || 'off';
    },
    disablePowerButton() {
      return !this.$store.state.bot.alphainsider || !this.$store.state.broker || this.$store.state.allocation.length <= 0;
    }
  },
  mounted() {
    this.$store.dispatch('getBotInfo');
    this.$store.dispatch('getAllocation');
  },
  methods: {
    startBot() {
      this.showRiskModal = false;
      this.$store.dispatch('startBot');
    },
    stopBot() {
      this.$store.dispatch('stopBot');
    },
    toggleTradingBot() {
      // show confirmation modal
      if(['off', 'closing'].includes(this.status)) this.showRiskModal = true;
      // stop bot
      else this.stopBot();
    },
    getActivity($state) {
      //get activity type filter
      let type = [];
      if(this.query.a_filter.value === 'info') type = ['info'];
      else if(this.query.a_filter.value === 'warning') type = ['warning'];
      else if(this.query.a_filter.value === 'error') type = ['error'];
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