<template>
  <v-row>
    <v-col><InfosBox /></v-col>
    <v-col><MitigationBox /></v-col>
    <v-col><StateBox /></v-col>
  </v-row>
</template>

<script>
// @ts-check
import InfosBox from './InfosBox.vue'
import MitigationBox from './MitigationBox.vue'
import StateBox from './StateBox.vue'

export default {
  components: { StateBox, InfosBox, MitigationBox }
}
</script>
