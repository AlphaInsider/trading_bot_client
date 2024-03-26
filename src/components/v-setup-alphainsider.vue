<template>
<div>
  <validation-observer key="alphainsider" v-slot="event">
    <form @submit.prevent="event.handleSubmit(() => updateAlphaInsider(event))">
      <!-- new api key -->
      <div class="row">
        <div class="col-12">
          <h6 class="m-0">AlphaInsider API Key</h6>
        </div>
        <div class="col-12">
          <validation-provider name="alphainsider_key" rules="required" v-slot="{ errors }">
            <input-mask
            v-model="alphainsiderKey"
            :mask="/^\S+$/"
            type="text"
            :class="{'is-invalid': errors.length}"
            class="form-control"
            />
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
      if(!this.alphainsiderKey) return Promise.resolve();
      // request updateAlphaInsider
      return this.$store.dispatch('request', {
        type: 'post',
        auth: true,
        url: 'updateAlphaInsider',
        query: {
          alphainsider_key: this.alphainsiderKey
        }
      })
      //success, emit update
      .then(() => {
        this.$emit('update');
      })
      // error, toast error
      .catch(() => {
        toastr.error('Failed to update AlphaInsider API key.');
      });
    }
  }
}
</script>