<template>
<div class="user-page" data-app>
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <VIcon style="position: absolute; top:20px; left:20px;" x-large color="#ffffff" @click="toRepMain">mdi-arrow-left</VIcon>
  <p style="color: white; font-size: 20px; margin: 20px">График вашего рейтинга</p>
  <canvas id="chart"></canvas>
</div>
</template>

<script>
import Chart from 'chart.js';
import ChartData from './chart-data.js'
import PopUp from './PopUp.vue'
import Loader from './Loader.vue'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'RepetitorGraph',
  data() {
      return {
          email: "",
          password: "",
          allMessages: [],
          loader: false,
          message: '',
          selectedRep: null,
          tab: null,
          rating: null,
          isOpenAddMaterial: false,
          isOpenAddParts: false,
          titleNewMaterial: '',
          amountNewMaterial: '',
          newParts: [],
          chatTab: null,
          isChat: true,
          tabColors: [],
          chartData: { ...ChartData }
      }
  },
  props: {
      idRep: {
          type: String,
          required: true,
      }
  },
  components: {
    PopUp,
    Loader
  },
  methods: {
    ...mapActions({
        hideError: 'hideError',
        getRepInfo: 'getRepInfo',
    }),
    toRepMain() {
      this.$router.push("/rep-main");
    },
    toGraphRep() {
      this.$router.push(`/repGraph/${idRep}`);
    },
    hideModal() {
      this.hideError(null);
    },
    formatDate(date) {
      return moment(date).format('h:mm:ss');
    },
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'error'
    ]),
  },
  watch: {
    "userInfo": {
      handler: function(val, oldVal) {}
    }
  },
  async mounted() {
    this.selectedRep = await this.getRepInfo(this.userInfo.id);
    this.selectedRep.ratingHistory.map(rating => {
        this.chartData.data.labels.push(moment(rating.date).format('DD.MM.YYYY HH:mm'));
        this.chartData.data.datasets[0].data.push(rating.rating);
    });
    const ctx = document.getElementById('chart');
    new Chart(ctx, this.chartData);
  },
  beforeDestroy() {
     this.chartData.data.labels = [];
     this.chartData.data.datasets[0].data = [];
  }
}
</script>

<style>
.rep-info-main {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.small {
    max-width: 600px;
    margin:  150px auto;
}

#chart {
    max-width: 1200px;
    background-color: #ffffff;
    margin: 0 auto;
}
</style>
