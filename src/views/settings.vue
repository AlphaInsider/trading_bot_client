<template>
<div class="container my-3 my-lg-4">
  <!-- title -->
  <h3 v-if="!$store.getters.isMobileView" class="text-primary text-center text-lg-left">Settings</h3>

  <!-- navbar, content -->
  <div class="row justify-content-center">
    <!-- navbar -->
    <div :class="(($route.name === 'settings') ? 'col-12 col-sm-8 col-lg-3' : 'col-3 d-none d-lg-block')">
      <div class="sidebar-links card">
        <ul class="list-group list-group-flush disable-highlighting">
          <router-link v-if="$route.name === 'settings' && !$store.getters.isMobileView" to="/settings" tag="li" active-class="active" class="list-group-item"><i class="fal fa-user-circle"></i> User</router-link>
          <router-link v-if="$route.name !== 'settings' || $store.getters.isMobileView" to="/settings/user" tag="li" active-class="active" class="list-group-item"><i class="fal fa-user-circle"></i> User</router-link>
          <router-link to="/settings/trading-bot" tag="li" active-class="active" class="list-group-item"><i class="fal fa-robot"></i> Trading Bot</router-link>
          <router-link to="/settings/api-keys" tag="li" active-class="active" class="list-group-item"><i class="fal fa-file-invoice-dollar"></i> API Keys</router-link>
        </ul>
      </div>

      <div class="sidebar-links card mt-3">
        <ul class="list-group list-group-flush disable-highlighting">
          <li class="list-group-item"><a href="https://alphainsider.freshdesk.com/support/tickets/new" target="_blank" class="d-block text-body"><i class="fal fa-comments-alt"></i> Contact Us</a></li>
        </ul>
      </div>
      <div v-if="$store.getters.isMobileView" class="sidebar-links card mt-3">
        <ul class="list-group list-group-flush disable-highlighting">
          <li @click="$store.dispatch('logout')" class="list-group-item text-danger"><i class="far fa-sign-out fa-flip-horizontal"></i> Sign Out</li>
        </ul>
      </div>
    </div>

    <!-- content -->
    <div :class="(($route.name === 'settings') ? 'col-lg-9 d-none d-lg-block' : 'col-12 col-lg-9')">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>


<script>
export default {
  data() {
    return {}
  }
}
</script>


<style lang="scss" scoped>
//sidebar link colors
.sidebar-links li {
  cursor: pointer;
  &:hover:not(.active) {
    background: var(--light);
  }
  &.active {
    background: var(--primary);
  }
  i {
    width: 25px;
    text-align: center;
  }
}
</style>