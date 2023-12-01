<template>
<div v-if="$route.name">
  <!-- mobile header -->
  <div v-if="$store.getters.isMobileView" class="mobile-header bg-white border-bottom fixed-top phone-padding-top">
    <!-- signed in -->
    <div class="d-flex justify-content-center align-items-center px-3 py-2">
      <!-- back button -->
      <div v-if="$route.name !== 'home' && ![true, 'true'].includes($route.query.hidebb)" class="mr-auto">
        <h3 @click="back()" class="pointer m-0">
          <i class="fas fa-arrow-left"></i>
        </h3>
      </div>

      <!-- page title -->
      <div class="position-absolute">
        <div v-if="['home'].includes($route.name)">
          <router-link to="/" class="disable-highlighting">
            <v-logo></v-logo>
          </router-link>
        </div>
        <h3 v-else-if="$route.path.startsWith('/settings') && $route.path.endsWith('/alphainsider')" class="text-capitalize mb-0">AlphaInsider</h3>
        <h3 v-else-if="$route.path.startsWith('/settings')" class="text-capitalize mb-0">{{ $route.name.replace('settings_', '').replaceAll('_', ' ') }}</h3>
        <h3 v-else class="text-capitalize mb-0">{{ $route.name.replaceAll('_', ' ') }}</h3>
      </div>
    </div>
  </div>
  
  <!-- desktop header -->
  <nav v-else class="navbar d-flex justify-content-between justify-content-start bg-white border-bottom px-4 pb-2">
    <!-- logo -->
    <div class="d-flex align-items-center">
      <router-link to="/" class="disable-highlighting">
        <v-logo></v-logo>
      </router-link>
    </div>
    
    <!-- signed in -->
    <div v-if="$store.getters.isLoggedIn" class="d-flex align-items-center">
      <!-- header bar -->
      <div class="header-links disable-highlighting mr-3">
        <!-- home page -->
        <router-link to="/" exact-active-class="active" class="p-2">Home</router-link>
        <!-- settings page -->
        <router-link to="/settings" active-class="active" class="p-2">Settings</router-link>
      </div>
      <!-- sign out -->
      <button type="button" class="btn btn-outline-primary px-4" @click="$store.dispatch('logout')">Sign Out</button>
    </div>
  </nav>
</div>
</template>


<script>
import vLogo from '@/components/v-logo.vue';

export default {
  components: {vLogo},
  methods: {
    back() {
      let currRoute = this.$route;
      this.$router.back();
      // used for when openAppURL redirect user to page with no history.
      setTimeout(() => {
        if(this.$route.fullPath === currRoute.fullPath) this.$router.replace('/');
      }, 100);
    }
  }
}
</script>


<style lang="scss" scoped>
//mobile header
.mobile-header {
  z-index: 1000; //set z-index above search bar
  & > :first-child {
    height: var(--phone-header-height);
  }
}
//navigation link colors
.header-links a {
  color: var(--dark);
  outline: none;
  cursor: pointer;
  &:hover:not(.active):not(.btn-outline-light) {
    filter: brightness(30%);
  }
  &.active {
    font-weight: 700;
    color: var(--primary);
  }
}
</style>