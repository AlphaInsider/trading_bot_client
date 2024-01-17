<template>
<div v-if="$route.name">
  <!-- header -->
  <nav class="navbar d-flex justify-content-between justify-content-start bg-white border-bottom px-4 pb-2">
    <!-- logo -->
    <div class="d-flex align-items-center">
      <router-link to="/" class="disable-highlighting">
        <v-logo></v-logo>
      </router-link>
    </div>
    
    <!-- signed in mobile -->
    <div v-if="$store.getters.isLoggedIn && $store.getters.isMobileView" class="d-flex align-items-center">
      <!-- settings page -->
      <div class="header-links disable-highlighting">
        <router-link to="/settings" active-class="active" class="h3 p-2">
          <i :class="(($route.path.startsWith('/settings')) ? 'fas' : 'fal')" class="fa-cog"></i>
        </router-link>
      </div>
    </div>
    
    <!-- signed in desktop -->
    <div v-else-if="$store.getters.isLoggedIn" class="d-flex align-items-center">
      <!-- header bar -->
      <div class="header-links disable-highlighting mr-3">
        <!-- home page -->
        <router-link to="/" exact-active-class="active" class="p-2">Home</router-link>
        <!-- settings page -->
        <router-link to="/settings" active-class="active" class="p-2">Settings</router-link>
      </div>
      <!-- sign out -->
      <button v-if="!$store.getters.isElectron" type="button" class="btn btn-outline-primary px-4" @click="$store.dispatch('logout')">Sign Out</button>
    </div>
  </nav>
</div>
</template>


<script>
import vLogo from '@/components/v-logo.vue';

export default {
  components: {vLogo}
}
</script>


<style lang="scss" scoped>
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