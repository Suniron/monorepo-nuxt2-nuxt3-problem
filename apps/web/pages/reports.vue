<template>
  <v-btn class="primary" @click="dlDoc()" download>
    DOWNLOAD
  </v-btn>
</template>

<script>
import { generateService } from '~/services/reports'

export default {
  name: 'ReportsPages',
  middleware: ['auth'],
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
        new Blob([Buffer.from(resp.data)])
      )
      const fileLink = document.createElement('a')
      fileLink.href = fileUrl
      fileLink.setAttribute('download', 'report.docx')
      document.body.appendChild(fileLink)
      fileLink.click()
    }
  }
}
</script>

<style lang="scss"></style>
