<template>
<div>
  <portal to="modal-portal">
    <div @click="$emit('close')" class="modal" tabindex="-1" role="dialog">
      <div @click.stop :class="((size !== '') ? 'modal-'+size : '')" class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="modal-backdrop show"></div>
  </portal>
</div>
</template>


<script>
export default {
  props: {
    size: {type: String, default: '', validator: (val) => ['', 'sm', 'lg', 'xl'].includes(val)}
  },
  mounted() {
    //add class to body
    jQuery('body').addClass('modal-open');
  },
  beforeDestroy() {
    //add class to body
    jQuery('body').removeClass('modal-open');
  }
}
</script>


<style lang="scss" scoped>
.modal {
  display: block;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>