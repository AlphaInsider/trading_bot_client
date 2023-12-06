<template>
<div ref="search" @keydown.enter.prevent :class="{'input-shadow': searchInFocus}" class="input-group">
  <!-- search input -->
  <input
  v-model="searchInput"
  @input="searchStrategies()"
  @focus="searchInFocus=true"
  @keyup.enter="strategyList.length >= 1 && selectStrategy(strategyList[0])"
  type="text"
  placeholder="Search Strategy..."
  class="form-control shadow-none border-right-0"
  >

  <!-- dropdown menu -->
  <v-dropdown-menu
  v-if="searchInFocus && (searchInput || strategyList.length >= 1)"
  @close="(!$refs.search.contains($event.target)) && closeSearch()"
  :stay-open="true"
  :arrow-offset="12"
  class="w-100"
  >
    <!-- search results -->
    <div class="stock-list">
      <div v-for="strategy in strategyList" :key="strategy.strategy_id" class="dropdown-item" @click="selectStrategy(strategy)">
        <v-strategy :strategy="strategy" compact></v-strategy>
      </div>
    </div>
    <!-- no search results -->
    <h6 v-if="searchInput && strategyList.length <= 0" class="text-muted my-1">No Search Results</h6>
  </v-dropdown-menu>

  <!-- search icon -->
  <div @click="searchInFocus=true" class="input-group-append">
    <div class="search-button input-group-text bg-white">
      <i v-if="!$store.state.loading.includes('searchStrategies')" :class="{'active': searchInFocus}" class="far fa-search"></i>
      <i v-if="$store.state.loading.includes('searchStrategies')" class="fas fa-spinner fa-pulse text-primary"></i>
    </div>
  </div>
</div>
</template>

<script>
import vDropdownMenu from "@/components/v-dropdown-menu.vue";
import VStrategy from "@/components/v-strategy.vue";
export default {
  components: {VStrategy, vDropdownMenu},
  props: {
    strategyType: {type: String, default: 'stock'}
  },
  data() {
    return {
      // search
      searchInput: '',
      searchInFocus: false,
      searchResults: [],
      selectedStrategy: undefined,
    }
  },
  computed: {
    strategyList() {
      let subscriptions = ((this.searchInput) ? _.filter(this.$store.state.strategySubscriptions, (subscription) => {
        return (subscription.name+' '+subscription.description).includes(this.searchInput);
      }) : this.$store.state.strategySubscriptions);
      return _.chain(subscriptions).concat(this.searchResults).uniqBy('strategy_id').value();
    }
  },
  methods: {
    searchStrategies: _.debounce(function() {
      //skip if searchInput is empty
      if(!this.searchInput) return Promise.resolve();
      //start loading
      return Promise.resolve()
      .then(() => {
        return this.$store.dispatch('startLoading', {label: ['searchStrategies']});
      })
      //request searchStocks
      .then(() => {
        return [{strategy_id: '1', user_id: 'crypto_user', name: 'Test Strategy 1, Test Strategy 1, Test Strategy 1, Test Strategy 1, Test Strategy 1, Test Strategy 1, Test Strategy 1, Test Strategy 1', description: 'testing 321', type: 'crypto', subscriber_count: 10}, {strategy_id: '2', user_id: 'crypto_user', name: 'Test Strategy 2', description: 'testing 123', type: 'stock', subscriber_count: 5}];
        /*return this.$store.dispatch('request', {
          type: 'post',
          auth: false,
          url: 'searchStrategies',
          query: {
            search: this.searchInput,
            type: 'stock',
            limit: 50
          }
        });*/
      })
      //success, set searchResults
      .then((data) => {
        this.searchResults = data;
      })
      //finish loading
      .finally(() => {
        return this.$store.dispatch('finishLoading', {label: ['searchStrategies']});
      });
    }, 500),
    selectStrategy(strategy) {
      //emit strategy to parent
      this.$emit('input', strategy);
      //close search
      this.closeSearch();
    },
    closeSearch() {
      this.searchInput = '';
      this.searchResults = [];
      this.searchInFocus = false;
      this.$refs.search.firstChild.blur();
    }
  }
}
</script>

<style lang="scss" scoped>
//input shadow
.input-shadow {
  background-color: #fff;
  border-radius: 0.3rem;
  outline: 0;
  -webkit-box-shadow: 0 0 0 0.2rem rgba(var(--primary-rgb), 0.25);
  box-shadow: 0 0 0 0.2rem rgba(var(--primary-rgb), 0.25);
}
</style>