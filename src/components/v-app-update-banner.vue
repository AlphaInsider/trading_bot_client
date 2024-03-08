<template>
<div v-if="showUpdateBanner">
  <!-- update banner -->
  <div class="text-white bg-info shadow-sm">
    <div class="container d-flex py-2">
      <div class="w-100 text-center">
        <h6 class="mb-0">
          <i class="fas fa-download"></i> There is a new update available. <u><a href="#" @click.prevent="update()" class="text-white">Update trading bot</a></u>
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
    this.checkForUpdate();
  },
  methods: {
    checkForUpdate() {
      //request getVersion
      return this.$store.dispatch('request', {
        type: 'get',
        url: 'getVersion',
        query: {}
      })
      //success, show/hide update banner
      .then((data) => {
        this.showUpdateBanner = data.upgradable;
      })
      // error, toast error
      .catch(() => {
        toastr.error('Failed to get app version.');
      });
    },
    update() {
      //electron
      if(this.$store.getters.host === 'electron') {
        window.location.href = 'process:update';
      }
      //web
      else {
        this.$router.push('/update-tutorial');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  color: white;
  text-decoration: underline;
}
</style>