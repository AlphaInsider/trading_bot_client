<template>
<div class="container my-3 my-lg-4">
  <!-- watch websockets -->
  <v-websocket :channels="['wsActivity']" @message="[$event.type, ''].includes(query.a_filter.value) && (activity=[$event].concat(activity))"></v-websocket>
  <v-websocket :channels="['wsStatus']" @message="$store.dispatch('setBotStatus', {status: $event})"></v-websocket>
  
  <!-- control panel -->
  <div class="control-panel d-flex justify-content-center mt-2">
    <!-- power button -->
    <div class="d-flex flex-column align-items-center">
      <button @click="toggleTradingBot()" :class="{'btn-outline-success': ['on', 'rebalancing'].includes(status), 'btn-outline-danger': status === 'off', 'btn-outline-warning': status === 'closing'}" type="button" class="btn power-btn">
        <i class="fas fa-power-off"></i>
      </button>
      <h3 class="mt-2 mb-0">
        Trading Bot: <span :class="{'text-success': ['on', 'rebalancing'].includes(status), 'text-danger': status === 'off', 'text-warning': status === 'closing'}" class="text-capitalize">{{ status }}</span>
      </h3>
    </div>
  </div>
  
  <!-- activity list -->
  <h3 class="text-primary mt-3 mb-0">Recent Activity</h3>
  <div class="d-flex flex-column">
    <!-- Timelines -->
    <transition-group v-if="activity.length > 0" enter-active-class="animate__animated animate__fadeIn animate__faster" mode="out-in">
      <div v-for="(event, index) in activity" :key="event.activity_id">
        <v-activity :activity="event" class="mt-2"></v-activity>
      </div>
    </transition-group>
    <!-- infinite loading -->
    <infinite-loading :identifier="'activity-list'" spinner="waveDots" @infinite="getActivity($event)" @$InfiniteLoading:reset="activity = []">
      <!-- loading -->
      <!-- no results, no more results, error -->
      <div v-for="(name, index) in ['no-results', 'no-more', 'error']" :key="index" :slot="name">
        <div class="d-flex w-100 justify-content-center mt-2">
          <div class="card">
            <div class="card-body">
              <h5 class="text-muted mb-0">Created {{ $moment($store.state.bot.created_at).format('MMMM DD, YYYY [at] h:mma') }}</h5>
            </div>
          </div>
        </div>
      </div>
    </infinite-loading>
  </div>
  
  <!-- modals -->
  <v-risk-modal v-if="showRiskModal" @close="showRiskModal = false" @confirmed="startBot()"></v-risk-modal>
</div>
</template>


<script>
import InfiniteLoading from 'vue-infinite-loading';
import vActivity from '@/components/v-activity.vue';
import vRiskModal from '@/components/v-risk-modal.vue';
import vWebsocket from '@/components/v-websocket.vue';

export default {
  components: {InfiniteLoading, vActivity, vRiskModal, vWebsocket},
  data() {
    return {
      // activity
      activity: [],
      activityLimit: 10,
      // modal
      showRiskModal: false
    }
  },
  computed: {
    status() {
      return this.$store.state.bot.status || 'off';
    }
  },
  mounted() {
    this.$store.dispatch('getBotInfo');
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
      //request getActivity
      return this.$store.dispatch('request', {
        type: 'get',
        auth: true,
        url: 'getActivity',
        query: {
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
    &:hover {
      color: white;
    }
  }
}
</style>