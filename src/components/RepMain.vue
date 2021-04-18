<template>
<div class="user-page">
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <div class="user-main">
    REP MAIN
  </div>
</div>
</template>

<script>
import PopUp from './PopUp.vue'
import Loader from './Loader.vue'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
      return {
          email: "",
          password: "",
          loader: false
      }
  },
  components: {
    PopUp,
    Loader
  },
  methods: {},

  computed: {
    ...mapGetters([
      'userInfo',
      'error'
    ])
  },
  watch: {
    "userInfo": {
      handler: function(val, oldVal) {}
    }
  }
}
</script>

<style>

</style>
