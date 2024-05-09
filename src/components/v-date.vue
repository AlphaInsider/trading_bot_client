<template>
<span :title="$moment(date).format('LLL')">{{ computedTime }}</span>
</template>


<script>
export default {
  props: {
    date: {type: String, default: () => moment().toISOString()},
    fullDate: {type: Boolean, default: false}
  },
  data() {
    return {
      timeNow: Date.now(),
      interval: undefined
    }
  },
  computed: {
    computedTime() {
      //watch timeNow to recompute time
      this.timeNow = this.timeNow+'';
      //current date
      let date = moment(this.date);
      // show full time
      if(this.fullDate) {
        return date.format('MMM DD, YYYY [at] h:mma');
      }
      // check if date is after 1 hour period
      else if(date.isAfter(moment().subtract(1, 'hours'))) {
        return date.fromNow();
      }
      // check if data is after 2 hour period
      else if(date.isAfter(moment().subtract(2, 'hours'))) {
        return moment().diff(date, 'hours') + ' hr ago';
      }
      // check if date is within 24 hour period
      else if(date.isAfter(moment().subtract(24, 'hours'))) {
        return moment().diff(date, 'hours') + ' hrs ago';
      }
      // beyond 24 hours
      else {
        return date.format('MMM DD, YYYY');
      }
    }
  },
  mounted() {
    // if date is within a day, auto refresh every 10 seconds
    if(moment(this.date).isAfter(moment().subtract(24, 'hours'))) {
      this.interval = setInterval(() => {
        this.timeNow = Date.now();
      }, 10000);
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
}
</script>