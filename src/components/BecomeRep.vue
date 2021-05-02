<template>
<div class="user-page" data-app>
  <PopUp :error="error" @hideModal="hideModal"/>
  <Loader :loader="loader"/>
  <VIcon style="position: absolute; top:20px; left:20px;" x-large color="#ffffff" @click="toUsersMain">mdi-arrow-left</VIcon>
  <VCard class="card" elevation="20" hover>
      <p style="font-size: 20px; margin: 30px 0; font-weight: bold">To become a repetitor fill this fields:</p>
      <VSelect 
        v-model="selectedSubject"
        :items="subjects"
        item-text="name"
        item-value="name"
        label="Subject *"
        hint="Choose a subject you want to teach"
        style="margin: 0 0 10px 0"
    ></VSelect>
    <VTextField
        v-model="expa"
        type="number"
        label="Experience *"
        hint="How long do you teach this subject"
        style="margin: 0 0 10px 0"
    ></VTextField>
    <VSelect 
        v-model="comeFrom"
        :items="['From friend', 'Instagram', 'Metro add', 'Tik-Tok', 'Other']"
        label="Come from?"
        hint="Please, share with us, where from did you hear about us :)"
        style="margin: 0 0 10px 0"
    ></VSelect>
    <VTextField
        v-model="about"
        label="Tell us more about you *"
        :rules="[v => v.length <= 25 || 'Max 25 characters']"
        counter="25"
        hint="Some info about your experience, interests, location"
        style="margin: 0 0 10px 0"
    ></VTextField>
    <VTextField
        v-model="phone"
        label="Phone number *"
        :rules="[v => v.length === 9 || 'Incorrect phone number']"
        type="number"
        counter="9"
        hint="Phone will be visible only to students you approved"
        style="margin: 0 0 10px 0"
        prefix="+375"
    >
    </VTextField>
    <VTextField
        :disabled="!selectedSubject"
        v-model="price"
        label="Price *"
        :hint="hint"
        persistent-hint
        style="margin: 10px auto 0 auto; width: 150px"
        :class="color"
        prefix="$"
    ></VTextField>
    <VCheckbox
    label="Email notifications"
    v-model="emailNotif"
    color="rgb(10, 195, 10)"
    hide-details
    style="margin-top: 80px; margin-bottom: 10px"
    ></VCheckbox>
     <VCheckbox
    label="Allow personal messages"
    v-model="personalMsg"
    color="rgb(10, 195, 10)"
    hide-details
    style="margin-top:0"
    ></VCheckbox>
    <VBtn
        :disabled="saveDisable"
        color="rgb(10, 195, 10)"
        style="margin: 0 0 0 350px"
        @click="sendSave"
    >Save</VBtn>
  </VCard>
</div>
</template>

<script>
import PopUp from './PopUp.vue'
import Loader from './Loader.vue'
import { mapGetters, mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'Login',
  data() {
      return {
          loader: false,
          selectedSubject: null,
          expa: 0,
          comeFrom: '',
          emailNotif: true,
          personalMsg: true,
          about: '',
          price: 0,
          phone: '',
      }
  },
  components: {
    PopUp,
    Loader,
  },
  methods: {
    ...mapActions({
      allSubjects: 'allSubjects',
      becomeRep: 'becomeRep',
      logOutFromCurrency: 'logOutFromCurrency',
    }),
    hideModal() {
      return;
    },
    toUsersMain() {
      this.$router.push("/user-main");
    },
    async sendSave() {
        await this.becomeRep({
            subject: this.selectedSubject,
            expa: this.expa,
            comeFrom: this.comeFrom,
            emailNotif: this.emailNotif,
            personalMsg: this.personalMsg,
            about: this.about,
            price: parseFloat(this.price),
            phone: phone,
        });
        await this.logOutFromCurrency();
        this.$router.push("/login");
    }
  },
  async mounted() {
    await this.allSubjects();
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'error'
    ]),
    ...mapState([
        'subjects',
    ]),
    color: function() {
        if (parseInt(this.price, 10) < 5 || !Boolean(this.price)) return 'error--text';
        const sub = this.subjects.find(sub => sub.name === this.selectedSubject);
        if (sub) {
            if (parseInt(this.price, 10) >= sub.averagePrice - 1 && parseInt(this.price, 10) <= sub.averagePrice + 1) return 'midPrice';
            if (parseInt(this.price, 10) > sub.averagePrice + 1) return 'highPrice';
            return 'lowPrice';
        }
        return 'error--text'
    },
    hint: function() {
        if (parseInt(this.price, 10) < 5 || !Boolean(this.price)) return 'Too low rate';
        const sub = this.subjects.find(sub => sub.name === this.selectedSubject);
        if (sub) {
            if (parseInt(this.price, 10) >= sub.averagePrice - 1 && parseInt(this.price, 10) <= sub.averagePrice + 1) return 'You have a middle rate';
            if (parseInt(this.price, 10) > sub.averagePrice + 1) return 'You have a high rate';
            return 'You have a low rate';
        }
        return 'Your hour rate'
    },
    saveDisable: function() {
        if (this.selectedSubject && this.expa && this.about.length <= 25 && this.price && parseInt(this.price, 10) >= 5 && this.phone.length === 9) return false;
        return true;
    }
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
.card {
   width: 500px;
   height: 750px;
   padding: 10px 20px;
   margin: auto;
   transition: all ease 0.5s;
}
.midPrice {
    color: orange !important;
}
.lowPrice {
    color: rgb(10, 195, 10) !important;
}
.highPrice {
    color: rgb(195, 67, 67) !important;
}
.error--text {
    color: red !important
}
</style>
