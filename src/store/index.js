import axios from 'axios'
import Vuex from 'vuex'
import Vue from 'vue'
import { environment } from '../environments/environment';
import router from '../router'

const axiosConfig = {
  baseURL: `${environment.backendBaseUrl}/api`,
  timeout: 30000,
};

const userLogged = localStorage.getItem("user");
if (userLogged) {
  axiosConfig["headers"]= {
    Authorization: `Token ${JSON.parse(userLogged).token}`,
  }
}

let Axios = axios.create(axiosConfig);

Axios.interceptors.response.use((response) => response, (error) => {
  if (error.response.status === 403) {
    localStorage.removeItem("user");
    router.push("/login");
    throw error;
  }
  else throw error;
});

Vue.use(Vuex);

const state = {
  userInfo: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,

  subjects: [],

  error: null,
  loader: false,

  secondPair: false,  
  thirdPair: false,

  addPairButton: true,
  removePairButton: false,

  pairsValues: [{min: null, max: null}, {min: null, max: null}, {min: null, max: null}],

  coinsFromConst: [],

  pairsTo: [[], [], []],

  coinFrom: ["BTC", "BTC", "BTC"],
  coinTo: ["USD", "USD", "USD"],

  pairs: [{}],
  pairsCome: false,
  activePair: {},

  bestHour: 0,
  bestDay: 0,
  
  worstHour: 0,
  worstDay: 0, 

  onExchangeOpen: 0,
  onExchangeClose: 0,

  socketsUpdate: false
}

const getters = {
  userInfo: (state) => state.userInfo,
  error: (state) => state.error,
  secondPair: (state) => state.secondPair,
  thirdPair: (state) => state.thirdPair,
  addPairButton: (state) => state.addPairButton,
  removePairButton: (state) => state.removePairButton,
  pairsValues: (state) => state.pairsValues,
  coinsFromConst: (state) => state.coinsFromConst,
  pairsTo: (state) => state.pairsTo,
  coinFrom: (state) => state.coinFrom,
  coinTo: (state) => state.coinTo,
  pairs: (state) => state.pairs,
  pairsCome: (state) => state.pairsCome,
  activePair: (state) => state.activePair,
  bestHour: (state) => state.bestHour,
  bestDay: (state) => state.bestDay,
  worstHour: (state) => state.worstHour,
  worstDay: (state) => state.worstDay,
  onExchangeOpen: (state) => state.onExchangeOpen,
  onExchangeClose: (state) => state.onExchangeClose,
  socketsUpdate: (state) => state.socketsUpdate,
  loader: (state) => state.loader
}

const actions = {

  async login({ commit }, userData) {
    await Axios.post("/auth/login", userData)
      .then(response => {
        commit('SET_USER_INFO', {token: response.data.token, ...response.data.user});
        localStorage.setItem("user", JSON.stringify({token: response.data.token, ...response.data.user}));
        Axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      })
      
      .catch(err => {
        commit('ERROR', err.response.data.message) 
      })
  },

  async register({ commit }, userData) {
    await Axios.post("/auth/register", userData)
      .then(response => {
        commit('SET_USER_INFO', {token: response.data.token, ...response.data.user});
        localStorage.setItem("user", JSON.stringify({token: response.data.token, ...response.data.user}));
        Axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      })
      
      .catch(err => {
        commit('ERROR', err.response.data.message) 
      })
  },

  hideError({ commit }, hideError) {
    commit('ERROR', hideError);
  },

  async allSubjects({ commit }, hideError) {
    const {data} = await Axios.get(`/users/subjectsList`);
    commit('SET_SUBJECTS', data);
  },

  async fetchTableRep(_, params) {
    const {data} = await Axios.post(`/users/params`, params);
    return data;
  },

  async saveNewMaterialRep(_, material) {
    const {data} = await Axios.post(`/users/newMaterial`, { material });
    return data;
  },

  async deleteAccount(_, id) {
    const {data} = await Axios.post(`/users/deleteAccount`, { id });
    commit('SET_USER_INFO', {});
    localStorage.setItem("user", JSON.stringify({}));
    Axios.defaults.headers.common['Authorization'] = `Token `;
    return data;
  },

  async updateRepRating(_, info) {
    const {data} = await Axios.post(`/users/updateRepRating`, { info });
    return data;
  },

  async deleteMaterial(_, title) {
    const {data} = await Axios.post(`/users/deleteMaterial`, { title });
    return data;
  },

  async getRepInfo(_, idRep) {
    const {data} = await Axios.post(`/users/repInfo`, { id: idRep });
    return data;
  },

  async getUserInfoPop(_) {
    const {data} = await Axios.get(`/users/getUserInfoPop`);
    return data;
  },

  async acceptUser(_, userId) {
    const {data} = await Axios.post(`/users/acceptUser`, { id: userId });
    return data;
  },

  async rejectUser(_, userId) {
    const {data} = await Axios.post(`/users/rejectUser`, { id: userId });
    return data;
  },

  async rejectTeacher(_, userId) {
    const {data} = await Axios.post(`/users/rejectTeacher`, { id: userId });
    return data;
  },

  async removeUser(_, userId) {
    const {data} = await Axios.post(`/users/removeUser`, { id: userId });
    return data;
  },

  async removeTeacher(_, userId) {
    const {data} = await Axios.post(`/users/removeTeacher`, { id: userId });
    return data;
  },

  async addToFaivourites({ commit }, id) {
    await Axios.post("/users/addFav", { id })
      .then(response => {
        commit('SET_USER_INFO', {token: response.data.token, ...response.data.user});
        localStorage.setItem("user", JSON.stringify({token: response.data.token, ...response.data.user}));
        Axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      })
  },

  async updateUserInfo({ commit }) {
    await Axios.get("/users/updateUserInfo")
      .then(response => {
        commit('SET_USER_INFO', {token: response.data.token, ...response.data.user});
        localStorage.setItem("user", JSON.stringify({token: response.data.token, ...response.data.user}));
        Axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      })
  },

  async removeFromFaivourites({ commit }, id) {
    await Axios.post("/users/removeFav", { id })
      .then(response => {
        commit('SET_USER_INFO', {token: response.data.token, ...response.data.user});
        localStorage.setItem("user", JSON.stringify({token: response.data.token, ...response.data.user}));
        Axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      })
  },


  async logout({ commit }) {
      commit('SET_USER_INFO', {});
      localStorage.setItem("user", JSON.stringify({}));
      Axios.defaults.headers.common['Authorization'] = `Token `;
  },

  async becomeRep({ commit }, dataCome) {
    const {data} = await Axios.post(`/users/becomeRep`, dataCome);
    console.log('data', data);
    commit('SET_SUBJECTS', data);
  },

  async getCoinsBasic({ commit, state }) {
    commit('CHANGE_LOADER', true);
    const {data: {coins}} = await Axios.get(`/coins/coinsList`);
    const {data: {pairs}} = await Axios.get(`/coins/mapPair?coin=${state.coinFrom[0]}`);
    commit('SET_COINS_FROM_CONST', coins);
    commit('SET_PAIRSTO_ALL', pairs);
    commit('CHANGE_LOADER', false);
  },

  async loadUserPairs({ commit }) {
    commit('CHANGE_LOADER', true);
    const {data: {pairs}} = await Axios.get("/users/getPair");
      if (pairs && pairs.length !== 0) {
        if (pairs.length === 2) {
          commit("SET_SECOND_PAIR", true);
          commit("SET_REMOVE_PAIR", true);
        }

        if (pairs.length === 3) {
          commit("SET_SECOND_PAIR", true);
          commit("SET_REMOVE_PAIR", true);

          commit("SET_THIRD_PAIR", true);
          commit("SET_ADD_PAIR_BUTTON", false);
        }

        pairs.map((pair, index) => {
          commit("SET_COIN_FROM_INDEX", [pair.fsym, index]);
          commit("SET_COIN_TO_INDEX", [pair.tsym, index]);

          if (pair.min) commit("SET_PAIR_VALUES_INDEX_MIN", [pair.min, index]);
          if (pair.max) commit("SET_PAIR_VALUES_INDEX_MAX", [pair.max, index]);
        })
      }
      commit('CHANGE_LOADER', false);
  },

  async selectChanged({ commit }, option) {
    commit('CHANGE_LOADER', true);
    const {data: {pairs}} = await Axios.get(`/coins/mapPair?coin=${option.value}`);
    commit('SET_PAIRSTO_INDEX', [pairs, option.parent.number]);
    commit('SET_COINFROM_INDEX', [option.value, option.parent.number]);
    commit('SET_COINTO_INDEX', [pairs[0], option.parent.number]);
    commit('CHANGE_LOADER', false);
  },

  selectChangeDefault({ commit }, option) {
    commit('SET_COINTO_INDEX', [option.value, option.parent.number]);
  },

  addPairCheck({ commit, state }) {
    if (!state.secondPair) {
      commit("SET_SECOND_PAIR", true);
      commit("SET_REMOVE_PAIR", true);
    }
    else if (!state.thirdPair) {
      commit("SET_THIRD_PAIR", true);
      commit("SET_ADD_PAIR_BUTTON", false);
    }
  },

  removePairCheck({ commit, state }) {
    if (state.thirdPair) {
      commit("SET_THIRD_PAIR", false);
      commit("SET_ADD_PAIR_BUTTON", true);
    }
    else if (state.secondPair) {
      commit("SET_SECOND_PAIR", false);
      commit("SET_REMOVE_PAIR", false);
    }
  },

  changePairValues({ commit, state }, [index, symbol, type]) {
    if (type === "min") {
      if (symbol === "+") {
        const newVal = (parseFloat(state.pairsValues[index].min) + 0.1).toFixed(1);
        commit("SET_PAIR_VALUES_INDEX_MIN", [newVal, index]);
      }
      else {
        const newVal = (parseFloat(state.pairsValues[index].min) - 0.1).toFixed(1);
        commit("SET_PAIR_VALUES_INDEX_MIN", [newVal, index]);
      }
    }
    else {
      if (symbol === "+") {
        const newVal = (parseFloat(state.pairsValues[index].max) + 0.1).toFixed(1);
        commit("SET_PAIR_VALUES_INDEX_MAX", [newVal, index]);
      }
      else {
        const newVal = (parseFloat(state.pairsValues[index].max) - 0.1).toFixed(1);
        commit("SET_PAIR_VALUES_INDEX_MAX", [newVal, index])
      }
    }
  },

  async changeEmailNotification({ commit }, emailNotif) {
    await Axios.post("/users/changeEmailNotif", {emailNotif: emailNotif});

    const user = await JSON.parse(localStorage.getItem("user"));
    user.emailNotif = emailNotif;
    commit("SET_USER_INFO", user);
    localStorage.setItem("user", JSON.stringify(user));
  },

  async getDataForGraphic({ commit, state }, mount) {
    commit('CHANGE_LOADER', true);
    if (mount) {
      const {data: {pairs}} = await Axios.get("/users/getPair");
      let pairsState = state.pairs;

      await Promise.all( pairs.map(async (pair) => {
        pairsState.unshift(pair);
      }));
      pairsState.pop();
      pairsState.reverse();

      commit("SET_PAIRS", pairsState);
      commit("SET_PAIRS_COME", true);
      commit("SET_ACTIVE_PAIR", pairsState[0]);
    }

    const {data: {stats}} = await Axios.post("/coins/coinsStats", {pair: state.activePair});

    commit("SET_BEST_HOUR", stats.hourHigh);
    commit("SET_BEST_DAY", stats.dayHigh);
    commit("SET_WORST_HOUR", stats.hourLow);
    commit("SET_WORST_DAY", stats.dayLow);
    commit("SET_EXCHANGE_OPEN", stats.open);
    commit("SET_EXCHANGE_CLOSE", stats.close);

    commit("SET_SOCKETS_UPDATE", !state.socketsUpdate);
    commit('CHANGE_LOADER', false);
  },

  changeActivePairForGraphic({ commit }, newActivePair) {
    commit("SET_ACTIVE_PAIR", newActivePair);
  },

  async sendPairs({commit}, pairsObj) {
    await Axios.post("/users/addPair", pairsObj);
    const user = JSON.parse(localStorage.getItem("user"));
    user.emailNotif = pairsObj.emailNotif;
    commit("SET_USER_INFO", user);
    localStorage.setItem("user", JSON.stringify(user));
  },

  graphToDefault({commit}) {
    commit("SET_PAIRS", [{}]);
    commit("SET_PAIRS_COME", false);
    commit("SET_ACTIVE_PAIR", {});
  },

  logOutFromCurrency({ commit }) {
    localStorage.removeItem("user");
    Axios.defaults.headers.common['Authorization'] = `Token `;
    commit("SET_USER_INFO", null);
  }
}

const mutations = {
  SET_USER_INFO(state, user) {
    state.userInfo = user;
  },
  ERROR(state, error) {
    state.error = error;
  },
  SET_SUBJECTS(state, sub) {
    state.subjects = sub;
  },
  SET_COINS_FROM_CONST(state, coins) {
    state.coinsFromConst = coins;
  },
  SET_PAIRSTO_ALL(state, pairs) {
    state.pairsTo = state.pairsTo.fill(pairs);
  },
  SET_SECOND_PAIR(state, value) {
    state.secondPair = value;
  },
  SET_REMOVE_PAIR(state, value) {
    state.removePairButton = value;
  },
  SET_THIRD_PAIR(state, value) {
    state.thirdPair = value;
  },
  SET_ADD_PAIR_BUTTON(state, value) {
    state.addPairButton = value;
  },
  SET_COIN_FROM_INDEX(state, [fsym, index]) {
    state.coinFrom[index] = fsym;
  },
  SET_COIN_TO_INDEX(state, [tsym, index]) {
    state.coinTo[index] = tsym;
  },
  SET_PAIR_VALUES_INDEX_MIN(state, [min, index]) {
    state.pairsValues[index].min = min;
  },
  SET_PAIR_VALUES_INDEX_MAX(state, [max, index]) {
    state.pairsValues[index].max = max;
  },
  SET_PAIRSTO_INDEX(state, [pairs, index]) {
    state.pairsTo[index] = pairs;
  },
  SET_COINFROM_INDEX(state, [value, index]) {
    state.coinFrom[index] = value;
  },
  SET_COINTO_INDEX(state, [pairs, index]) {
    state.coinTo[index] = pairs;
  },
  SET_PAIRS(state, pairs) {
    state.pairs = pairs;
  },
  SET_PAIRS_COME(state, value) {
    state.pairsCome = value;
  },
  SET_ACTIVE_PAIR(state, pair) {
    state.activePair = pair;
  },
  SET_BEST_HOUR(state, stats) {
    state.bestHour = stats;
  },
  SET_BEST_DAY(state, stats) {
    state.bestDay = stats;
  },
  SET_WORST_HOUR(state, stats) {
    state.worstHour = stats;
  },
  SET_WORST_DAY(state, stats) {
    state.worstDay = stats;
  },
  SET_EXCHANGE_OPEN(state, stats) {
    state.onExchangeOpen = stats;
  },
  SET_EXCHANGE_CLOSE(state, stats) {
    state.onExchangeClose = stats;
  },
  SET_SOCKETS_UPDATE(state, updated) {
    state.socketsUpdate = updated;
  },
  CHANGE_LOADER(state, status) {
    state.loader = status;
  },
}

//export store module
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})