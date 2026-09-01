<template>
  <div>
    <div style="width: 100%; max-height: 300px; overflow: hidden">
      <v-img :src="bannerImg" />
    </div>
    <v-row class="text-center" no-gutters>
      <v-col cols="12" md="4">
        <v-row>
          <v-col>
            <v-img :src="logoImg" width="80%" class="mx-auto" />
            <p class="px-2">Bronx Aerospace High School</p>
          </v-col>
          <v-col>
            <p class="ma-0 mt-4">created by:</p>
            <p class="mb-0 font-weight-bold">{{ creatorName }}</p>
            <p class="mb-4">
              visit me on <a :href="linkedIn" target="_blank">LinkedIn</a>
            </p>
            <v-img :src="creatorImg" style="border-radius: 50%" width="50%" class="mx-auto" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="8">
        <h2 class="d-none d-md-block text-center my-4">NYC Job Interest Survey</h2>
        <h3 class="d-md-none text-center my-4">NYC Job Interest Survey</h3>
        <div class="container">
          <p class="text-left">
            Welcome to the job interest survey! The purpose of this survey is to obtain
            information about what job you may be interested interested when you enter your work
            life. <span class="font-weight-bold">This poll is anonymous.</span>
          </p>

          <v-autocomplete
            v-model="selectedSchool"
            :items="schoolList"
            label="select your high school"
            item-value="SchoolID"
            item-title="SchoolName"
            return-object
            clearable
            variant="outlined"
            class="mb-4"
          >
            <template #no-data>
              <v-list-item title="No results" class="text-grey" />
            </template>
          </v-autocomplete>

          <v-row no-gutters align="center">
            <v-col cols="9">
              <v-text-field
                v-model="email"
                label="enter your email address"
                variant="outlined"
                @focus="emailError = false"
                @keyup.enter="go"
              />
            </v-col>
            <v-col cols="3">
              <v-btn color="primary" class="ml-4" @click="go">Go</v-btn>
            </v-col>
          </v-row>
          <p v-if="schoolError" class="text-red font-weight-bold">Please select your school.</p>
          <p v-if="emailError" class="text-red font-weight-bold">Email address is invalid.</p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import bannerImg from '@/assets/BAHS-CS-class-2025-11-18.jpg'
import logoImg from '@/assets/BAHS-logo.png'
import creatorImg from '@/assets/henning-seip.jpg'

export default {
  data() {
    return {
      bannerImg,
      logoImg,
      creatorImg,
      email: '',
      emailError: false,
      schoolError: false,
      loading: false,
      selectedSchool: null,
      schoolList: [],
    }
  },
  watch: {
    selectedSchool() {
      if (this.selectedSchool !== null) {
        this.schoolError = false
      }
    },
    email() {
      if (this.email.length > 0) {
        this.emailError = false
      }
    },
  },
  computed: {
    creatorName() {
      return import.meta.env.VITE_CREATOR_NAME
    },
    linkedIn() {
      return import.meta.env.VITE_LINKEDIN
    },
  },
  methods: {
    go() {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        if (this.selectedSchool !== null) {
          this.$router.push({
            name: 'Survey',
            query: { user: this.email, id: this.selectedSchool.SchoolID },
          })
        } else {
          this.schoolError = true
        }
      } else {
        this.emailError = true
      }
    },
  },
  mounted() {
    // load school list for select drop down box
    fetch(import.meta.env.VITE_SERVER_URL + '/api/school-list')
      .then((response) => response.json())
      .then((schoolList) => {
        this.schoolList = schoolList
      })
  },
}
</script>

<style>
.container {
  width: 70%;
  margin: auto;
}
</style>