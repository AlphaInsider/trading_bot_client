<template>
<div></div>
</template>

<script>
export default {
  props: {
    channels: {type: Array, default: () => []}
  },
  watch: {
    channels: {
      handler(newVal, oldVal) {
        //if channels changed
        if(!_.isEqual(_.sortBy(newVal), _.sortBy(oldVal))) {
          //unsubscribe
          this.$store.dispatch('wsUnsubscribe', {id: this._uid});
          //subscribe
          this.$store.dispatch('wsSubscribe', {
            id: this._uid,
            channels: newVal
          });
        }
      },
      deep: true
    },
    ['$store.state.wsMessage'](newVal, oldVal) {
      //websocket messages
      if(newVal.event !== 'error' && this.channels.includes(newVal.channel)) {
        this.$emit('message', newVal.response);
      }
    }
  },
  mounted() {
    //subscribe
    this.$store.dispatch('wsSubscribe', {
      id: this._uid,
      channels: this.channels
    });
  },
  beforeDestroy() {
    //unsubscribe
    this.$store.dispatch('wsUnsubscribe', {id: this._uid});
  }
}
</script>