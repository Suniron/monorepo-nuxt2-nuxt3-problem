<script>
import AssetRiskScore from '../../details/AssetRiskScore.vue'
import AssetIcon from '~/components/assets/AssetIcon.vue'

export default {
  components: { AssetIcon, AssetRiskScore },
  name: 'BuildingProfile',
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
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <h3>Summary Details</h3>
        <p>
          <strong>Name:</strong>
          {{ asset.name }}
        </p>
        <p>
          <strong>Location:</strong>
          {{ asset.location }}
        </p>
        <p>
          <strong>Phone number:</strong>
          {{ asset.phone_number || 'Not defined yet' }}
        </p>
        <p>
          <strong>Postal address:</strong>
          {{ asset.postal_address || 'Not defined yet' }}
        </p>
      </div>
    </v-col>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <h3 />
        <p v-if="asset.LOCATED_TO">
          <strong>Located to:</strong>
          <v-chip
            v-for="(item, i) in asset.location"
            :key="i"
            small
            nuxt
            :to="`/assets/${item.to_id}`"
          >
            <AssetIcon os="BUILDING" :size="15" />&nbsp;{{ item.name }}
          </v-chip>
        </p>
        <p v-if="asset.owner">
          <strong>Owner:</strong><v-chip
            v-for="(item, i) in asset.owner"
            :key="i"
            small
            nuxt
            :to="`/assets/${item.to_id}`"
          >
            <AssetIcon os="USER" :size="15" />&nbsp;{{ item.name }}
          </v-chip>
        </p>
        <p v-if="asset.maintainer">
          <strong>Maintainer:</strong><v-chip
            v-for="(item, i) in asset.maintainer"
            :key="i"
            small
            nuxt
            :to="`/assets/${item.to_id}`"
          >
            <AssetIcon os="USER" :size="15" />&nbsp;{{ item.name }}
          </v-chip>
        </p>
      </div>
    </v-col>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <AssetRiskScore :asset="asset" />
      </div>
    </v-col>
  </v-row>
</template>
