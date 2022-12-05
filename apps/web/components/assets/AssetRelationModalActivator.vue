<template>
  <v-card min-height="150px" height="100%">
    <v-dialog
      v-model="isSaveModalOpen"
      style="background-color: white;"
      width="1000"
    >
      <template #activator="{on, attrs}">
        <v-btn
          class="d-flex flex-col"
          height="100%"
          v-on="on"
          plain
          tile
          block
          :ripple="false"
          small
          icon
          v-bind="attrs"
        >
          <v-icon x-large class="activator-icon" color="green lighten-2">
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <template #default>
        <AssetRelationModal
          :relation-wanted="relationWanted"
          :allowed-types="allowedTypes"
          :asset="asset"
          :is-open="isSaveModalOpen"
          :relation-type="relationType"
          @saved="closeModalAndEmitSaved"
          @closed="isSaveModalOpen = false"
        />
      </template>
    </v-dialog>
  </v-card>
</template>
<script>
import AssetRelationModal from '~/components/assets/AssetRelationModal.vue'
export default {
  components: {
    AssetRelationModal
  },
  props: {
    asset: {
      type: Object,
      required: true
    },
    relationWanted: {
      type: String,
      required: true
    },
    allowedTypes: {
      type: Array,
      required: true
    },
    relationType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isSaveModalOpen: false
    }
  },
  methods: {
    closeModalAndEmitSaved() {
      this.isSaveModalOpen = false
      this.$emit('saved')
    }
  }
}
</script>

<style lang="scss">
.activator {
  &-icon {
    /*
   * Shamelessly stolen from https://stackoverflow.com/questions/60583902/how-to-create-dashed-circles-with-uniform-spacing
   * Since a simple dashed border would have an uneven spacing at the meeting point of the stard & end of the border
   */
    --d: 10deg; /* distance between dashes */
    --n: 15; /* number of dashes */
    --c: lightgreen; /* color of dashes */
    --b: 5px; /* control the thickness of border*/

    width: 180px;
    display: inline-block;
    border-radius: 50%;
    border: var(--b) solid transparent; /* control the thickness of border*/
    background: linear-gradient(#fff, #fff) padding-box padding-box,
      repeating-conic-gradient(
          var(--c) 0 calc(360deg / var(--n) - var(--d)),
          transparent 0 calc(360deg / var(--n))
        )
        border-box;
    padding: 30px;
  }
}
</style>
