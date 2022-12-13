<script>
// @ts-check
import InfosBox from './InfosBox.vue'
import MitigationBox from './MitigationBox.vue'
import StateBox from './StateBox.vue'

export default {
  components: { InfosBox, MitigationBox, StateBox },
}
</script>

<template>
  <v-row>
    <v-col><InfosBox /></v-col>
    <v-col><MitigationBox /></v-col>
    <v-col><StateBox /></v-col>
  </v-row>
</template>
