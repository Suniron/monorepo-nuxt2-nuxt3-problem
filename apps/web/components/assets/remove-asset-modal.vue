<script>
// Services
import { deleteAssetService } from '~/services/assets'

export default {
  name: 'RemoveAssetModal',
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async removeAsset() {
      try {
        this.isLoading = true
        await deleteAssetService(this.$axios, this.asset.id)

        this.$emit('delete')
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
  props: {
    asset: {
      default: null,
      type: Object,
    },
  },
}
</script>

<template>
  <v-card class="remove-asset-modal">
    <v-card-title>
      Remove asset
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-card-text>
            Do you confirm to remove the asset?
            <br><strong>This action cannot be undone!</strong><br><br>
          </v-card-text>
        </v-row>
        <v-row>
          <v-col class="actions">
            <v-btn
              class="mr-2"
              :disabled="isLoading"
              @click.stop="$emit('close')"
            >
              No, cancel
            </v-btn>
            <v-btn
              color="primary"
              :loading="isLoading"
              @click.stop="removeAsset"
            >
              Yes, remove
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.remove-asset-modal {
  .actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
