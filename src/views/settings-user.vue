<template>
<div>
  <!-- account tier -->
  <div :class="(($store.getters.accountTier === 'premium') ? 'border-info img-head-premium' : ($store.getters.accountTier === 'pro') ? 'border-success img-head-pro' : 'border-warning img-head-standard')" class="card mb-3">
    <div class="card-body">
      <div class="row">
        <!-- account tier -->
        <div class="col col-md-8 text-white">
          <label>Account Tier</label>
          <h1 class="text-capitalize m-0">{{ $store.getters.accountTier }}</h1>
        </div>
        <!-- view plans -->
        <div class="col align-self-center">
          <a href="https://alphainsider.com/account-pricing" target="_blank" :class="(($store.getters.accountTier === 'premium') ? 'text-info' : ($store.getters.accountTier === 'pro') ? 'text-success' : 'text-warning') + ' ' + ((!$store.getters.isMobileView) ? 'btn-lg' : '')" class="btn btn-light bg-light btn-block">View Plans</a>
        </div>
      </div>
    </div>
  </div>
  
  <!-- change password -->
  <div v-if="!$store.getters.isElectron" class="card">
    <!-- title -->
    <div class="d-flex card-header bg-white">
      <h5 class="text-primary mb-0">Change Password</h5>
    </div>
    <!-- body -->
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div>
          <p class="mb-0">Password Guide</p>
          <small class="text-muted">Follow this guide to change your password.</small>
        </div>
        <div class="ml-auto">
          <router-link :to="'/password-tutorial'" class="btn btn-outline-primary">Guide</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>


<script>
export default {
  mounted() {
    this.$store.dispatch('getBotInfo');
  }
}
</script>