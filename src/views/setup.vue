<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100 my-3 my-lg-4">
    <div class="row no-gutters justify-content-center w-100">
      <div class="col-11 col-md-6">
        <!-- connect broker -->
        <div v-if="currentStep === 0">
          <v-broker @update="next()" class="shadow-sm"></v-broker>
        </div>

        <!-- connect alphainsider -->
        <div v-else-if="currentStep === 1" class="card shadow-sm">
          <v-alphainsider @update="next()" class="shadow-sm"></v-alphainsider>
        </div>

        <!-- select strategy -->
        <div v-else-if="currentStep === 2" class="card shadow-sm">
          <v-strategy-select @update="next()" class="shadow-sm"></v-strategy-select>
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
  mounted() {},
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