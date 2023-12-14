<template>
<div></div>
</template>

<script>
export default {
  props: {
    value: {type: Object, default: () => ({})},
    replace: {type: Boolean, default: true}
  },
  data() {
    return {}
  },
  watch: {
    '$route.query': {
      handler(newVal, oldVal) {
        this.updateValue();
      },
      immediate: true,
      deep: true
    },
    value: {
      handler(newVal, oldVal) {
        this.updateQuery();
      },
      deep: true
    }
  },
  methods: {
    updateValue() {
      //get new value
      let newValue = this.queryToValue(this.$route.query);
      //update value if changed
      if(!_.isEqual(newValue, this.value)) {
        this.$emit('input', newValue);
      }
    },
    updateQuery() {
      //get new query
      let newQuery = this.valueToQuery(this.value);
      //check if shortening url, but has same value
      let newValue = this.queryToValue(this.$route.query);
      let isShorteningUrl = _.isEqual(newValue, this.value);
      //update query if changed
      if(!_.isEqual(newQuery, this.$route.query)) {
        this.$router[((this.replace || isShorteningUrl) ? 'replace' : 'push')]({
          path: this.$route.path,
          query: newQuery
        }).catch(() => {});
      }
    },
    queryToValue(query) {
      //convert query into state
      return Object.entries(this.value).reduce((result, [key, data]) => {
        //decode
        let decode = (('decode' in data) ? data.decode(query[key]) : query[key])
        //validate
        let valid = (('valid' in data) ? (typeof data.valid === 'function') ? data.valid(decode) : data.valid.includes(decode) : true)
        //return
        result[key] = {
          ...data,
          value: ((valid) ? decode : data.default)
        };
        return result;
      }, {});
    },
    valueToQuery(state) {
      //convert state into query
      return Object.entries(state).reduce((result, [key, data]) => {
        //validate
        let valid = (('valid' in data) ? (typeof data.valid === 'function') ? data.valid(data.value) : data.valid.includes(data.value) : true)
        //encode
        let encode = (('encode' in data) ? data.encode(data.value) : data.value)
        //return
        if(valid && !_.isEqual(data.value, data.default)) result[key] = encode;
        else result = _.omit(result, key);
        return result;
      }, {...this.$route.query});
    }
  }
}
</script>