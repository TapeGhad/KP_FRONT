<template>
<div class="user-page">
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <!-- <VAlert
  class="alert"
    width="200"
    dense
    elevation="10"
    type="success"
  >Switch is {{ switch1 === true ? 'on' : 'off'}}
  </VAlert>
  <VSwitch
    class="switch"
    v-model="switch1"
    inset
    color="rgb(78 230 78)"
    :label="`Switch 1`"
    ></VSwitch> -->
   <VCarousel :height="400" :show-arrows="false" cycle style="width: 1000px; margin: 0 auto">
      <VCarouselItem
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
        :show-arrows="false"
      ></VCarouselItem>
    </VCarousel>
  <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; height: fit-content">
    <VDataTable
        :headers="headers"
        :items="[{ name: 'Test', subject: 'Math', yearsOld: 28, expa: 5, price: 17},
        { name: 'Test', subject: 'Math', yearsOld: 28, expa: 5, price: 17},
        { name: 'Test', subject: 'Math', yearsOld: 28, expa: 5, price: 17},
        { name: 'Test', subject: 'Math', yearsOld: 28, expa: 5, price: 17},
        { name: 'Test', subject: 'Math', yearsOld: 28, expa: 5, price: 17},]"
        :options.sync="tableSearchParams"
        class="elevation-1 table"
        :loading="true"
        :server-items-length="5"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5],
        }"
        single-select
      >
      <template #item="{ item }">
          <tr
            @click="handleRowClickPackage(item)"
          >
            <td>{{ item.name }}</td>
            <td>
              <VChip >
                  {{ item.subject }}
              </VChip>
            </td>
            <td>{{ item.yearsOld }}</td>
            <td>{{ item.expa }}</td>
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
    <div class="chat">
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
          headers: [
            { text: 'Repetitor', align: 'left', value: 'displayName' },
            { text: 'Subject', value: 'subject' },
            { text: 'Years old', value: 'yearsOld' },
            { text: 'Experience', value: 'expa' },
            { text: 'Price hour', value: 'price' }
          ],
          email: "",
          password: "",
          loader: false,
          tableSearchParams: {
            page: 1,
            itemsPerPage: 10,
            sortBy: [],
            sortDesc: [],
            groupBy: [],
            groupDesc: [],
            multiSort: false,
            mustSort: false
          },
          message: '',
          switch1: false,
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
    hideModal() {
      return;
    },
    sendMessage() {
      this.$socket.emit('message', this.message)
    },
  },
  mounted() {
    this.sockets.subscribe(`chatUpdate`, (message) => {
      console.log('SOCKET SERVE', message)
    });
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
    },
    tableSearchParams: {
      handler: function(val, oldVal) {
        console.log(val);
      }
    }
  }
}
</script>

<style>
span {
  border: none;
}
.chat {
  width: 500px;
  height: 400px;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 10px 15px;
  margin: 10px auto;
}
.alert {
  margin: 0 auto;
  z-index: 100;
  cursor: pointer;
  background-color: rgb(16, 165, 16) !important;
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
  margin: 50px auto;
  width: 800px;
  padding: 20px;
}
</style>
