<template>
<div class="user-page" data-app>
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <div style="display: flex; flex-direction: row; justify-content: space-between; margin: 0 20px 20px 0">
    <VBtn style="width: fit-content; padding: 10px 20px; margin-left: 20px;" @click="becomeRep">
      Become a repetitor
    </VBtn>
    <VChip
      style="font-weight: bold; font-size: 20px; padding: 10px 15px"
    >Online: {{usersOnline}}</VChip>
  </div>
  <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; height: fit-content">
    <VCarousel :height="400" :show-arrows="false" cycle style="width: 1000px; margin: 0 auto">
      <VCarouselItem
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        :show-arrows="false"
      ></VCarouselItem>
    </VCarousel>
    <div class="chat">
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
  <div style="display: flex; flex-direction: row; justify-content: space-around; align-items: center; height: fit-content; margin-top: 50px">
    <VDataTable
          :headers="headers"
          :items="itemsTable"
          class="elevation-1 table"
          :items-per-page="5"
          :options.sync="optionsTable"
          :footer-props="{
            itemsPerPageOptions: [5, 10],
          }"

          single-select
        >
        <template #item="{ item }">
            <tr
              @click="handleRowClickRep(item)"
            >
              <td>{{ item.email }}</td>
              <td>
                <VChip >
                    {{ item.subject }}
                </VChip>
              </td>
              <td>{{ item.expa }}</td>
              <td>
                <VRating
                  :value="parseFloat(item.rating, 10)"
                  color="rgb(255, 234, 44)"
                  background-color="rgb(78, 92, 78)"
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  half-icon="mdi-star-half-full"
                  half-increments
                  readonly
                  large
                ></VRating>
              </td>
              <td>
                <VChip>
                  <span class="text-center">
                    {{ item.price }}$
                  </span>
                </VChip>
              </td>
            </tr>
        </template>
      </VDataTable>
      <VCard 
        v-if="selectedRep"
        width="400"
        height="400"
        elevation="10"
        hover
        style="margin: 0 auto 0 20px"
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
        <VTabsItems v-model="tab" style="max-height: 200px; overflow: auto">
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
        <VBtn v-show="tab === 0 && inTeacher" color="rgb(16, 165, 16)" @click="goToRep" style="position: absolute; left: 10px; bottom: 5;">MORE</VBtn>
        <VBtn v-show="tab === 0 && !inFavourites && !inTeacher" fixed color="#FFC846" @click="addToFaivouritesCall">ADD TO FAVOIRITE</VBtn>
        <VBtn v-show="tab === 0 && inFavourites && !inTeacher" outlined fixed color="rgb(16, 165, 16)" @click="removeFromFaivouritesCall">
        <VIcon left>
          mdi-check
          </VIcon>
          IN FAVOURITES
        </VBtn>
      </VCard>
  </div>
</div>
</template>

<script>
import PopUp from './PopUp.vue'
import Loader from './Loader.vue'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'Login',
  data() {
      return {
          headers: [
            { text: 'Repetitor', align: 'left', value: 'displayName' },
            { text: 'Subject', value: 'subject' },
            { text: 'Expa', value: 'expa' },
            { text: 'Rating', value: 'rating' },
            { text: 'Price hour', value: 'price' }
          ],
          email: "",
          password: "",
          loader: false,
          tableSearchParams: {
            page: 1,
            itemsPerPage: 5,
            sortBy: [],
            sortDesc: [],
            groupBy: [],
            groupDesc: [],
            multiSort: false,
            mustSort: false
          },
          optionsTable: {
            page: 1,
            itemsPerPage: 5,
            sortBy: [],
            sortDesc: [],
            groupBy: [],
            groupDesc: [],
            multiSort: false,
            mustSort: false
          },
          itemsTable: [],
          message: '',
          tab: null,
          usersOnline: 0,
          allMessages: [],
          switch1: false,
          selectedRep: null,
          items: [
        {
          src: 'https://i.ytimg.com/vi/Kp2bYWRQylk/maxresdefault.jpg'
        },
        {
          src: 'https://fluencycorp.com/wp-content/uploads/2019/01/hardest-part-learning-english.jpg'
        },
        {
          src: 'https://i.pinimg.com/originals/54/28/54/5428546ee0575a445a44b997988de1f1.jpg'
        },
        {
          src: 'https://ecetadda.com/wp-content/uploads/2020/12/CHEMISTRY.jpg'
        },
        {
          src: 'https://media-exp1.licdn.com/dms/image/C511BAQE0cVYmg8QN0g/company-background_10000/0/1581481407499?e=2159024400&v=beta&t=tp4fzua9GkgJLUYXf0JEMnIBFCM-wlKKDnIuiqfnJbc'
        }
      ]
      }
  },
  components: {
    PopUp,
    Loader,
  },
  methods: {
    ...mapActions({
      fetchTableRep: "fetchTableRep",
      addToFaivourites: 'addToFaivourites',
      hideError: 'hideError',
      removeFromFaivourites: 'removeFromFaivourites',
      updateUserInfo: 'updateUserInfo',
    }),
    handleRowClickRep(item) {
      this.selectedRep = item;
    },
    hideModal() {
      this.hideError(null);
    },
    goToRep() {
      this.$router.push(`/repetitor/${this.selectedRep.id}`);
    },
    addToFaivouritesCall() {
      this.addToFaivourites(this.selectedRep.id);
    },
    removeFromFaivouritesCall() {
      this.removeFromFaivourites(this.selectedRep.id);
    },
    formatDate(date) {
      return moment(date).format('h:mm:ss');
    },
    sendMessage() {
      if (this.message) this.$socket.emit('message', this.message, this.userInfo.email);
      this.message = '';
    },
    becomeRep() {
       this.$router.push("/become-rep");
    }
  },
  mounted() {
    this.sockets.subscribe(`chatUpdate`, (message) => {
      this.allMessages.push(message);
    });
    this.sockets.subscribe(`allChat`, (messages) => {
      this.allMessages = messages;
    });
    this.sockets.subscribe(`usersOnline`, (users) => {
      this.usersOnline = users;
    });
    this.$socket.emit('getChat');
    this.$socket.emit('usersOnlineCheck');
    this.updateUserInfo();

  },
  computed: {
    ...mapGetters([
      'userInfo',
      'error'
    ]),
    inFavourites: function () {
      return this.userInfo.faivourites.includes(this.selectedRep.id);
    },
    inTeacher: function () {
      return this.userInfo.teachers.includes(this.selectedRep.id);
    }
  },
  watch: {
    "userInfo": {
      handler: function(val, oldVal) {}
    },
    optionsTable: {
      handler: async function(val, oldVal) {
        const data = await this.fetchTableRep({params: val, user: 'rep'});
        this.itemsTable = data;
        if (data.length > 0) this.selectedRep = data[0];
        else this.selectedRep = null;
      }
    }
  }
}
</script>

<style>
span {
  border: none;
}

.card_details {
  display: flex;
  font-weight: bold !important;
  flex-direction: row;
  align-items: center; 
  padding: 10px 0 10px 15px;
}
.chat {
  width: 500px;
  height: 400px;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 10px 15px;
  margin: 10px auto;
}
.chat-messages {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 80%;
  max-height: 80%;
  overflow: auto;
}
.chat-mes {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  height: 50px;
  border: 1px solid black;
  border-width: 1px 0;
}
.alert {
  margin: 0 auto;
  z-index: 100;
  cursor: pointer;
  background-color: rgb(16, 165, 16) !important;
}

.info_logo {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 10px;
  right: 10px;
  width: 80px;
  height: 80px;
  color: #ffffff;
  font-size: 35px;
  border: 1px solid rgb(95, 95, 95);
  border-radius: 100% !important;
  background-color: grey;
}

.switch {
  margin: 0 auto;
}
.user-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100vw;
  height: 100vh;
}

.table {
  margin: 0 20px 0 auto;
  width: 800px;
  padding: 20px;
}
</style>
