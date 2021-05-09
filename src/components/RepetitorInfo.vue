<template>
<div class="user-page">
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <VIcon style="position: absolute; top:20px; left:20px;" x-large color="#ffffff" @click="toUsersMain">mdi-arrow-left</VIcon>
  <div class="rep-info-main" v-if="selectedRep">
     <VCard width="400" height="550" elevation="5" style="margin-right: 50px">
        <VCardTitle>Материалы</VCardTitle>
        <VExpansionPanels accordion multiple style="border: 1px solid grey; border-width: 1px 0 0 0">
            <VExpansionPanel v-for="(material, index) in selectedRep.materials" :key="index">
                <VExpansionPanelHeader>
                {{ material.title }}
                </VExpansionPanelHeader>
                <VExpansionPanelContent style="background-color: grey">
                    <VCard 
                      v-for="(part, pIndex) in material.parts"
                      :key="pIndex"
                      style="margin: 3px 0"
                    >{{ part }}</VCard>
                </VExpansionPanelContent>
            </VExpansionPanel>
            <VCardText v-if="selectedRep.materials.length === 0"> Пока нет материалов</VCardText>
        </VExpansionPanels>
    </VCard>
     <div class="chat" style="margin: 0">
      <div class="chat-messages">
        <div v-for="(message, index) in allMessages" :key="index" class="chat-mes">
          <p style="margin: auto 10px auto 0; border: 1px solid black; border-width: 0 1px 0 0; height: 100%">{{ formatDate(message.date) }}</p>
          <div style="display: flex; flex-direction: column; align-items: flex-start">
            <p>{{ message.name}}</p>
            <p>{{ message.message }}</p>
          </div>
        </div>
      </div>
      <input type="text" v-model="message" style="color: black; border: 1px solid black; height: 40px"/>
      <VBtn
        elevation="2"
        :disabled="message.length === 0 || !selectedRep.personalMsg"
        :color="message.length !== 0 ? 'rgb(78 230 78)' : ''"
        @click="sendMessage"
      >Отправить</VBtn>
    </div>
    <VCard 
        v-if="selectedRep"
        width="400"
        height="400"
        elevation="10"
        hover
        style="margin: 0 0 0 50px"
      >
        <div class="info_logo">P</div>
        <VCardTitle>Репетитор: {{ selectedRep.email }}</VCardTitle>
        <VCardSubtitle style="display: flex; flex-direction: row; align-items: center; font-weight: bold">Предмет: 
          <VChip style="margin: 0 0 0 10px">{{ selectedRep.subject }}</VChip>
        </VCardSubtitle>
        <VTabs style="width: 100%; margin-top: 10px" fixed-tabs color="rgb(16, 165, 16)" v-model="tab">
          <VTab>Детали</VTab>
          <VTab>Подробнее</VTab>
        </VTabs>
        <VTabsItems v-model="tab" style="max-height: 350px; overflow: auto">
          <VTabItem>
            <VCard
              flat
            >
            <VCardSubtitle class="card_details">Опыт: {{ selectedRep.expa }} месяцев</VCardSubtitle>
            <VCardSubtitle class="card_details" style="padding: 0 0 0 15px">Рейтинг: 
              <VRating
                  :value="parseFloat(selectedRep.rating)"
                  color="rgb(255, 234, 44)"
                  background-color="rgb(78, 92, 78)"
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  half-icon="mdi-star-half-full"
                  half-increments
                  size="25"
                  readonly
                  style="margin-left: 10px"
                ></VRating>
            </VCardSubtitle>
            <VCardSubtitle class="card_details">Цена: 
              <VChip outlined style="margin-left: 25px">{{ selectedRep.price }}$</VChip>
            </VCardSubtitle>
            <VCardSubtitle class="card_details">Норер: 
              <VChip outlined style="margin-left: 25px">+375{{ selectedRep.phone }}</VChip>
            </VCardSubtitle>
            <VCardSubtitle class="card_details">Приватный чат: 
               <VCheckbox
                :value="selectedRep.personalMsg"
                disabled
                color="rgb(10, 195, 10)"
                hide-details
                style="margin: 0 0 0 10px; padding: 0"
                ></VCheckbox>
            </VCardSubtitle>
            </VCard>
          </VTabItem>
          <VTabItem>
            <VCard
              flat
            >
            <VCardText>{{ selectedRep.about }}</VCardText>
            </VCard>
          </VTabItem>
        </VTabsItems>
      </VCard>
  </div>
  <VCard width="300" style="margin: 0 auto">
      <VRating
        v-model="rating"
        color="rgb(255, 234, 44)"
        background-color="rgb(78, 92, 78)"
        empty-icon="mdi-star-outline"
        full-icon="mdi-star"
        half-icon="mdi-star-half-full"
        half-increments
        size="35"
        style="margin-left: 10px"
    ></VRating>
    <VCardActions v-if="rating">
        <VBtn style="margin: 0 auto" outlined color="rgb(16, 165, 16)" @click="saveRating">Сохранить</VBtn>
    </VCardActions>
  </VCard>
</div>
</template>

<script>
import PopUp from './PopUp.vue'
import Loader from './Loader.vue'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'Login',
  data() {
      return {
          email: "",
          password: "",
          loader: false,
          allMessages: [],
          message: '',
          selectedRep: null,
          tab: null,
          rating: null,
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
        updateRepRating: 'updateRepRating'
    }),
    toUsersMain() {
      this.$router.push("/user-main");
    },
     hideModal() {
      this.hideError(null);
    },
    sendMessage() {
      this.$socket.emit('personalMsg', { to: this.selectedRep.email, from: this.userInfo.email, text: this.message});
      this.allMessages.push({ name: this.userInfo.email, message: this.message, date: Date.now()})
      this.message = '';
    },
    formatDate(date) {
      return moment(date).format('h:mm:ss');
    },
    async saveRating() {
      this.loader = true;
      await this.updateRepRating({ rating: this.rating, rep: this.selectedRep._id });
      this.selectedRep = await this.getRepInfo(this.idRep);
      this.loader = false;
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
      handler: function(val, oldVal) {}
    }
  },
  async mounted() {
    this.selectedRep = await this.getRepInfo(this.idRep);
    this.sockets.subscribe('personalMsg', (message) => {
      if (message.to === this.userInfo.email) {
        this.allMessages.push({ name: message.from, message: message.text, date: Date.now()});
      }
    });
  }
}
</script>

<style>
.rep-info-main {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>
