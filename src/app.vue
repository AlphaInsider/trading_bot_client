<template>
<div>
  <!-- header -->
  <v-header v-if="!$route.meta.hideNav" :key="$route.path"></v-header>
  
  <!-- content -->
  <div>
    <div id="pull-to-refresh"></div>
    <router-view :key="$route.path"></router-view>
  </div>
  
  <!-- modals -->
  <portal-target name="modal-portal" multiple></portal-target>
</div>
</template>


<script>
import vHeader from '@/components/v-header.vue';

export default {
  components: {vHeader},
  mounted() {
    // init pull to refresh
    PullToRefresh.init({
      mainElement: '#pull-to-refresh',
      onRefresh() {
        window.location.reload();
      }
    });
    // init window sizing
    window.addEventListener('resize', this.getWindowSize);
    this.getWindowSize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowSize);
  },
  methods: {
    getWindowSize() {
      return this.$store.dispatch('setWindowSize', {width: window.innerWidth, height: window.innerHeight});
    }
  }
}
</script>


<style lang="scss">
//==== Bootstrap ====
$theme-colors: (
  'primary': #576ddb,
  'secondary': #6c757d,
  'success': #34a853,
  'danger': #ea4335,
  'warning': #fbbc05,
  'info': #008aff,
  'dark': #34495e,
  'body': #212529,
  'border': #dee2e6
);
:root {
  --primary-rgb: 87,109,219;
  --secondary-rgb: 108,117,125;
  --success-rgb: 52,168,83;
  --danger-rgb: 234,67,53;
  --warning-rgb: 251,188,5;
  --info-rgb: 0,138,255;
  --dark-rgb: 52,73,94;
  --body-rgb: 33,37,41;
}
$enable-responsive-font-sizes: true;
@import '../node_modules/bootstrap/scss/bootstrap.scss';

//==== Font Awesome ====
@import url('../public/webfonts/all.min.css');

//==== Toastr ====
@import '../node_modules/toastr/build/toastr';

//==== Animate.css ====
@import '../node_modules/animate.css/animate.min';

//==== Font Families ====
@import url('../public/fonts/index.css');

//==== Global Styles ====
body {
  //minimum screen width
  min-width: 360px;
  
  //fix scrollbar shifting content
  width:100vw;
  overflow-x:hidden;
  
  //horizontally overflow scroll
  .overflow-scroll {
    overflow-x: scroll;
  }
  
  //global font
  font-family: 'Roboto', sans-serif;
  
  //background color
  background-color: var(--light);
  
  //toastr styling
  #toast-container > div {
    border-radius: 0.5rem;
    opacity: 1;
    border: none;
  }
  #toast-container > .toast-error {
    background-color: var(--danger);
  }
  .toast-success {
    background-color: var(--success);
  }
  .toast-top-center {
    top: var(--safe-area-inset-top);
  }
  
  //link styles
  a:hover {
    text-decoration: none;
  }
  
  //pointer cursor
  .pointer {
    cursor: pointer;
  }
  
  //label margins for forms
  label {
    margin-bottom: 0;
  }
  
  //disable text highlighting
  .disable-highlighting {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    outline: none;
  }
  
  //transparency classes
  .transparent-0 {
    opacity: 0 !important;
  }
  .transparent-25 {
    opacity: 0.25;
  }
  .transparent-50 {
    opacity: 0.5;
  }
  .transparent-75 {
    opacity: 0.75;
  }
  
  //smaller line height
  .line-height-none {
    line-height: unset;
  }
  .line-height-sm {
    line-height: 1;
  }
  
  //filter dropdown styling
  .filter-dropdown {
    border-color: var(--light);
    background-color: rgba(var(--primary-rgb), 0.12);
    border-radius: 0.5rem;
  }
  
  //hover button styling
  .hover-button {
    :hover {
      color: var(--primary);
      opacity: 1;
    }
    i {
      opacity: 0.7;
    }
    i.active {
      color: var(--primary);
      opacity: 1 !important;
    }
  }
}
</style>
