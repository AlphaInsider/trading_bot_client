<template>
<div class="container">
  <h3>Home</h3>
</div>
</template>


<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.getBotInfo();
    this.getActivity();
  },
  methods: {
    getBotInfo() {
      //request getBotInfo
      return this.$store.dispatch('request', {
        type: 'get',
        auth: true,
        url: 'getBotInfo'
      })
      //success
      .then((data) => {
        console.log(data);
      })
      //error
      .catch((error) => {
        toastr.error('Failed to get bot information.');
      });
    },
    async getActivity() {}
  }
}
</script>


<style lang="scss" scoped>

</style>