<template>
<div class="container">
  <!-- timeline -->
  <div class="timeline row no-gutters pt-3 mt-5">
    <!-- connect AlphaInsider -->
    <div :class="((currentStep === 0) ? 'current' : completedSteps.includes(0) ? 'complete' : 'pending')" class="col text-center">
      <div class="row no-gutters mb-n3">
        <div class="line col z-index-n1 bg-light"></div>
        <div :class="{'bg-success': completedSteps.includes(0)}" class="line col z-index-n1"></div>
      </div>
      <h4 class="mb-1"><i :class="((currentStep === 0) ? 'far fa-dot-circle' : completedSteps.includes(0) ? 'fas fa-check-circle' : 'far fa-circle')" class="bg-light px-2"></i></h4>
      <p class="m-0">Connect AlphaInsider</p>
      <small class="text-muted">5 minutes</small>
    </div>
    <!-- connect broker -->
    <div :class="((currentStep === 1) ? 'current' : completedSteps.includes(1) ? 'complete' : 'pending')" class="col text-center">
      <div class="row no-gutters mb-n3">
        <div :class="{'bg-success': completedSteps.includes(0)}" class="line col z-index-n1"></div>
        <div :class="{'bg-success': completedSteps.includes(1)}" class="line col z-index-n1"></div>
      </div>
      <h4 class="mb-1"><i :class="((currentStep === 1) ? 'far fa-dot-circle' : completedSteps.includes(1) ? 'fas fa-check-circle' : 'far fa-circle')" class="bg-light px-2"></i></h4>
      <p class="m-0">Connect Broker</p>
      <small class="text-muted">5 minutes</small>
    </div>
    <!-- select strategy -->
    <div :class="((currentStep === 2) ? 'current' : completedSteps.includes(2) ? 'complete' : 'pending')" class="col text-center">
      <div class="row no-gutters mb-n3">
        <div :class="{'bg-success': completedSteps.includes(1)}" class="line col z-index-n1"></div>
        <div :class="{'bg-success': completedSteps.includes(2)}" class="line col z-index-n1"></div>
      </div>
      <h4 class="mb-1"><i :class="((currentStep === 2) ? 'far fa-dot-circle' : completedSteps.includes(2) ? 'fas fa-check-circle' : 'far fa-circle')" class="bg-light px-2"></i></h4>
      <p class="m-0">Select Strategy</p>
      <small class="text-muted">1 minute</small>
    </div>
    <!-- complete -->
    <div :class="((currentStep === 3) ? 'current' : completedSteps.includes(3) ? 'complete' : 'pending')" class="col text-center">
      <div class="row no-gutters mb-n3">
        <div :class="{'bg-success': completedSteps.includes(2)}" class="line col z-index-n1"></div>
        <div class="line col z-index-n1 bg-light"></div>
      </div>
      <h4 class="mb-1"><i :class="((currentStep === 3) ? 'far fa-dot-circle' : completedSteps.includes(3) ? 'fas fa-check-circle' : 'far fa-circle')" class="bg-light px-2"></i></h4>
      <p class="m-0">Complete</p>
      <small class="text-muted">1 minute</small>
    </div>
  </div>
  
  <!-- loading -->
  <div v-if="$_.isEmpty($store.state.bot)" class="d-flex flex-column align-items-center">
    <h2>Loading...</h2>
  </div>
  
  <!-- connect AlphaInsider -->
  <div v-else-if="currentStep === 0">
    <!-- title -->
    <div class="row no-gutters my-4">
      <div class="col-3 col-sm-2 d-flex align-items-center justify-content-start"></div>
      <div class="col text-center">
        <h2 class="m-0">Connect AlphaInsider</h2>
      </div>
      <div class="col-3 col-sm-2 d-flex align-items-center justify-content-end">
        <button v-if="completedSteps.includes(currentStep)" @click="currentStep++" type="button" class="btn btn-light border text-nowrap">Next <i class="fas fa-long-arrow-right"></i></button>
      </div>
    </div>
    <!-- setup -->
    <div class="row">
      <!-- inputs -->
      <div class="col-12 col-lg-5 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="m-0">Enter your AlphaInsider API key</h5>
            <small class="text-muted">This will give AlphaBot access to AlphaInsider resources.</small>
            <v-setup-alphainsider @update="loadBot()"></v-setup-alphainsider>
          </div>
        </div>
      </div>
      <!-- guide -->
      <div class="col-12 col-lg-7 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="m-0">How To Guide</h5>
            <small class="text-muted">This guide will show you how to get your AlphaInsider API key.</small>
            <v-setup-alphainsider-guide></v-setup-alphainsider-guide>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- connect broker -->
  <div v-else-if="currentStep === 1">
    <!-- title -->
    <div class="row no-gutters my-4">
      <div class="col-3 col-sm-2 d-flex align-items-center justify-content-start">
        <button v-if="completedSteps.includes(currentStep-1)" @click="currentStep--" type="button" class="btn btn-light border text-nowrap"><i class="fas fa-long-arrow-left"></i> Back</button>
      </div>
      <div class="col text-center">
        <h2 class="m-0">Connect Broker</h2>
      </div>
      <div class="col-3 col-sm-2 d-flex align-items-center justify-content-end">
        <button v-if="completedSteps.includes(currentStep)" @click="currentStep++" type="button" class="btn btn-light border text-nowrap">Next <i class="fas fa-long-arrow-right"></i></button>
      </div>
    </div>
    <!-- setup -->
    <div class="row">
      <!-- inputs -->
      <div class="col-12 col-lg-5 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="m-0">Enter your broker details</h5>
            <small class="text-muted">This will give AlphaBot access to your broker.</small>
            <v-setup-broker @update="loadBot()"></v-setup-broker>
          </div>
        </div>
      </div>
      <!-- guide -->
      <div class="col-12 col-lg-7 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="m-0">How To Guide</h5>
            <small class="text-muted">This guide will show you how to get your broker details.</small>
            <v-setup-broker-guide></v-setup-broker-guide>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- select strategy -->
  <div v-else-if="currentStep === 2">
    <!-- title -->
    <div class="row no-gutters my-4">
      <div class="col-3 col-sm-2 d-flex align-items-center justify-content-start">
        <button v-if="completedSteps.includes(currentStep-1)" @click="currentStep--" type="button" class="btn btn-light border text-nowrap"><i class="fas fa-long-arrow-left"></i> Back</button>
      </div>
      <div class="col text-center">
        <h2 class="m-0">Select Strategy</h2>
      </div>
      <div class="col-3 col-sm-2 d-flex align-items-center justify-content-end">
        <button v-if="completedSteps.includes(currentStep)" @click="currentStep++" type="button" class="btn btn-light border text-nowrap">Next <i class="fas fa-long-arrow-right"></i></button>
      </div>
    </div>
    <!-- setup -->
    <div class="row">
      <!-- inputs -->
      <div class="col-12 col-lg-5 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="m-0">Select a {{ $store.state.bot.broker.allocation_type }} strategy</h5>
            <small class="text-muted">Select a {{ $store.state.bot.broker.allocation_type }} strategy for AlphaBot to follow.</small>
            <v-setup-strategy @update="loadBot()"></v-setup-strategy>
          </div>
        </div>
      </div>
      <!-- guide -->
      <div class="col-12 col-lg-7 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="m-0">How To Guide</h5>
            <small class="text-muted">This guide will show you how to select a strategy.</small>
            <v-setup-strategy-guide></v-setup-strategy-guide>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- complete -->
  <div v-else>
    <!-- title -->
    <div class="row no-gutters my-4">
      <div class="col-3 col-sm-2 d-flex align-items-center justify-content-start">
        <button v-if="completedSteps.includes(currentStep-1)" @click="currentStep--" type="button" class="btn btn-light border text-nowrap"><i class="fas fa-long-arrow-left"></i> Back</button>
      </div>
      <div class="col text-center">
        <h2 class="m-0">Complete</h2>
      </div>
      <div class="col-3 col-sm-2 d-flex align-items-center justify-content-end"></div>
    </div>
    <!-- setup -->
    <div class="row justify-content-center">
      <!-- inputs -->
      <div class="col-12 col-lg-6">
        <div class="card py-3">
          <div class="card-body text-center">
            <h3>You're all set!</h3>
            <small>
              Click "Finish" to redirect to the dashboard. <br>
              From there you'll be able to turn AlphaBot on.
            </small>
            <router-link to="/" class="btn btn-block btn-primary mt-3" replace>Finish</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import vSetupAlphainsider from '@/components/v-setup-alphainsider.vue';
import vSetupAlphainsiderGuide from '@/components/v-setup-alphainsider-guide.vue';
import vSetupBroker from '@/components/v-setup-broker.vue';
import vSetupBrokerGuide from '@/components/v-setup-broker-guide.vue';
import vSetupStrategy from '@/components/v-setup-strategy.vue';
import vSetupStrategyGuide from '@/components/v-setup-strategy-guide.vue';

export default {
  components: {vSetupAlphainsider, vSetupAlphainsiderGuide, vSetupBroker, vSetupBrokerGuide, vSetupStrategy, vSetupStrategyGuide},
  data() {
    return {
      currentStep: 0
    }
  },
  computed: {
    completedSteps() {
      return [
        ...((this.$store.state.bot?.alphainsider) ? [0] : []),
        ...((this.$store.state.bot?.broker) ? [1] : []),
        ...((this.$store.state.allocation.length > 0) ? [2, 3] : [])
      ];
    }
  },
  async mounted() {
    //load bot info
    await this.loadBot();
    //go to most recent step
    let stepRedirect = Math.min((_.last(this.completedSteps) ?? -1) + 1, 3);
    //redirect to step if step query passed
    if(this.$route.query.step !== undefined) {
      if(['0', '1', '2', '3'].includes(this.$route.query.step+'')) {
        stepRedirect = Math.min(Number(this.$route.query.step+''), stepRedirect);
      }
      this.$router.replace({query: {...this.$route.query, step: undefined}});
    }
    //redirect to step
    this.currentStep = stepRedirect;
  },
  methods: {
    async loadBot() {
      await this.$store.dispatch('getBotInfo');
      await this.$store.dispatch('getAllocation');
    }
  }
}
</script>

<style lang="scss" scoped>
//timeline styles
.timeline {
  //line colors
  .line {
    padding-top: 0.2rem;
    background: rgb(var(--secondary-rgb), 0.50);
  }
  //text colors
  color: rgb(var(--secondary-rgb), 0.75);
  .current {
    color: var(--primary);
  }
  .complete {
    color: var(--success);
  }
}
</style>