<template>
<div class="logo-font d-inline-flex align-items-center">
  <p class="icon my-0" :style="{'font-size': fontSize+'rem'}">A</p>
  <p v-if="!iconOnly" :class="[(iconOnlySize ? 'd-'+iconOnlySize+'-block d-none' : '')]" class="icon-text my-0" :style="{'font-size': fontSize*0.55+'rem'}">
    lpha
  </p>
  <p v-if="!iconOnly" :class="[(iconOnlySize ? 'd-'+iconOnlySize+'-block d-none' : '')]" class="insider-text my-0" :style="{'font-size': fontSize*0.55+'rem'}">
    Bot
  </p>
</div>
</template>


<script>
export default {
  props: {
    fontSize: {type: Number, default: 2.75},
    iconOnly: {type: Boolean, default: false},
    iconOnlySize: {type: String, default: '', validator: (val) => ['', 'xs', 'sm', 'md', 'lg', 'xl'].includes(val)}
  }
}
</script>


<style lang="scss" scoped>
.logo-font {
  user-select: none;
  font-family: 'Gugi', cursive;
  line-height: 1;
}
.icon {
  background: rgba(0, 0, 0, 0) -webkit-linear-gradient(0deg, rgb(234,67,53), rgb(191, 0, 255), rgb(66,133,244)) repeat scroll 0% 0%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.icon-text {
  font-weight: bold;
  background: rgba(0, 0, 0, 0) -webkit-linear-gradient(0deg, rgb(66,133,244), rgb(52,168,83)) repeat scroll 0% 0%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.insider-text {
  font-weight: bold;
  color: var(--dark);
}
</style>