<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100 my-3 my-lg-4">
    <div class="row no-gutters justify-content-center w-100">
      <div class="col-11 col-md-6">
        <!-- connect broker -->
        <div v-if="currentStep === 0" class="card shadow-sm">
          <div class="card">
            <!-- title -->
            <div class="card-header bg-white d-flex align-items-center p-3">
              <h5 class="text-primary mb-0">Connect Brokerage</h5>
            </div>
            <!-- body -->
            <div class="card-body p-3">
              <v-broker @update="next()"></v-broker>
            </div>
          </div>
        </div>

        <!-- connect alphainsider -->
        <div v-else-if="currentStep === 1" class="card shadow-sm">
          <div class="card">
            <!-- title -->
            <div class="card-header bg-white d-flex align-items-center p-3">
              <h5 class="text-primary mb-0">Connect AlphaInsider</h5>
            </div>
            <!-- body -->
            <div class="card-body p-3">
              <v-alphainsider @update="next()"></v-alphainsider>
            </div>
          </div>
        </div>

        <!-- select strategy -->
        <div v-else-if="currentStep === 2" class="card shadow-sm">
          <div class="card">
            <!-- title -->
            <div class="card-header bg-white d-flex align-items-center p-3">
              <h5 class="text-primary mb-0">Strategy Select</h5>
            </div>
            <!-- body -->
            <div class="card-body p-3">
              <v-strategy-select @update="next()"></v-strategy-select>
            </div>
          </div>
        </div>

        <!-- finish -->
        <div v-else-if="currentStep === 3" class="card card-finished shadow-sm">
          <div class="card-body d-flex align-items-center justify-content-center">
            <div class="row justify-content-center w-100">
              <div class="col-12 col-lg-8 text-center">
                <h1>You're all set!</h1>
                <router-link to="/" class="btn btn-primary btn-block">Finish</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vBroker from '@/components/v-broker.vue';
import vAlphainsider from '@/components/v-alphainsider.vue';
import vStrategySelect from '@/components/v-strategy-select.vue';

export default {
  components: {vBroker, vAlphainsider, vStrategySelect},
  data() {
    return {
      currentStep: 2
    };
  },
  computed: {
    currentStep() {
      if(!this.$store.getters.broker) return 0;
      else if(!this.$store.getters.alphainsider) return 1;
      else if(!this.$store.state.)
    }
  },
  mounted() {
    this.$store.dispatch('getBotInfo');
    
  },
  methods: {
    back() {
      this.currentStep = (this.currentStep > 0 ? this.currentStep-1 : this.currentStep);
    },
    next() {
      this.currentStep = this.currentStep+1;
    },
    updateStrategy() {
      this.next();
    }
  }
}
</script>

<style lang="scss" scoped>
.card-finished {
  height: 275px;
}
</style>