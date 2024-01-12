<template>
<div class="card">
  <div class="card-body p-0">
    <div class="row no-gutters">
      <!-- event -->
      <div class="col-3 col-md-2 d-flex align-items-center justify-content-center text-white" :class="{'bg-info': activity.type === 'info', 'bg-warning': activity.type === 'warning', 'bg-danger': activity.type === 'error'}">
        <h4 class="text-capitalize text-truncate mb-0">{{ activity.type }}</h4>
      </div>
      <!-- details -->
      <div class="col-9 col-md-10 align-items-center px-3 py-4">
        <!-- labels -->
        <div class="d-flex">
          <label>Message</label>
          <label class="text-muted text-nowrap ml-auto"><i class="far fa-history mt-1"></i> <v-date :date="activity.created_at"></v-date></label>
        </div>
        <!-- message -->
        <h5 class="mb-0">{{ activity.message }}</h5>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import vDate from '@/components/v-date.vue';
export default {
  components: {vDate},
  props: {
    activity: {type: Object, default: () => ({})}
  }
}
</script>