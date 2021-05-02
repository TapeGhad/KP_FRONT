<template>
<div class="user-page">
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <VIcon style="position: absolute; top:20px; left:20px;" x-large color="#ffffff" @click="toUsersMain">mdi-arrow-left</VIcon>
  <div class="rep-info-main">
    <VCard width="400" height="550" elevation="5" style="margin-right: 50px">
        <VCardTitle>Materials</VCardTitle>
        <VExpansionPanels accordion multiple style="border: 1px solid grey; border-width: 1px 0 0 0">
            <VExpansionPanel>
                <VExpansionPanelHeader>
                Topic 1
                </VExpansionPanelHeader>
                <VExpansionPanelContent style="background-color: grey">
                    <VCard style="margin: 5px 0">Part 1: Introduction</VCard>
                    <VCard>Part 2: Starting</VCard>
                </VExpansionPanelContent>
            </VExpansionPanel>
        </VExpansionPanels>
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
    <VCard 
        v-if="selectedRep"
        width="400"
        height="400"
        elevation="10"
        hover
        style="margin: 0 0 0 50px"
      >
        <div class="info_logo">P</div>
        <VCardTitle>Repetitor: {{ selectedRep.email }}</VCardTitle>
        <VCardSubtitle style="display: flex; flex-direction: row; align-items: center; font-weight: bold">Subject: 
          <VChip style="margin: 0 0 0 10px">{{ selectedRep.subject }}</VChip>
        </VCardSubtitle>
        <VTabs style="width: 100%; margin-top: 10px" fixed-tabs color="rgb(16, 165, 16)" v-model="tab">
          <VTab>Details</VTab>
          <VTab>About</VTab>
        </VTabs>
        <VTabsItems v-model="tab" style="max-height: 250px; overflow: auto">
          <VTabItem>
            <VCard
              flat
            >
            <VCardSubtitle class="card_details">Experience: {{ selectedRep.expa }} months</VCardSubtitle>
            <VCardSubtitle class="card_details" style="padding: 0 0 0 15px">Rating: 
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
            <VCardSubtitle class="card_details">Price: 
              <VChip outlined style="margin-left: 25px">{{ selectedRep.price }}$</VChip>
            </VCardSubtitle>
            <VCardSubtitle class="card_details">Phone: 
              <VChip outlined style="margin-left: 25px">+375{{ selectedRep.phone }}</VChip>
            </VCardSubtitle>
            <VCardSubtitle class="card_details">Private chat: 
               <VCheckbox
                :disabled="!selectedRep.personaMsg"
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
        <VBtn style="margin: 0 auto" outlined color="rgb(16, 165, 16)">Save</VBtn>
    </VCardActions>
  </VCard>
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
        getRepInfo: 'getRepInfo'
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
