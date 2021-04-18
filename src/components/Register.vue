<template>
<div class="register-page">
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <div class="register">
    <div class="planka"></div>
    <h1>Sign up</h1>
    <div class="info-block">
      <div class="input-block">
        <div class="mail-icon"></div>
        <input type="text" v-model="email" placeholder="E-mail">
      </div>
      <div class="input-block">
        <div class="pass-icon"></div>
        <input type="password" v-model="password1" placeholder="Password">
      </div>
      <div class="input-block">
        <div class="pass-icon"></div>
        <input type="password" v-model="password2" placeholder="Confirm password">
      </div>
      <button id="register" @click="registerButton()">Sign up</button>
    </div>
  </div>
</div>
</template>

<script>
import PopUp from './PopUp.vue'
import Loader from './Loader.vue'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: 'Register',
  data() {
      return {
          email: "",
          password1: "",
          password2: "",
          loader: false
      }
  },
  components: {
    PopUp,
    Loader
  },
  methods: { 
    ...mapActions({
      register: 'register',
      hideError: 'hideError',
      axiosHeader: 'axiosHeader'
    }),

    async registerButton() {
      if (this.password1 === this.password2 && this.password1 !== "") {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)) {
          try {
            this.loader = true;
            this.register({email: this.email, password: this.password1});
            this.loader = false;
          }
          catch (err) {
            this.loader = false;
            this.hideError(err.response.data.message);
          }
        } else {
          this.hideError("Incorrect e-mail");
        }
      }
      else {
        this.hideError("Passwords are not the same");
      }
    },
    hideModal() {
      this.hideError(null);
    },
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'error'
    ])
  },
  watch: {
    "userInfo": {
      handler: function(val, oldVal) {
        if (val) { 
          switch (val.role) {
            case 'user':
              this.$router.push("/user-main");
              break;
            case 'rep':
              this.$router.push("/rep-main");
              break;
            case 'admin':
              this.$router.push("/admin-main");
              break;
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.register-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 730px;
  height: 550px;
  padding: 25px 0;
  border-radius: 20px;
  border: 1.5px solid #FFFFFF;
  background: linear-gradient(122.31deg, rgba(255, 255, 255, 0.31) 0.28%, rgba(255, 255, 255, 0.09) 100%);
}

#register {
  outline: none;
  width: 100%;
  height: 80px;
  font-size: 22px;
  border: none;
  background: none;
  color: rgb(255, 255, 255);
  transition: 0.2s ease-in;
  cursor: pointer;
  background: #070708;
  border-radius: 20px;
}
</style>
