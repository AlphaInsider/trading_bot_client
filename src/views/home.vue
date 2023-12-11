<template>
<div class="container my-3 my-lg-4">
  <!-- control panel -->
  <div class="control-panel d-flex justify-content-center mt-2">
    <!-- power button -->
    <div class="d-flex flex-column align-items-center">
      <button @click="toggleTradingBot()" :class="{'btn-outline-success': powerButtonState === 'active', 'btn-outline-warning': powerButtonState === 'paused', 'btn-outline-danger': powerButtonState === 'error'}" type="button" class="btn power-btn">
        <i class="fas fa-power-off"></i>
      </button>
      <h3 class="mt-2 mb-0">
        Trading Bot: <span :class="{'text-success': powerButtonState === 'active', 'text-warning': powerButtonState === 'paused', 'text-danger': powerButtonState === 'error'}" class="text-capitalize">{{ powerButtonState }}</span>
      </h3>
    </div>
  </div>
  
  <!-- activity list -->
  <h3 class="text-primary mt-3 mb-0">Recent Activity</h3>
  <div v-for="activity in activities" :key="activity.activity_id" class="row">
    <div class="col-12 mt-2">
      <v-activity :activity="activity"></v-activity>
    </div>
  </div>
  
  <v-confirm-start-modal v-if="showConfirmStartModal" @close="showConfirmStartModal = false" @confirmed="startBot()"></v-confirm-start-modal>
</div>
</template>


<script>
import vActivity from '@/components/v-activity.vue';
import vConfirmStartModal from "@/components/v-confirm-start-modal.vue";

export default {
  components: {vActivity, vConfirmStartModal},
  data() {
    return {
      // control panel
      powerButtonState: 'error',
      // activity
      activities: [{activity_id: '1', type: 'warning', details: 'Basic details about the event.'}],
      // modal
      showConfirmStartModal: false
    }
  },
  mounted() {
    //this.getBotInfo();
  },
  methods: {
    getBotInfo() {
      //request getBotInfo
      return this.$store.dispatch('request', {
        type: 'get',
        auth: true,
        url: 'getBotInfo'
      })
      //success
      .then((data) => {
        
      })
      //error
      .catch((error) => {
        toastr.error('Failed to get bot information.');
      });
    },
    startBot() {
      this.showConfirmStartModal = false;
      this.powerButtonState = 'active';
    },
    stopBot() {
      this.powerButtonState = 'paused';
    },
    toggleTradingBot() {
      // set to active
      if(this.powerButtonState !== 'active') this.showConfirmStartModal = true;
      // set to paused
      else this.stopBot();
    }
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