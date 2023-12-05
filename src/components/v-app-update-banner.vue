<template>
  <div v-if="showUpdateBanner">
    <!-- update banner -->
    <div class="text-white bg-info shadow-sm">
      <div class="container d-flex py-2">
        <div class="w-100 text-center">
          <h6 class="mb-0">
            <i class="fas fa-download"></i> There is a new update available. <a :href="updateLink" target="_blank" class="link pointer font-weight-bold">Update trading bot</a>.
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
  computed: {
    updateLink() {
      // digital ocean: https://cloud.digitalocean.com/apps
      // heroku: https://dashboard.heroku.com/apps
      return 'https://cloud.digitalocean.com/apps';
    }
  },
  mounted() {
    this.checkAppUpdate();
  },
  methods: {
    checkAppUpdate() {},
    performUpdate() {}
  }
}
</script>

<style lang="scss" scoped>
.link {
  color: white;
  text-decoration: underline;
}
</style>