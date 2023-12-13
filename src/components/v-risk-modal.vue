<template>
<v-modal @close="$emit('close')">
  <!-- title -->
  <div class="card-header bg-white d-flex p-3">
    <h5 class="text-primary mb-0">Risk Disclaimer</h5>
    <h5 @click="$emit('close')" class="mb-0 ml-auto"><i class="far fa-times text-muted pointer"></i></h5>
  </div>
  <!-- body -->
  <div class="card-body p-3">
    <validation-observer v-slot="event">
      <form @submit.prevent="event.handleSubmit(() => confirmed())">
        <p class="mb-0">
          By activating AlphaBot, you grant it permission to automatically rebalance your portfolio to match the chosen AlphaInsider strategy,
          including buying and selling assets and using all available cash. While active, <b class="text-danger">you cannot manually trade</b>. To regain control,
          simply pause or delete the AlphaBot app. <b class="text-danger">You acknowledge potential risks and agree
          to indemnify AlphaBot from any losses or claims arising from its use</b>.
        </p>
        
        <p class="mb-0 mt-2">
          You also acknowledge and agree to the <a href="/risk-disclaimer" target="_blank">risk disclaimer</a>.
        </p>

        <!-- confirmation -->
        <validation-provider name="confirmation" :rules="{required: {allowFalse: false}}" v-slot="{ errors }">
          <div class="custom-control custom-checkbox mt-3">
            <input v-model="confirm" id="confirm" type="checkbox" :class="{'is-invalid': errors.length}" class="custom-control-input">
            <label for="confirm" class="custom-control-label">I acknowledge and agree</label>
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </div>
        </validation-provider>

        <!-- submit -->
        <div class="d-flex align-items-center">
          <button @click="$emit('close')" type="button" class="btn btn-light border ml-auto mr-2">Cancel</button>
          <button type="submit" class="btn btn-primary">Confirm <i class="fas fa-long-arrow-right"></i></button>
        </div>
      </form>
    </validation-observer>
  </div>
</v-modal>
</template>


<script>
import vModal from '@/components/v-modal.vue';

export default {
  components: {vModal},
  data() {
    return {
      confirm: false
    }
  },
  methods: {
    confirmed() {
      this.$emit('confirmed')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>