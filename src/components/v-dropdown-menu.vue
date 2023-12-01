<template>
<div ref="dropdownMenu" :class="((align === 'right') ? 'dropdown-menu-right' : '')" class="dropdown-menu show mt-2 p-2">
  <span v-if="arrow" :style="{[align]: arrowOffset+'px'}" class="arrow"></span>
  <slot></slot>
</div>
</template>


<script>
export default {
  props: {
    stayOpen: {type: Boolean, default: false},
    align: {type: String, default: 'right', validator: (val) => ['left', 'right'].includes(val)},
    arrow: {type: Boolean, default: true},
    arrowOffset: {type: Number, default: 20}
  },
  data() {
    return {
      clickedOpen: false
    };
  },
  mounted() {
    document.addEventListener('click', this.clickOut);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickOut);
  },
  methods: {
    clickOut(event) {
      //detect click outside dropdown menu
      if (!this.$refs.dropdownMenu.contains(event.target) || !this.stayOpen) {
        //ignore first click open
        if(!this.clickedOpen) {
          this.clickedOpen = true;
        }
        //close dropdown menu
        else {
          this.$emit('close', event);
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
//dropdown menu arrow styling
.dropdown-menu {
  box-shadow: rgba(101, 119, 134, 0.3) 0 0 15px, rgba(101, 119, 134, 0.2) 0 0 3px 1px;
  outline: none;
  z-index: 950;
  .arrow:before, .arrow:after {
    content: "";
    position: absolute;
    display: block;
    right: inherit;
    width: 0;
    height: 0;
    border-width: 7px 8px;
    border-style: solid;
    border-color: transparent;
    z-index: 1001;
  }
  .arrow:before {
    top: -14px;
    border-bottom-color: rgba(0, 0, 0, 0.15);
  }
  .arrow:after {
    top: -13px;
    border-bottom-color: #ffffff;
  }
}
//dropdown item
.dropdown-item {
  line-height: 16px;
  padding: 12px;
  border-radius: 0.25rem;
  i {
    width: 24px;
  }
  &:hover, &:focus {
    background-color: #f4f6f7;
  }
  &:active, &.active {
    color: inherit;
    text-decoration: none;
    background-color: var(--border);
  }
}
//dropdown item disable highlighting
.dropdown-item {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  outline: none;
}
</style>