<template>
<div>
  <!-- Header -->
  <div class="row no-gutters">
    <!-- title -->
    <div class="col-9 d-flex align-items-center line-height-sm text-wrap pr-1">
      <div :title="strategy.name" :class="(strategy.name.length < 50 ? 'h5' : 'title-text-truncate')" class="mb-0">
        {{ strategy.name }}
      </div>
    </div>
    <div class="col-3 d-flex align-items-center text-capitalize text-center">
      <a :href="'https://alphainsider.com/strategy/'+strategy.strategy_id" target="_blank" class="btn btn-primary btn-sm btn-block">View</a>
    </div>
  </div>
  <!-- info -->
  <div class="row no-gutters pt-1">
    <!-- Left -->
    <div class="col-9 d-flex align-items-center pr-1">
      <!-- User -->
      <a :href="'https://alphainsider.com/portfolio/'+strategy.user_id" target="_blank" :title="strategy.user_id" class="small text-nowrap text-truncate text-muted pointer">
        <i class="fas fa-user"></i> {{ strategy.user_id }}
      </a>
      <small v-if="strategy.private" class="ml-2 mb-0">
        <span v-tooltip:top="'Private Strategy'" class="d-inline-block text-warning"><i class="fas fa-lock"></i></span>
      </small>
      <!-- Strategy Type -->
      <small v-if="strategy.type === 'cryptocurrency'" class="ml-2 mb-0"><span class="badge badge-secondary">Crypto</span></small>
      <!-- Owner -->
      <small v-if="($store.getters.user_id === strategy.user_id)" class="ml-2 mb-0"><span class="badge badge-info">Owner</span></small>
      <!-- Subscribed -->
      <small v-if="(($_.find($store.state.strategySubscriptions, {strategy_id: strategy.strategy_id}) || {}).status === 'active')" class="ml-2 mb-0"><span class="badge badge-info">Following</span></small>
    </div>
    <!-- right -->
    <div class="col-3 d-flex align-items-center justify-content-around">
      <!-- subscribers -->
      <small :title="$formatNumber(strategy.subscriber_count)+' subscribers'" class="text-muted">
        <i class="fad fa-users"></i> {{ $abbreviateNumber(strategy.subscriber_count) }}
      </small>
    </div>
  </div>
  <!-- description -->
  <div v-if="!compact" class="d-flex">
    <p v-html="strategy.description" class="description-text-truncate text-justify text-muted mb-0"></p>
  </div>
</div>
</template>

<script>
export default {
  props: {
    strategy: {type: Object, default: () => ({})},
    compact: {type: Boolean, default: false}
  }
}
</script>

<style lang="scss" scoped>
//title truncate
.title-text-truncate {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
}
//description truncate
.description-text-truncate {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 3;
}
</style>