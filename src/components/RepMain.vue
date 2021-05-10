<template>
<div class="user-page" data-app>
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <VIcon style="position: absolute; top:20px; left:20px;" x-large color="#ffffff" @click="toUsersMain">mdi-arrow-left</VIcon>
  <VBtn style="position: absolute; top:20px; right:20px;" color="#ffffff" @click="toGraphRep">График</VBtn>
  <VBtn style="position: absolute; bottom:20px; right:20px;color: white" color="rgba(255, 0, 0, 1)" @click="deleteAccountCall">Delete account</VBtn>
  <VDialog 
    v-model="isOpenAddMaterial" 
    persistent
    width="400"
  >
    <VCard style="padding: 20px">
      <VCardTitle>Новый материал</VCardTitle>
      <VCardActions>
        <VTextField v-model="titleNewMaterial" label="Title of material"/>
      </VCardActions>
      <VCardActions>
        <VTextField 
          v-model="amountNewMaterial"
          label="Total amount of parts"
          type="number"
          counter="1"
        />
      </VCardActions>
      <VBtn text @click="isOpenAddMaterial = false">Закрыть</VBtn>
      <VBtn
        :disabled="!titleNewMaterial || !amountNewMaterial || amountNewMaterial.length >= 2"
        color="rgb(16, 165, 16)"
        style="color: #ffffff"
        @click="goToAddParts">Далее</VBtn>
    </VCard>
  </VDialog>
  <VDialog 
    v-model="isOpenAddParts" 
    persistent
    width="400"
  >
    <VCard v-if="amountNewMaterial" style="padding: 20px">
      <VCardTitle>Добавть части к {{ titleNewMaterial }}</VCardTitle>
      <VCardActions v-for="(n, index) in parseInt(amountNewMaterial)" :key="index">
        <VTextField v-model="newParts[index]" label="Name of part"/>
      </VCardActions>
      <VBtn text @click="backToMaterial">Назад</VBtn>
      <VBtn 
        :disabled="parseInt(amountNewMaterial) !== newParts.length"
        color="rgb(16, 165, 16)"
        style="color: #ffffff"
        @click="saveNewMaterial"
      >Сохранить</VBtn>
    </VCard>
  </VDialog>
  <div v-if="selectedRep" class="rep-info-main">
    <VCard width="400" height="550" elevation="5" style="margin-right: 50px">
      <VIcon style="position: absolute; top:10px; right:10px; cursor: pointer" large color="#525252" @click="addMaterial">mdi-plus</VIcon>
        <VCardTitle>Материалы</VCardTitle>
        <VExpansionPanels accordion multiple style="border: 1px solid grey; border-width: 1px 0 0 0">
            <VExpansionPanel v-for="(material, index) in selectedRep.materials" :key="index">
                <VExpansionPanelHeader>
                {{ material.title }}
                <VIcon style="position: absolute; top:10px; right:20px;" @click.stop="deleteMaterialCall(material.title)">mdi-delete</VIcon>
                </VExpansionPanelHeader>
                <VExpansionPanelContent style="background-color: grey">
                    <VCard 
                      v-for="(part, pIndex) in material.parts"
                      :key="pIndex"
                      style="margin: 3px 0"
                    >{{ part }}</VCard>
                </VExpansionPanelContent>
            </VExpansionPanel>
            <VCardText v-if="selectedRep.materials.length === 0">Нету материалов</VCardText>
        </VExpansionPanels>
    </VCard>
    <VCard width="400" height="550" elevation="5" style="margin-right: 50px">
        <VCardTitle>Запросы ({{ selectedRep.faivouritesStud.length }})</VCardTitle>
        <div style="max-height: 150px; overflow: auto">
          <div v-if="selectedRep.faivouritesStud.length">
            <VCard v-for="(user, index) in selectedRep.faivouritesStud" :key="index">
              <VCardText style="text-align: left; font-size: 18px">{{ user.email }}</VCardText>
              <VIcon style="position: absolute; top:10px; right:20px; color: red" @click.stop="rejectUserCall(user.id)">mdi-close</VIcon>
              <VIcon style="position: absolute; top:10px; right:70px; color: rgb(16, 165, 16)" @click.stop="acceptUserCall(user.id)">mdi-check</VIcon>
            </VCard>
          </div>
          <VCardText v-else>Нету пользователей</VCardText>
        </div>
        <VCardTitle>Ученики ({{selectedRep.currentStud.length}})</VCardTitle>
        <div style="max-height: 250px; overflow: auto">
          <div v-if="selectedRep.currentStud.length">
            <VCard v-for="(user, index) in selectedRep.currentStud" :key="index">
              <VCardText style="text-align: left; font-size: 18px">{{ user.email }}</VCardText>
              <VIcon style="position: absolute; top:10px; right:20px; color: red" @click.stop="removeUserCall(user.id)">mdi-delete</VIcon>
            </VCard>
          </div>
          <VCardText v-else>Нету пользователей</VCardText>
        </div>
    </VCard>
     <div class="chat" style="margin: 0">
      <div class="chat-messages" v-if="isChat">
        <VTabs v-model="chatTab">
          <VTab v-for="(user, index) in selectedRep.currentStud" :key="index" :style="{ 'background-color': tabColors[index]}" @click="tabColors[index] = '#ffffff'">{{ user.email }}</VTab>
        </VTabs>
        <VTabsItems v-model="chatTab">
          <VTabItem v-for="(user, index) in selectedRep.currentStud" :key="index">
            <VCard style="height: 250px; overflow: auto">
              <div v-for="(message, index) in allMessages[user.email]" :key="index" class="chat-mes">
                <p style="margin: auto 10px auto 0; border: 1px solid black; border-width: 0 1px 0 0; height: 100%">{{ formatDate(message.date) }}</p>
                <div style="display: flex; flex-direction: column; align-items: flex-start">
                  <p>{{ message.name}}</p>
                  <p>{{ message.message }}</p>
                </div>
              </div>
            </VCard>
          </VTabItem>
        </VTabsItems>
      </div>
      <input type="text" v-model="message" style="color: black; border: 1px solid black; height: 40px"/>
      <VBtn
        elevation="2"
        :disabled="message.length === 0 || !selectedRep.personalMsg"
        :color="message.length !== 0 ? 'rgb(78 230 78)' : ''"
        @click="sendMessage"
      >Отправить</VBtn>
    </div>
  </div>
</div>
</template>

<script>
import PopUp from './PopUp.vue'
import Loader from './Loader.vue'
import { mapGetters } from 'vuex'
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'Login',
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
        saveNewMaterialRep: 'saveNewMaterialRep',
        deleteMaterial: 'deleteMaterial',
        getFaivouritesStud: 'getFaivouritesStud',
        acceptUser: 'acceptUser',
        rejectUser: 'rejectUser',
        removeUser: 'removeUser',
        deleteAccount: 'deleteAccount',
    }),
    toUsersMain() {
      this.$router.push("/user-main");
    },
    toGraphRep() {
      this.$router.push(`/repGraph/${this.selectedRep._id}`);
    },
     hideModal() {
      this.hideError(null);
    },
    deleteAccountCall() {
      this.deleteAccount(this.selectedRep._id);
      this.$router.push(`/login`);
    },
    formatDate(date) {
      return moment(date).format('h:mm:ss');
    },
    sendMessage() {
      this.$socket.emit('personalMsg', { to: this.selectedRep.currentStud[this.chatTab].email, from: this.userInfo.email, text: this.message});
      this.isChat = false;
      this.allMessages[this.selectedRep.currentStud[this.chatTab].email].push({ name: this.userInfo.email, message: this.message, date: Date.now()});
      this.isChat = true;
      this.message = '';
    },
    addMaterial() {
      this.isOpenAddMaterial = true;
    },
    async deleteMaterialCall(title) {
      this.loader = true;
      await this.deleteMaterial(title);
      this.selectedRep = await this.getRepInfo(this.userInfo.id);
      this.loader = false;
    },
    goToAddParts() {
      this.isOpenAddMaterial = false;
      this.isOpenAddParts = true;
    },
    async rejectUserCall(userId) {
      this.loader = true;
      await this.rejectUser(userId);
      this.selectedRep = await this.getRepInfo(this.userInfo.id);
      this.loader = false;
    },
    async removeUserCall(userId) {
      this.loader = true;
      await this.removeUser(userId);
      this.selectedRep = await this.getRepInfo(this.userInfo.id);
      this.loader = false;
    },
    async acceptUserCall(userId) {
      this.loader = true;
      await this.acceptUser(userId);
      this.selectedRep = await this.getRepInfo(this.userInfo.id);
      this.loader = false;
    },
    backToMaterial() {
      this.isOpenAddMaterial = true;
      this.isOpenAddParts = false;
      this.newParts = [];
    },
    async saveNewMaterial() {
      this.loader = true;
      await this.saveNewMaterialRep({
        title: this.titleNewMaterial,
        parts: this.newParts
      });
      this.isOpenAddParts = false;
      this.selectedRep = await this.getRepInfo(this.userInfo.id);
      this.loader = false;
    }
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
    this.selectedRep.currentStud.map(async stud => {
      this.allMessages[stud.email] = [];
      this.tabColors.push('#ffffff');
    });
    this.sockets.subscribe('personalMsg', async (message) => {
        if (message.to === this.userInfo.email) {
          this.isChat = false;
          this.tabColors[this.selectedRep.currentStud.findIndex(elem => elem.email === message.from)] = 'yellow';
          await this.allMessages[message.from].push({ name: message.from, message: message.text, date: Date.now()});
          this.isChat = true;
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
