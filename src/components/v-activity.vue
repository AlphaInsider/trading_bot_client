<template>
<div class="card">
  <div class="card-body p-0">
    <div class="row no-gutters">
      <!-- event -->
      <div class="col-3 col-md-2 d-flex align-items-center justify-content-center text-white" :class="{'bg-info': activity.type === 'info', 'bg-warning': activity.type === 'warning', 'bg-danger': activity.type === 'error'}">
        <h4 class="text-capitalize text-truncate mb-0">{{ activity.type }}</h4>
      </div>
      <!-- details -->
      <div class="col-9 col-md-10 d-flex align-items-center px-3 py-4">
        <div>
          <label>Message</label>
          <h5 class="mb-0">{{ activity.message }}</h5>
        </div>
        <!-- Date Created -->
        <div class="ml-auto">
          <small class="text-muted text-nowrap ml-auto"><i class="far fa-history mt-1"></i> <v-date :date="activity.created_at"></v-date></small>
        </div>
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

<style lang="scss" scoped>
</style>