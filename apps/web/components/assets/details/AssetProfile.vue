<script>
import AssetIcon from '~/components/assets/AssetIcon.vue'
import AssetInfo from '~/components/assets/type/AssetInfo.vue'

export default {
  components: { AssetIcon, AssetInfo },
  name: 'AssetProfile',
  props: {
    asset: {
      required: true,
      type: Object,
    },
  },
}
</script>

<template>
  <v-row>
    <v-col cols="12" :lg="asset.topRecommendation ? 6 : 12">
      <v-sheet class="asset-profile" rounded>
        <AssetIcon :os="asset.os || asset.language || asset.type" />
        <AssetInfo :asset="asset" section="profile" />
      </v-sheet>
    </v-col>
    <v-col v-if="asset.topRecommendation" cols="12" lg="6">
      <v-sheet class="asset-profile" rounded>
        <AssetIcon os="certif" />
        <div class="asset-profile__details">
          <h3>Main recommendations:</h3>
          <ul>
            <li v-for="(item, i) in asset.topRecommendation" :key="i">
              {{ item.recommendation }}
            </li>
          </ul>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.asset-profile {
  padding: 32px 16px;
  display: flex;
  height: 100%;

  h3 {
    margin-bottom: 16px;
  }

  &__details {
    margin-left: 32px;

    p {
      margin: 0;
    }
  }
}
</style>
