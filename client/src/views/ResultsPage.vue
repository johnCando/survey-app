<template>
  <div>
    <v-row justify="center">
      <v-col cols="10">
        <h4 class="text-center my-4">Poll Results</h4>
        <p>
          Select a school to show what jobs students are interested in. Select "all NYC schools"
          to see how many students/schools have participated.
        </p>
        <v-autocomplete
          v-model="selectedSchool"
          :items="schoolList"
          label="select a NYC high school"
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
        <div v-if="recordsFound" style="position: relative">
          <GChart type="BarChart" :data="chartData" :options="chartOptions" :style="chartStyle" />
          <v-overlay
            :model-value="loading"
            contained
            class="align-center justify-center"
            persistent
          >
            <v-progress-circular indeterminate size="50" color="primary" />
            <h6 class="ma-0 mt-4">loading data...</h6>
          </v-overlay>
        </div>
        <div v-if="!recordsFound" style="width: 100%; height: 300px; position: relative">
          <p
            class="text-blue"
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
          >
            no records found!
          </p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
export default {
  components: {
    GChart,
  },
  data() {
    return {
      loading: false,
      recordsFound: true,
      selectedSchool: null,
      schoolList: [],
      chartOptions: {
        backgroundColor: 'transparent',
        legend: { position: 'none' },
        hAxis: { title: 'Students', format: '0' },
        chartArea: { left: 540, top: 10, width: '100%' },
      },
      chartStyle: 'height: calc(70vh)',
      chartData: [],
    }
  },
  watch: {
    selectedSchool() {
      this.loadPollResults()
    },
  },
  methods: {
    loadPollResults() {
      this.loading = true
      const data = {
        SchoolID: this.selectedSchool === null ? null : this.selectedSchool.SchoolID,
      }
      fetch(import.meta.env.VITE_SERVER_URL + '/api/results', {
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          this.loading = false
          this.recordsFound = data.length > 0
          let chartData = []
          if (this.selectedSchool === null || this.selectedSchool.SchoolID === null) {
            chartData.push(['School', 'Students', { role: 'style' }])
            for (const rec of data) {
              chartData.push([rec.SchoolName, parseInt(rec.studentCount), '#009900'])
            }
            this.chartData = chartData
          } else {
            chartData.push(['Job Title', 'Students', { role: 'style' }])
            for (const rec of data) {
              chartData.push([rec.JobTitle, parseInt(rec.studentCount), '#0000FF'])
            }
            this.chartData = chartData
          }
        })
    },
  },
  mounted() {
    // load school list for select drop down box
    fetch(import.meta.env.VITE_SERVER_URL + '/api/school-list')
      .then((response) => response.json())
      .then((schoolList) => {
        this.schoolList = [{ SchoolID: null, SchoolName: 'all NYC schools' }].concat(schoolList)
        this.selectedSchool = {
          SchoolID: null,
          SchoolName: 'all NYC schools',
        }
      })
  },
}
</script>