<template>
  <div v-if="showUpdateBanner">
    <!-- update banner -->
    <div class="text-white bg-info shadow-sm">
      <div class="container d-flex py-2">
        <div class="w-100 text-center">
          <h6 class="mb-0">
            <i class="fas fa-download"></i> There is a new update available. <router-link to="/update-tutorial" class="btn btn-light border mr-2">Update trading bot</router-link>.
          </h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showUpdateBanner: false
    };
  },
  mounted() {
    this.checkAppUpdate();
  },
  methods: {
    checkAppUpdate() {}
  }
}
</script>

<style lang="scss" scoped>
.link {
  color: white;
  text-decoration: underline;
}
</style>