<template>
<div class="container my-3 my-lg-4">
  <!-- control panel -->
  <h3 class="text-primary mb-0">Control Panel </h3>
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
  <div v-for="activity in activities" :key="activity.activity_id" class="row mt-2">
    <div class="col-12">
      <v-activity :activity="activity"></v-activity>
    </div>
  </div>
</div>
</template>


<script>
import vActivity from '@/components/v-activity.vue';

export default {
  components: {vActivity},
  data() {
    return {
      // control panel
      powerButtonState: 'error',
      // activity
      activities: [{activity_id: '1'}]
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
    toggleTradingBot() {
      if(this.powerButtonState !== 'active') this.powerButtonState = 'active';
      else this.powerButtonState = 'paused';
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