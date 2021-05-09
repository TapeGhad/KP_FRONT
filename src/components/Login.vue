<template>
<div class="login-page">
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <div class="login">
    <div class="planka"></div>
    <h1>АВТОРИЗАЦИЯ</h1>
    <div class="info-block">
      <div class="input-block">
        <div class="mail-icon"></div>
        <input type="text" v-model="email" placeholder="Почта">
      </div>
      <div class="input-block">
        <div class="pass-icon"></div>
        <input type="password" v-model="password" placeholder="Пароль">
      </div>
      <button id="login" @click="loginButton()">ВОЙТИ</button>
    </div>
    <div class="to-register-block">
      <p>Нету аккаунта? </p>
      <span>
        <router-link to="/register" class="register-link">Регистрация</router-link>
      </span>
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
  methods: { 
    ...mapActions({
      login: 'login',
      hideError: 'hideError',
      axiosHeader: 'axiosHeader'
    }),

    async loginButton() {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)) {
        try {
          this.loader = true;
          this.login({email: this.email, password: this.password});
          this.loader = false;
        }
        catch (err) {
          this.loader = false;
          this.hideError(err.response.data.message);
        };
      } else {
        this.hideError("Incorrect e-mail");
      }
    },
    register() {
      this.$router.push("/register");
    },
    hideModal() {
      this.hideError(null);
    }
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
<style>
h1 {
  font-size: 35px;
  color: #FFFFFF;
  font-weight: normal;
  letter-spacing: 1px;
  margin: 0;
}

.login-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login {
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

.planka {
  width: 260px;
  height: 14px;
  left: 285px;
  top: 44px;
  background: #07070846;
  border-radius: 20px;
  border: 1.5px solid #FFFFFF;
}

.info-block {
  display: flex;
  flex-direction: column;
  width: 70%;
  height: fit-content;
}

.input-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(122.31deg, rgba(255, 255, 255, 0.31) 0.28%, rgba(255, 255, 255, 0.09) 100%);
  border: 1.5px solid #FFFFFF;
  border-radius: 20px;
  width: 100%;
  height: 70px;
  margin: 0 0 20px;
}

input {
  background: none;
  border: none;
  width: 80%;
  height: 90%;
  outline: none;
  color: white;
  font-size: 20px;
  transition: 0.2s ease-in;
}

.mail-icon, .pass-icon{
  width: 30px;
  height: 20px;
  background-image: url("../assets/Mail.png");
  background-size: contain;
  background-repeat: no-repeat;
  margin: 0 25px;
}

.pass-icon{
  background-image: url("../assets/Pass.png");
  margin: 0 20px 0 30px;
  height: 28px;
}

input::placeholder {
  color: white;
}

#login {
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

.to-register-block {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: fit-content;
}

.to-register-block p, .register-link {
  color: #FFFFFF;
  margin: 0 20px 0 0;
  font-size: 22px;
  text-decoration: none;
}

.register-link {
  margin: 0;
}

span{
    display:inline-block;
    width: fit-content;
    border-bottom: 1px solid #FFFFFF;
    padding-bottom:1px;
}

@font-face {
  font-family: 'fontello';
  src: url('../font/fontello.eot?69700592');
  src: url('../font/fontello.eot?69700592#iefix') format('embedded-opentype'),
       url('../font/fontello.woff2?69700592') format('woff2'),
       url('../font/fontello.woff?69700592') format('woff'),
       url('../font/fontello.ttf?69700592') format('truetype'),
       url('../font/fontello.svg?69700592#fontello') format('svg');
  font-weight: normal;
  font-style: normal;
}
 
input[type="password"] {
	font-family: "fontello";
	font-style: normal;
	font-weight: normal;

	font-variant: normal;
	text-transform: none;

	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	
  font-size: 14px;
	letter-spacing: 1px;
}
 

input[type="password"]::placeholder {
  font-family:'Roboto', sans-serif;
  font-size: 18px;
  letter-spacing: normal;
  text-align: start;
}

input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus
input:-webkit-autofill, 
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  border: 0;
  -webkit-text-size-adjust: 15px;
  -webkit-text-fill-color: #FFFFFF;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset;
  transition: background-color 5000s ease-in-out 0s;
  background: -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(0,174,255,0.04) 50%,rgba(255,255,255,0) 51%,rgba(0,174,255,0.03) 100%);  
}
</style>
