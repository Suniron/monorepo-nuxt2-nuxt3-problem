<script>
// @ts-check
import AssetIcon from '~/components/assets/AssetIcon.vue'
import AssetRiskScoreBar from '~/components/assets/details/AssetRiskScoreBar.vue'

export default {
  name: 'AssetCard',
  components: {
    AssetIcon,
    AssetRiskScoreBar
  },
  data() {
    return {
      show: false,
    }
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleCardClick() {
      this.$router.push(
        this.localePath({
          name: 'assets-id',
          params: { id: this.asset.id },
        }),
      )
    },
    handleConfirm() {
      this.$emit('unlinkAsset', this.asset)
      this.show = false
    },
  },
}
</script>

<template>
  <v-card
    min-height="150px"
    height="100%"
    class="d-flex flex-column text-center pa-3"
  >
    <v-hover>
      <template #default="{ hover }">
        <div
          :class="`elevation-${hover ? 4 : 0}`"
          class="pt-2 pb-1 pointer"
          style="height: 100%"
          :title="`Go on &quot;${asset.name}&quot; details`"
          @click="handleCardClick"
        >
          <AssetIcon :os="asset.os || asset.language || asset.type" />
          <h4 class="mb-0 text-center">
            {{ asset.name }}
          </h4>
        </div>
      </template>
    </v-hover>

    <v-spacer class="mt-2" />
    <AssetRiskScoreBar :asset="asset" />

    <v-dialog v-model="show" width="500">
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          class="mt-2"
          width="100%"
          small
          color="error"
          v-on="on"
        >
          unlink
        </v-btn>
      </template>

      <template #default>
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Unlink the asset
          </v-card-title>
          <v-card-text>
            <p class="mt-2">
              Are you sure you want to unlink the asset
              <span class="font-weight-bold">"{{ asset.name }}"</span>
              ?
            </p>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />

            <v-btn @click="show = false">
              cancel
            </v-btn>
            <v-btn color="success" @click="handleConfirm">
              confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-card>
</template>

<style lang="scss">
.pointer {
  cursor: pointer;
  transition: box-shadow 300ms ease;
}
</style>
