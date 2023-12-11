<template>
<div class="card">
  <!-- title -->
  <div class="card-header bg-white d-flex align-items-center p-3">
    <h5 class="text-primary mb-0">Connect AlphaInsider</h5>
    <router-link to="/alphainsider-tutorial" class="btn btn-outline-primary btn-sm ml-auto">Help</router-link>
  </div>
  <!-- body -->
  <div class="card-body p-3">
    <validation-observer v-slot="event">
      <form @submit.prevent="event.handleSubmit(() => updateAlphaInsider(event))">
        <!-- new api key -->
        <div class="row">
          <div class="col-12 pt-2">
            <h6 class="m-0">AlphaInsider API Key</h6>
          </div>
          <div class="col-12">
            <validation-provider name="AlphaInsider API Key" rules="required" v-slot="{ errors }">
              <input v-model="alphainsiderKey" type="text" :class="{'is-invalid': errors.length}" class="form-control">
              <div class="invalid-feedback">
                {{ errors[0] }}
              </div>
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
export default {
  data() {
    return {
      alphainsiderKey: undefined
    };
  },
  methods: {
    updateAlphaInsider() {
      this.$emit('update');
    }
  }
}
</script>

<style lang="scss" scoped>
</style>