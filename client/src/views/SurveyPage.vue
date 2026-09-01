<template>
  <div>
    <h3 class="d-none d-md-block text-center my-4">Pick your favorite job</h3>
    <h5 class="d-md-none text-center my-4">Pick your favorite job</h5>
    <v-row>
      <v-col cols="8" class="mx-auto">
        <v-card v-if="windowHeight > 700">
          <v-card-text>
            <p>
              Below is the list of {{ jobTitles.length }} in-demand jobs in New York City. Pick
              your favorite job.
            </p>

            <p>
              <span class="font-weight-bold">Your privacy:</span>
              This is an anonymous poll. Your name will not be visible to others. You can change
              your choice at any time.
            </p>

            <p class="mb-0">
              <span class="font-weight-bold">SAVE your choice: </span>Scroll through the list.
              Make a selection, then save your choice.
            </p>
          </v-card-text>
        </v-card>
        <v-card class="mt-2">
          <v-card-text>
            <div class="py-4">
              <v-select v-model="sort" :items="options" label="Sort" variant="outlined" />
            </div>
            <v-radio-group v-model="selected" hide-details>
              <v-list border class="overflow-auto" :style="cardHeight">
                <v-list-item v-for="(jobTitle, idx) in jobTitles" :key="idx">
                  <template #prepend>
                    <v-radio :value="jobTitle.JobTitle" />
                  </template>
                  <v-list-item-title class="font-weight-bold">{{
                    jobTitle.JobTitle
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Job Openings: {{ jobTitle.JobCount }} | Employers: {{ jobTitle.EmployerCount }}
                    | Avg Annual Wage: ${{
                      jobTitle.AvgAnnualWage.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
                    }}
                    | required education:
                    <span
                      class="font-weight-bold"
                      :class="jobTitle.RequiredEducation === 'mostly college' ? 'text-red' : 'text-blue'"
                      >{{ jobTitle.RequiredEducation }}</span
                    >
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-radio-group>
          </v-card-text>
          <v-divider />
          <v-card-actions class="justify-space-around">
            <v-btn color="green" @click="saveChoice">Save your choice</v-btn>
            <v-btn v-if="saved" color="blue" :to="{ name: 'Results' }">Show poll results</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="notify" color="success">
      Your choice has been recorded. Thank you!
    </v-snackbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      error: false,
      saved: false,
      notify: false,
      user: null,
      id: null,
      jobTitles: [],
      selected: null,
      options: ['title', 'jobs', 'employers', 'wage'],
      sort: 'title',
    }
  },
  computed: {
    windowHeight() {
      return window.innerHeight
    },
    cardHeight() {
      return window.innerHeight > 700 ? 'height: calc(100vh - 450px);' : 'height: calc(100vh - 270px);'
    },
  },
  watch: {
    sort() {
      this.sortJobTitles(this.jobTitles)
    },
  },
  methods: {
    sortJobTitles(jobTitles) {
      this.jobTitles = jobTitles.sort((a, b) => {
        switch (this.sort) {
          case 'title':
            if (a.JobTitle > b.JobTitle) return 1
            if (a.JobTitle < b.JobTitle) return -1
            return 0
          case 'jobs':
            if (a.JobCount < b.JobCount) return 1
            if (a.JobCount > b.JobCount) return -1
            return 0
          case 'employers':
            if (a.EmployerCount < b.EmployerCount) return 1
            if (a.EmployerCount > b.EmployerCount) return -1
            return 0
          case 'wage':
            if (a.AvgAnnualWage < b.AvgAnnualWage) return 1
            if (a.AvgAnnualWage > b.AvgAnnualWage) return -1
            return 0
        }
      })
    },
    async saveChoice() {
      const data = {
        email: this.user,
        SchoolID: this.id,
        JobTitle: this.selected,
        CreatorEmail: import.meta.env.VITE_CREATOR_EMAIL,
      }
      await fetch(import.meta.env.VITE_SERVER_URL + '/api/survey', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(() => {
        this.saved = true
        this.notify = true
      })
    },
  },
  mounted() {
    if (typeof this.$route.query.user !== 'undefined' && typeof this.$route.query.id !== 'undefined') {
      this.user = this.$route.query.user
      this.id = this.$route.query.id
      fetch(import.meta.env.VITE_SERVER_URL + '/api/joblist')
        .then((response) => response.json())
        .then((jobTitles) => {
          this.sortJobTitles(jobTitles)
        })
    }
  },
}
</script>