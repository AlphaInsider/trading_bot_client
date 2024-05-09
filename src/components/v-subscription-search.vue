<template>
<div ref="search" @keydown.enter.prevent :class="{'input-shadow': searchInFocus}" class="input-group">
  <!-- search input -->
  <input
  v-model="searchInput"
  @focus="searchInFocus=true"
  @keyup.enter="searchResults.length >= 1 && selectSubscription(searchResults[0])"
  type="text"
  placeholder="Search Subscriptions..."
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
      <div v-for="subscription in searchResults" :key="subscription.strategy_id" class="dropdown-item" @click="selectSubscription(subscription)">
        <v-strategy :strategy="subscription.strategy" compact></v-strategy>
      </div>
    </div>
    <!-- no search results -->
    <h6 v-if="searchInput && searchResults.length <= 0" class="text-muted my-1">No Search Results</h6>
  </v-dropdown-menu>
  
  <!-- search icon -->
  <div @click="searchInFocus=true" class="input-group-append">
    <div class="search-button input-group-text bg-white">
      <i v-if="!$store.state.loading.includes('getStrategySubscriptions')" :class="{'active': searchInFocus}" class="far fa-search"></i>
      <i v-if="$store.state.loading.includes('getStrategySubscriptions')" class="fas fa-spinner fa-pulse text-primary"></i>
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
    excludes: {type: Array, default: []}
  },
  data() {
    return {
      subscriptions: [],
      // search
      searchInput: '',
      searchInFocus: false
    }
  },
  computed: {
    searchResults() {
      return _.filter(this.subscriptions, (subscription) => {
        if(this.excludes.includes(subscription.strategy_id) || subscription.strategy.type !== this.$store.state.bot.broker?.asset_class) return false;
        return (subscription.strategy_id+':'+subscription.strategy.user_id+':'+subscription.strategy.name+':'+subscription.strategy.description).toLowerCase().includes(this.searchInput.toLowerCase());
      });
    }
  },
  async mounted() {
    await this.$store.dispatch('getBotInfo');
    await this.getStrategySubscriptions();
  },
  methods: {
    async getStrategySubscriptions() {
      //request updateAllocation
      this.subscriptions = await this.$store.dispatch('request', {
        type: 'post',
        auth: true,
        url: 'getStrategySubscriptions',
        loadingLabel: 'getStrategySubscriptions',
        query: {
          bot_id: this.$store.state.bot.bot_id
        }
      });
    },
    selectSubscription(subscription) {
      //emit subscription to parent
      this.$emit('input', subscription.strategy);
      //close search
      this.closeSearch();
    },
    closeSearch() {
      this.searchInput = '';
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