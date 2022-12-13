<script>
import {
  createRelationService,
  updateRelationService,
} from '~/services/relations'

export default {
  data() {
    return {
      relations: [
        { value: 'CONNECTED_TO', text: 'Is connected to' },
        { value: 'MAINTAINED_BY', text: 'Is maintained by' },
        { value: 'OWN_BY', text: 'Is owned by' },
        { value: 'LOCATED_TO', text: 'Is located at' }
      ],
      drawer: false,
      isNewEdge: false,
      relation: '',
      isLoading: false
    }
  },
  props: {
    edgeSelected: {
      type: Boolean,
      default: false
    },
    fromAsset: {
      type: Object,
      default() {
        return { name: '', id: -1 }
      }
    },
    toAsset: {
      type: Object,
      default() {
        return { name: '', id: -1 }
      }
    },
    selectedEdge: {
      type: Object,
      default: null
    }
  },
  watch: {
    selectedEdge(newValue) {
      this.drawer = newValue
      this.relation = newValue?.name || ''
      this.isNewEdge = !newValue?.name
    }
  },
  created() {
    this.drawer = this.edgeSelected
    this.relation = this.selectedEdge?.name || ''
    this.isNewEdge = !this.selectedEdge?.name
  },
  methods: {
    assetChanged(formData) {
      this.form.assetData = formData
    },
    async saveRelation() {
      try {
        this.isLoading = true
        const relationChanged = (rel, data) => rel.type !== data

        console.log(this.selectedEdge, this.relation)
        if (this.isNewEdge) {
          await createRelationService(this.$axios, {
            from_asset_id: this.fromAsset.id.split('-')[1],
            to_asset_id: this.toAsset.id.split('-')[1],
            type: this.relation,
          })
          this.$emit('saved')
        }
        else if (relationChanged(this.selectedEdge, this.relation)) {
          await updateRelationService(
            this.$axios,
            this.selectedEdge.id.split('-')[1],
            { type: this.relation },
          )
          this.$emit('saved')
        }
        // this.resetField()
        this.$emit('close')
      }
      catch (error) {
        console.error(error)
      }
      finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<template>
  <v-navigation-drawer v-model="drawer" width="500" fixed right>
    <template #prepend>
      <v-row justify="center" style="margin: 5px">
        <v-col cols="12">
          <span><h1>Relation</h1></span>
        </v-col>
      </v-row>
    </template>

    <v-divider />

    <v-card class="save-asset-modal">
      <v-card-text>
        <v-row align="baseline">
          <v-col cols="12" lg="4">
            <p>
              {{ fromAsset.name }}
            </p>
          </v-col>
          <v-col cols="12" lg="4">
            <v-select
              v-model="relation"
              :items="relations"
              item-text="text"
              item-value="value"
              flat
            />
          </v-col>
          <v-col cols="12" lg="4">
            <p>
              {{ toAsset.name }}
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="actions">
            <v-btn
              class="mr-2"
              :disabled="isLoading"
              @click.stop="$emit('close')"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :disabled="relation !== '' ? false : true"
              :loading="isLoading"
              @click.stop="saveRelation"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>
