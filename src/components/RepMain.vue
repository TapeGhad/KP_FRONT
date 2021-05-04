<template>
<div class="user-page" data-app>
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <VIcon style="position: absolute; top:20px; left:20px;" x-large color="#ffffff" @click="toUsersMain">mdi-arrow-left</VIcon>
  <VDialog 
    v-model="isOpenAddMaterial" 
    persistent
    width="400"
  >
    <VCard style="padding: 20px">
      <VCardTitle>Add new material</VCardTitle>
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
      <VBtn text @click="isOpenAddMaterial = false">Close</VBtn>
      <VBtn
        :disabled="!titleNewMaterial || !amountNewMaterial || amountNewMaterial.length >= 2"
        color="rgb(16, 165, 16)"
        style="color: #ffffff"
        @click="goToAddParts">Next</VBtn>
    </VCard>
  </VDialog>
  <VDialog 
    v-model="isOpenAddParts" 
    persistent
    width="400"
  >
    <VCard v-if="amountNewMaterial" style="padding: 20px">
      <VCardTitle>Add parts for {{ titleNewMaterial }}</VCardTitle>
      <VCardActions v-for="(n, index) in parseInt(amountNewMaterial)" :key="index">
        <VTextField v-model="newParts[index]" label="Name of part"/>
      </VCardActions>
      <VBtn text @click="backToMaterial">Back</VBtn>
      <VBtn 
        :disabled="parseInt(amountNewMaterial) !== newParts.length"
        color="rgb(16, 165, 16)"
        style="color: #ffffff"
        @click="saveNewMaterial"
      >Save</VBtn>
    </VCard>
  </VDialog>
  <div v-if="selectedRep" class="rep-info-main">
    <VCard width="400" height="550" elevation="5" style="margin-right: 50px">
      <VIcon style="position: absolute; top:10px; right:10px; cursor: pointer" large color="#525252" @click="addMaterial">mdi-plus</VIcon>
        <VCardTitle>Materials</VCardTitle>
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
            <VCardText v-if="selectedRep.materials.length === 0"> No materials yet</VCardText>
        </VExpansionPanels>
    </VCard>
    <VCard width="400" height="550" elevation="5" style="margin-right: 50px">
        <VCardTitle>Users</VCardTitle>
        <VCard v-for="(material, index) in selectedRep.materials" :key="index">
          <VCardText style="text-align: left; font-size: 18px">{{ material.title }}</VCardText>
          <VIcon style="position: absolute; top:10px; right:20px; color: red" @click.stop="rejectUser()">mdi-close</VIcon>
          <VIcon style="position: absolute; top:10px; right:70px; color: rgb(16, 165, 16)" @click.stop="acceptUser()">mdi-check</VIcon>
        </VCard>
    </VCard>
     <div class="chat" style="margin: 0">
      <div class="chat-messages">
        <div v-for="message in allMessages" :key="`${message.date}${message.message}`" class="chat-mes">
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
        :disabled="message.length === 0"
        :color="message.length !== 0 ? 'rgb(78 230 78)' : ''"
        @click="sendMessage"
      >Send</VBtn>
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
          loader: false,
          allMessages: [],
          message: '',
          selectedRep: null,
          tab: null,
          rating: null,
          isOpenAddMaterial: false,
          isOpenAddParts: false,
          titleNewMaterial: '',
          amountNewMaterial: '',
          newParts: [],
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
    }),
    toUsersMain() {
      this.$router.push("/user-main");
    },
     hideModal() {
      this.hideError(null);
    },
    sendMessage() {
        consile.log(this.message);
    },
    addMaterial() {
      this.isOpenAddMaterial = true;
    },
    async deleteMaterialCall(title) {
      await this.deleteMaterial(title);
      this.selectedRep = await this.getRepInfo(this.userInfo.id);
    },
    goToAddParts() {
      this.isOpenAddMaterial = false;
      this.isOpenAddParts = true;
    },
    rejectUser() {
      console.log('rejectUser');
    },
    acceptUser() {
      console.log('acceptUser');
    },
    backToMaterial() {
      this.isOpenAddMaterial = true;
      this.isOpenAddParts = false;
      this.newParts = [];
    },
    async saveNewMaterial() {
      await this.saveNewMaterialRep({
        title: this.titleNewMaterial,
        parts: this.newParts
      });
      this.isOpenAddParts = false;
      this.selectedRep = await this.getRepInfo(this.userInfo.id);
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
