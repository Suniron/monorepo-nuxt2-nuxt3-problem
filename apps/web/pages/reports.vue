<script>
import { generateService } from '~/services/reports'

export default {
  middleware: ['auth'],
  name: 'ReportsPages',
  data() {
    return {}
  },
  created() {
    this.$store.dispatch('changePageTitle', 'Reports')
  },
  methods: {
    async dlDoc() {
      const resp = await generateService(this.$axios)
      console.log(resp)
      const fileUrl = window.URL.createObjectURL(
        new Blob([Buffer.from(resp.data)]),
      )
      const fileLink = document.createElement('a')
      fileLink.href = fileUrl
      fileLink.setAttribute('download', 'report.docx')
      document.body.appendChild(fileLink)
      fileLink.click()
    },
  },
}
</script>

<template>
  <v-btn class="primary" download @click="dlDoc()">
    DOWNLOAD
  </v-btn>
</template>

<style lang="scss"></style>
