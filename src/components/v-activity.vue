<template>
<div class="card">
  <!-- title -->
  <div class="card-header bg-transparent">test header</div>
  <!-- body -->
  <div class="card-body">test body</div>
</div>
</template>

<script>
export default {
  props: {
    activity: {type: Object, default: () => ({})}
  }
}
</script>