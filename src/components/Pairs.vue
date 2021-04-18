<template>
<div class="pairs-page">
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <div class="logout" @click="logout">
    <img src="../assets/Logout.png" alt="logout"/>
  </div>
  <div class="pairs">
    <div class="planka"></div>
    <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
      <h1>Select your currency</h1>
      <div class="info-block">
        <h1>i</h1>
      </div>
    </div>
    <div class="pairs-block">
      <div class="pairs-from-to">
        <div class="currency-pair" style="margin-top: 30px">
          <VSelect :options="coinsFromConst" :default="coinFrom[0]" :parent="{type: 'f', number: 0}" :tabindex="0" @input="inputSelect" style="z-index: 10"></VSelect>
          <img class="pairs-img" src="../assets/Arrow.png" alt="arrow"/>
          <VSelect :options="pairsTo[0]" :default="coinTo[0]" :parent="{type: 't', number: 0}" :tabindex="1" @input="inputSelect" style="z-index: 10"></VSelect>
        </div>
        <div class="pairs-add-pair" @click="addPair" v-show="!secondPair">
          <p>Add another pair</p>
          <img src="../assets/Plus.png" alt="plus"/>
        </div>
        <div class="currency-pair" v-show="secondPair">
          <VSelect :options="coinsFromConst" :parent="{type: 'f', number: 1}" :default="coinFrom[1]" :tabindex="2" @input="inputSelect" style="z-index: 9"></VSelect>
          <img class="pairs-img" src="../assets/Arrow.png" alt="arrow"/>
          <VSelect :options="pairsTo[1]" :parent="{type: 't', number: 1}" :default="coinTo[1]" :tabindex="3" @input="inputSelect" style="z-index: 9"></VSelect>
        </div>
        <img class="delete-pair" v-show="secondPair" @click="removePair" src="../assets/Trash.png" alt="trash"/>
        <div class="pairs-add-pair" @click="addPair" v-show="!thirdPair">
          <p>Add another pair</p>
          <img src="../assets/Plus.png" alt="plus"/>
        </div>
        <div class="currency-pair" v-show="thirdPair">
          <VSelect :options="coinsFromConst" :parent="{type: 'f', number: 2}" :default="coinFrom[2]" :tabindex="4" @input="inputSelect" style="z-index: 8"></VSelect>
          <img class="pairs-img" src="../assets/Arrow.png" alt="arrow"/>
          <VSelect :options="pairsTo[2]" :parent="{type: 't', number: 2}" :default="coinTo[2]" :tabindex="5" @input="inputSelect" style="z-index: 8"></VSelect>
        </div>
        <img class="delete-pair" v-show="thirdPair" @click="removePair" src="../assets/Trash.png" alt="trash" style="top: 80%"/>
      </div>
      <div class="pairs-planka"></div>
      <div class="pairs-min-max">
        <div class="pairs-min-max-labels">
            <p class="min-label">min</p>
            <p class="max-label">max</p>
        </div>
        <div class="currency-pair-values" style="margin-top: 30px">
          <div class="value-input">
            <img src="../assets/Plus.png" @click.prevent="addValue(0, 'min')" alt="add"/>
            <input class="input-values" type="number" v-model="pairsValues[0].min">
            <img src="../assets/Minus.png" @click.prevent="minusValue(0, 'min')" alt="minus"/>
          </div>
          <img class="pairs-img" src="../assets/Line.png" alt="line"/>
          <div class="value-input">
            <img src="../assets/Plus.png" @click.prevent="addValue(0, 'max')" alt="add"/>
            <input class="input-values" type="number" v-model="pairsValues[0].max">
            <img src="../assets/Minus.png" @click.prevent="minusValue(0, 'max')" alt="minus"/>
          </div>
        </div>
        <div class="currency-pair-values" :style="{visibility: secondPair ? 'visible' : 'hidden', opacity: secondPair ? 1 : 0}">
          <div class="value-input">
            <img src="../assets/Plus.png" @click.prevent="addValue(1, 'min')" alt="add"/>
            <input class="input-values" type="number" v-model="pairsValues[1].min">
            <img src="../assets/Minus.png" @click.prevent="minusValue(1, 'min')" alt="minus"/>
          </div>
          <img class="pairs-img" src="../assets/Line.png" alt="line"/>
          <div class="value-input">
            <img src="../assets/Plus.png" @click.prevent="addValue(1, 'max')" alt="add"/>
            <input class="input-values" type="number" v-model="pairsValues[1].max">
            <img src="../assets/Minus.png" @click.prevent="minusValue(1, 'max')" alt="minus"/>
          </div>
        </div>
        <div class="currency-pair-values" :style="{visibility: thirdPair ? 'visible' : 'hidden', opacity: thirdPair ? 1 : 0}">
          <div class="value-input">
            <img src="../assets/Plus.png" @click.prevent="addValue(2, 'min')" alt="add"/>
            <input class="input-values" type="number" v-model="pairsValues[2].min">
            <img src="../assets/Minus.png" @click.prevent="minusValue(2, 'min')" alt="minus"/>
          </div>
          <img class="pairs-img" src="../assets/Line.png" alt="line"/>
          <div class="value-input">
            <img src="../assets/Plus.png" @click.prevent="addValue(2, 'max')" alt="add"/>
            <input class="input-values" type="number" v-model="pairsValues[2].max">
            <img src="../assets/Minus.png" @click.prevent="minusValue(2, 'max')" alt="minus"/>
          </div>
        </div>
      </div>
    </div>
    <div class="email-notification-block">
      <p>E-mail notification</p>
      <div class="email-buttons">
        <div @click="isActive = !isActive" :class="[{ 'active': isActive }, `email-notif-button`]">
          <p>On</p>
        </div>
        <div @click="isActive = !isActive" :class="[{ 'active': !isActive }, `email-notif-button`]">
          <p>Off</p>
        </div>
      </div>
      
    </div>
    <button @click="savePairs()">Continue</button>
  </div>
</div>
</template>

<script>
import PopUp from './PopUp.vue'
import Loader from './Loader.vue'
import VSelect from "./VSelect"
import { mapGetters} from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: 'Pairs',
  
  data() {
    return {
      isActive: false,
    }
  },
  async mounted() {
    try {
      this.getCoinsBasic();
    }
    catch (err) {
      console.log(err);
      this.error(err.response.data.message);
    };
  },
  async created() {
    try {
      this.loadUserPairs();
    } catch (err) {
      this.error(err.response.data.message);
    };
  },
  components: {
    PopUp,
    Loader,
    VSelect,
  },
  methods: {
     ...mapActions({
      login: 'login',
      hideError: 'hideError',
      axiosHeader: 'axiosHeader',
      getCoinsBasic: 'getCoinsBasic',
      loadUserPairs: 'loadUserPairs',
      selectChanged: 'selectChanged',
      selectChangeDefault: 'selectChangeDefault',
      addPairCheck: 'addPairCheck',
      removePairCheck: 'removePairCheck',
      changePairValues: 'changePairValues',
      sendPairs: 'sendPairs',
      logOutFromCurrency: 'logOutFromCurrency'
    }),
    async inputSelect(option) {
      if (option.parent.type === "f") {
        this.selectChanged(option);
      }
      else {
        this.selectChangeDefault(option);
      }
    },
    hideModal() {
      this.error(null);
    },
    addPair() {
      this.addPairCheck();
    },
    removePair() {
      this.removePairCheck();
    },
    addValue(number, field) {
      if (field === "min") {
        this.changePairValues([number, "+", "min"]);
      }
      else {
        this.changePairValues([number, "+", "max"]);
      }
    },
    minusValue(number, field) {
      if (field === "min") {
        this.changePairValues([number, "-", "min"]);
      }
      else {
        this.changePairValues([number, "-", "max"]);
      }
    },
    async savePairs() {
      try{
        let pairs = [];

        if (this.thirdPair) {
          pairs = [
            {from: this.coinFrom[0], to: this.coinTo[0], min: this.pairsValues[0].min, max: this.pairsValues[0].max},
            {from: this.coinFrom[1], to: this.coinTo[1], min: this.pairsValues[1].min, max: this.pairsValues[1].max},
            {from: this.coinFrom[2], to: this.coinTo[2], min: this.pairsValues[2].min, max: this.pairsValues[2].max}
          ];
        }
        else if (this.secondPair) {
          pairs = [
            {from: this.coinFrom[0], to: this.coinTo[0], min: this.pairsValues[0].min, max: this.pairsValues[0].max},
            {from: this.coinFrom[1], to: this.coinTo[1], min: this.pairsValues[1].min, max: this.pairsValues[1].max}
          ];
        }
        else {
          pairs = [
            {from: this.coinFrom[0], to: this.coinTo[0], min: this.pairsValues[0].min, max: this.pairsValues[0].max}
          ];
        }

        await Promise.all(pairs.map(pair => {
          if (pair.min === null || pair.min === "") delete pair.min;
          if (pair.max === null || pair.max === "") delete pair.max;
        }));

        await this.sendPairs({pairs, emailNotif: this.isActive});
        this.$router.push("/graph");
      }
      catch (err) {
        this.error(err.response.message);
      }
    },
    logout() {
      this.logOutFromCurrency();
      this.$router.push("/login");
    }
  },
  computed: {
    ...mapGetters([
      'error',
      'secondPair',
      'thirdPair',
      'addPairButton',
      'removePairButton',
      'pairsValues',
      'coinsFromConst',
      'pairsTo',
      'coinFrom',
      'coinTo',
      'loader'
    ])
  },
}
</script>

<style scoped>
.pairs-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.planka {
  width: 460px;
}

.pairs {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 930px;
  height: 650px;
  padding: 25px 0;
  border-radius: 20px;
  border: 1.5px solid #FFFFFF;
  background: linear-gradient(122.31deg, rgba(255, 255, 255, 0.31) 0.28%, rgba(255, 255, 255, 0.09) 100%);
}

.info-block {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 30px;
  border: 2px solid #ffffff;
  margin: 0 0 30px 6px;
  cursor:help;
}

.info-block:hover::after {
  content: "Select no more than three currency pairs to compare and set minimum and maximum sales rates for each pair. \A \A By pressing the button «ON», you will receive an e-mail notification when the limits you are interested in will be reached.";
  position: absolute; 
  white-space: pre-wrap;
  text-align: justify;
  left: 50%; top: 110%;
  z-index: 1;
  background: #625F61;
  opacity: 0.9;
  font-family: 'Roboto';
  width: 300px;
  padding: 5px 10px;
  border: 1.5px solid #FFFFFF;
  border-radius: 15px;
  color: #FFFFFF;
  font-size: 20px;
  padding: 10px 20px;
}

.info-block h1 {
  margin: 0 0 2px 0;
  font-size: 16px;
  font-family: 'Roboto Mono', monospace;
}

.pairs-block {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 300px;
}

.pairs-from-to, .pairs-min-max {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 45%;
  position: relative;
}

.pairs-planka {
  height: 95%;
  width: 14px;
  border-radius: 15px;
  border: 1.5px solid white;
  background-color: #070708;
}

.delete-pair {
  position: absolute;
  top: 50%;
  left: 1%;
  cursor: pointer;
}

.pairs-img {
  margin: 0 20px;
}

.currency-pair, .currency-pair-values {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: auto;
  height: fit-content;
  transition: 0.2s ease-in;
}

.currency-pair {
  padding-left: 30px;
}

.currency-pair-values {
  margin: 0;
  width: 100%;
}

.pairs-add-pair {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 180px;
  padding: 0 20px;
  height: 50px;
  border-radius: 15px;
  color: #ffffff;
  border: 1.5px solid #ffffff;
  background: linear-gradient(122.31deg, rgba(255, 255, 255, 0.31) 0.28%, rgba(255, 255, 255, 0.09) 100%);
  cursor: pointer;
  margin-left: 30px;
}

.pairs-add-pair p {
  font-size: 20px;
}

.pairs-min-max-labels {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 260px;
  top: 10px;
  left: 70px;
  color: #625F61;
  font-size: 20px;
}

.pairs-min-max-labels p {
  position: relative;
  margin: 0;
}

.min-label::before, .max-label::before {
  position: absolute;
  content: "";
  top: 9px;
  left: -1.3em;
  width: 0px;
  height: 0px;
  border: 9px solid transparent;
  border-color: #625F61 transparent transparent transparent;
}

.max-label::before {
  transform: rotate(180deg);
  top: 0;
}

.value-input {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 130px;
  height: 50px;
  border: 1.5px solid #ffffff;
  background: linear-gradient(122.31deg, rgba(255, 255, 255, 0.31) 0.28%, rgba(255, 255, 255, 0.09) 100%);
  border-radius: 20px;
  padding: 0 8px;
}

.input-values {
  outline: none;
  height: 100%;
  border: none;
  width: 80px;
  padding: 0;
  margin: 0;
  font-size: 23px;
  text-align: center;
}

button {
  width: 550px;
  height: 75px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #85797A;
  color: #FFFFFF;
  font-size: 22px;
  border: none;
  font-family: "Roboto";
  border-radius: 20px;
  cursor: pointer;
  outline: none;
}

.email-notification-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: fit-content;
  width: 340px;
}

.email-notification-block p {
  font-size: 22px;
  color: #FFFFFF;
  margin: 0;
}

.email-buttons {
  display: flex;
  flex-direction: row;
}

.email-notif-button {
  width: fit-content;
  height: fit-content;
  border-radius: 15px;
  padding: 8px 12px;
  margin: 0 5px;
  border: 1.5px solid #FFFFFF;
  background-color: #ffffff00;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.1s ease;
}

.email-notif-button.active {
  background: linear-gradient(122.31deg, rgba(255, 255, 255, 0.31) 0.28%, rgba(255, 255, 255, 0.09) 100%);
  opacity: 1;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>

<style>
.logout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 55px;
  height: 45px;
  border: 1.5px solid #FFFFFF;
  border-radius: 20px;
  padding: 5px 1px 5px 5px;
  background: linear-gradient(122.31deg, rgba(255, 255, 255, 0.31) 0.28%, rgba(255, 255, 255, 0.09) 100%);
  cursor: pointer;
}

.logout img {
  width: 40px;
  height: 30px;
}
</style>