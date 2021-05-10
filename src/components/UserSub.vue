<template>
<div class="user-page">
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <VIcon style="position: absolute; top:20px; left:20px;" x-large color="#ffffff" @click="toUsersMain">mdi-arrow-left</VIcon>
  <div v-if="getUserInfoPop" style="display: flex; flex-direction: row; justify-content: center;">
    <VCard width="400" style="margin: 0 50px 0 0">
      <VCardTitle>Подписки ({{ userInfoPop.faivourites.length }})</VCardTitle>
      <VCard v-for="(user, index) in userInfoPop.faivourites" :key="index">
        <VCardText style="text-align: left; font-size: 18px">{{ user.email }}</VCardText>
        <VIcon style="position: absolute; top:10px; right:20px; color: red" @click.stop="rejectTeacherCall(user.id)">mdi-close</VIcon>
      </VCard>
    </VCard>
    <VCard width="400">
        <VCardTitle>Учителя ({{ userInfoPop.teachers.length }})</VCardTitle>
        <VCard v-for="(user, index) in userInfoPop.teachers" :key="index">
            <VCardText style="text-align: left; font-size: 18px">{{ user.email }}</VCardText>
            <VIcon style="position: absolute; top:10px; right:20px; color: red" @click.stop="removeTeacherCall(user.id)">mdi-delete</VIcon>
        </VCard>
    </VCard> 
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
          userInfoPop: null,
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
        updateUserInfo: 'updateUserInfo',
        removeTeacher: 'removeTeacher',
        rejectTeacher: 'rejectTeacher',
        getUserInfoPop: 'getUserInfoPop',
    }),
    toUsersMain() {
      this.$router.push("/user-main");
    },
    async removeTeacherCall(id) {
      await this.removeTeacher(id);
      this.userInfoPop = await this.getUserInfoPop();
    },
    async rejectTeacherCall(id) {
      await this.rejectTeacher(id);
      this.userInfoPop = await this.getUserInfoPop();
    },
     hideModal() {
      this.hideError(null);
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
    this.updateUserInfo();
    this.userInfoPop = await this.getUserInfoPop();
    console.log(this.userInfoPop);
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
