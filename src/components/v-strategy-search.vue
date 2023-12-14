<template>
<div ref="search" @keydown.enter.prevent :class="{'input-shadow': searchInFocus}" class="input-group">
  <!-- search input -->
  <input
  v-model="searchInput"
  @input="searchStrategies()"
  @focus="searchInFocus=true"
  @keyup.enter="searchResults.length >= 1 && selectStrategy(searchResults[0])"
  type="text"
  placeholder="Search Strategy..."
  class="form-control shadow-none border-right-0"
  >
  
  <!-- dropdown menu -->
  <v-dropdown-menu
  v-if="searchInFocus && (searchInput || searchResults.length > 0)"
  @close="(!$refs.search.contains($event.target)) && closeSearch()"
  :stay-open="true"
  :arrow-offset="12"
  class="w-100"
  >
    <!-- search results -->
    <div class="search-list">
      <div v-for="strategy in searchResults" :key="strategy.strategy_id" class="dropdown-item" @click="selectStrategy(strategy)">
        <v-strategy :strategy="strategy" compact></v-strategy>
      </div>
    </div>
    <!-- no search results -->
    <h6 v-if="searchInput && searchResults.length <= 0" class="text-muted my-1">No Search Results</h6>
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
import vDropdownMenu from '@/components/v-dropdown-menu.vue';
import vStrategy from '@/components/v-strategy.vue';
export default {
  components: {vDropdownMenu, vStrategy},
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
  methods: {
    searchStrategies: _.debounce(async function() {
      //skip if searchInput is empty
      if(!this.searchInput) return;
      //start loading
      await this.$store.dispatch('startLoading', {label: ['stockSearch']});
      //request searchStocks
      this.searchResults = await this.$store.dispatch('request', {
        type: 'post',
        auth: !!this.$store.state.bot.alphainsider,
        url: 'searchStrategies',
        loadingLabel: 'searchStrategies',
        query: {
          search: this.searchInput,
          type: {includes: ['stock'], excludes: []},
          limit: 6
        }
      })
      .catch((error) => {});
      //finish loading
      await this.$store.dispatch('finishLoading', {label: ['stockSearch']});
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
//search list styling
.search-list {
  max-height: 20rem;
  overflow-y: auto;
}
</style>