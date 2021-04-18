<template>
<div>
    <transition name="fade">
    <div id="popup" v-show="error">
        <h5>{{error}}</h5>
    </div>
    </transition>
</div>
</template>

<script>
export default {
  name: 'Pairs',
  props: {
      error: {
          type: String,
          default: null
      }
  },
  data() {
      return {
      }
  },
  methods: {
      show(newVal, oldVal) {
          if (oldVal === null) {
            setTimeout(() => {
              this.$emit('hideModal')
            }, 5000)
          }
      }
  },
  watch: {
      error: 'show'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

h5 {
    margin: 0;
}

#popup {
    position: absolute;
    right: 20px;
    top: 10px;
    width: 200px;
    color: black;
    font-size: 20px;
    height: fit-content;
    background-color: red;
    transition: 0.4s ease-in;
    border-radius: 25px;
    padding: 10px 20px;
}
</style>