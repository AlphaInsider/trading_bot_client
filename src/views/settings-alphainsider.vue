<template>
<div>
  <!-- current api key -->
  <div class="card">
    <div class="card-body">
      <!-- current api key -->
      <div v-if="apiToken" class="row">
        <!-- name -->
        <div class="col">
          <label>Current API Key</label>
          <h1 class="text-capitalize m-0">{{ apiToken.name }}</h1>
        </div>
        <!-- logo -->
        <div class="col-auto align-self-center">
          <img src="/img/logo.png" alt="AlphaInsider" width="50">
        </div>
      </div>
      
      <!-- no key -->
      <div v-else class="text-center p-2">
        <h5 class="text-muted mb-0">No AlphaInsider API Key Found</h5>
      </div>
    </div>
  </div>
  
  <!-- change api key -->
  <div class="card mt-3">
    <!-- title -->
    <div class="d-flex card-header bg-white">
      <h5 class="text-primary mb-0">New API Key</h5>
    </div>
    <!-- body -->
    <div class="card-body">
      <validation-observer v-slot="event">
        <form @submit.prevent="event.handleSubmit(() => updateKeys(event))">
          <!-- new api key -->
          <div class="row mb-3">
            <div class="col-12 col-md-4 text-md-right pt-2">
              <h6 class="m-0">AlphaInsider Key</h6>
            </div>
            <div class="col-12 col-md-6">
              <validation-provider name="AlphaInsider API Key" rules="required" v-slot="{ errors }">
                <input v-model="newAPIKey" type="text" :class="{'is-invalid': errors.length}" class="form-control">
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>
          </div>

          <!-- save changes -->
          <div class="row mt-3 mt-md-0">
            <div class="col-12 col-md-6 offset-md-4">
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
  
  <!-- strategy select -->
  
</div>
</template>


<script>

import vLogo from "@/components/v-logo.vue";

export default {
  components: {vLogo},
  data() {
    return {
      apiToken: {
        token_id: '123',
        name: 'Test Token',
        type: 'api',
        expires: moment().add(2, 'years').toISOString(),
        created_at: moment().subtract(1, 'month').toISOString(),
        scope: ['test_permission']
      },
      newAPIKey: undefined
    };
  },
  mounted() {},
  methods: {
    updateKeys() {}
  }
}
</script>