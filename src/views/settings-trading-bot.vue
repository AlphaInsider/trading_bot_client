<template>
<div>
  <!-- bot allocation -->
  <div class="card">
    <!-- title -->
    <div class="d-flex card-header bg-white">
      <h5 class="text-primary mb-0">Trading Allocation</h5>
    </div>
    <!-- body -->
    <div class="card-body">
      <validation-observer v-slot="event">
        <form @submit.prevent="event.handleSubmit(() => updateBufferAmount(event))">
          <!-- current allocation -->
          <div class="row mb-md-3">
            <div class="col-12 col-md-4 text-md-right pt-2">
              <h6 class="m-0">Current allocation</h6>
            </div>
            <div class="col-12 col-md-6">
              <input v-model="currentAllocation" type="text" class="form-control" disabled>
            </div>
          </div>
          
          <!-- new allocation -->
          <div class="row mb-3">
            <div class="col-12 col-md-4 text-md-right pt-2">
              <h6 class="m-0">New allocation</h6>
            </div>
            <div class="col-12 col-md-6">
              <validation-provider name="Allocation Amount" rules="min_value:25000|required" v-slot="{ errors }">
                <input v-model="newAllocation" type="number" step="1" :class="{'is-invalid': errors.length}" class="form-control">
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

  <!-- general settings -->
  <div class="card mt-3">
    <!-- title -->
    <div class="d-flex card-header bg-white">
      <h5 class="text-primary mb-0">General Settings</h5>
    </div>
    <!-- body -->
    <div class="card-body">
      <!-- bot error handling -->
      <div class="p-1">
        <!-- checkbox -->
        <div class="d-flex align-items-center">
          <div>
            <p class="mb-0">Close On Stop</p>
            <small class="text-muted">Close all positions when the trading bot stops.</small>
          </div>
          <div class="custom-control custom-switch ml-auto">
            <input @change="updateCloseOnStop()" v-model="closeOnStop" type="checkbox" class="custom-control-input" id="subscription-switch">
            <label class="custom-control-label pointer" for="subscription-switch"></label>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>


<script>
import VDropdownMenu from "@/components/v-dropdown-menu.vue";

export default {
  components: {VDropdownMenu},
  data() {
    return {
      // bot allocation
      currentAllocation: 0,
      newAllocation: undefined,
      // general
      closeOnStop: true
    };
  },
  mounted() {},
  methods: {
    updateBufferAmount() {},
    updateCloseOnStop() {
      this.closeOnStop = !this.closeOnStop;
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-btn {
  color: var(--secondary);
  &.active, &:hover {
    background: var(--light);
  }
  &.btn:focus {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
</style>