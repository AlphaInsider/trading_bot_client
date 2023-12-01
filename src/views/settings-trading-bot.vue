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
        <div class="d-flex">
          <div>
            <p class="mb-0">Handle Errors</p>
            <small class="text-muted">The action the trading bot should take when an error occurs.</small>
          </div>
          <div class="d-flex align-items-center ml-auto">
            <div class="dropdown">
              <button @click="errorActionDropdown = true" class="btn dropdown-btn pointer text-center py-0 px-2">
                <span v-if="errorAction === 'stop_close'">Stop and Close Positions</span>
                <span v-if="errorAction === 'stop'">Stop Trading Bot</span>
                <i class="fas fa-chevron-down ml-2"></i>
              </button>
              <v-dropdown-menu v-if="errorActionDropdown" :stay-open="true" :arrow="true" :arrow-offset="5" @close="errorActionDropdown = false">
                <button @click="errorAction = 'stop'" class="dropdown-item text-capitalize">
                  <i class="fal fa-octagon text-muted"></i>
                  Stop Trading Bot
                </button>
                <button @click="errorAction = 'stop_close'" class="dropdown-item text-capitalize">
                  <i class="fal fa-times-octagon text-muted"></i>
                  Stop and Close Positions
                </button>
              </v-dropdown-menu>
            </div>
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
      errorActionDropdown: false,
      errorAction: 'stop'
    };
  },
  mounted() {},
  methods: {
    updateBufferAmount() {
      
    },
    enableCloseOvernight() {
      
    },
    updateCloseTimes() {
      
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