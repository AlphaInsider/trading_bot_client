<template>
<div class="card">
  <!-- title -->
  <div class="card-header bg-white d-flex p-3">
    <h5 class="text-primary mb-0">Strategy Select</h5>
  </div>
  <!-- body -->
  <div class="card-body p-3">
    <validation-observer v-slot="event">
      <form @submit.prevent="event.handleSubmit(() => updateStrategy(event))">
        <!-- search strategy -->
        <v-strategy-search :strategy-type="'stock'" @input="strategy = $event"></v-strategy-search>

        <!-- strategy view -->
        <h5 class="text-primary mb-0 mt-3">Strategy</h5>
        <div v-if="strategy" class="card mt-1">
          <div class="card-body">
            <v-strategy :strategy="strategy"></v-strategy>
          </div>
        </div>
        <div v-else :class="((event.failed && $_.isEmpty(strategy)) ? 'text-danger border border-danger' : 'text-muted')" class="d-flex-column bg-light rounded text-center py-4 mt-1">
          <h5 class="my-2">No Strategy Selected</h5>
        </div>
        
        <!-- allocation -->
        <h5 class="text-primary mb-0 mt-3">Bot Allocation</h5>
        <!-- current allocation -->
        <div v-if="currentAllocation" class="row mt-1">
          <div class="col-12">
            <p class="m-0">Current allocation</p>
          </div>
          <div class="col-12">
            <input-mask
            v-model="currentAllocation"
            mask="$ num"
            :blocks="{num: {mask: Number, scale: 15, thousandsSeparator: ',', radix: '.'}}"
            :unmask="true"
            :lazy="false"
            class="form-control"
            disabled
            ></input-mask>
          </div>
        </div>
        <!-- new allocation -->
        <div class="row mt-1">
          <div class="col-12">
            <p class="m-0">New allocation</p>
          </div>
          <div class="col-12">
            <validation-provider name="allocation" :rules="allocationRules" v-slot="{ errors }">
              <div :class="{'is-invalid': errors.length}" class="input-group">
                <input-mask
                v-model="allocation"
                mask="$ num"
                :blocks="{num: {mask: Number, scale: 15, thousandsSeparator: ',', radix: '.'}}"
                :unmask="true"
                :lazy="false"
                :class="{'is-invalid': errors.length}"
                class="form-control"
                ></input-mask>
              </div>
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>

        <!-- save changes -->
        <div class="row mt-3">
          <div class="col-12 d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </validation-observer>
  </div>
</div>
</template>

<script>
import vStrategy from '@/components/v-strategy.vue';
import vStrategySearch from '@/components/v-strategy-search.vue';

export default {
  components: {vStrategy, vStrategySearch},
  data() {
    return {
      strategy: undefined,
      // broker
      broker: {value: '25000'},
      // allocation
      currentAllocation: undefined,
      allocation: '0'
    };
  },
  computed: {
    allocationRules() {
      let rules = {min_value: '100', required: true};
      if(this.broker.value) rules.max_value = this.broker.value;
      return rules;
    }
  },
  methods: {
    updateStrategy() {
      this.$emit('update', [this.strategy]);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>