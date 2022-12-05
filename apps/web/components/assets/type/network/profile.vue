<template>
  <v-row>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <h3>Summary Details</h3>
        <p><strong>Name:</strong> {{ asset.name }}</p>
        <p>
          <strong>Network:</strong>
          {{ asset.network }}/{{ asset.netmask }}
        </p>
        <p><strong>Gateway:</strong> {{ asset.gateway }}</p>
      </div>
    </v-col>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <h3></h3>
        <p v-if="fetchRelations('LOCATED_TO', false)">
          <strong>Loacated to:</strong>
          <v-chip small nuxt :to="'/assets/' + LOCATED_TO.to_id"
            ><AssetIcon os="BUILDING" :size="15" />&nbsp;{{
              LOCATED_TO.name
            }}</v-chip
          >
        </p>
        <p v-if="fetchRelations('OWN_BY', true).length > 0">
          <strong>Owner:</strong
          ><v-chip
            v-for="(item, i) in OWN_BY"
            :key="i"
            small
            nuxt
            :to="'/assets/' + item.to_id"
            ><AssetIcon os="USER" :size="15" />&nbsp;{{ item.name }}</v-chip
          >
        </p>
        <p v-if="fetchRelations('MAINTAINED_BY', true).length > 0">
          <strong>Maintainer:</strong
          ><v-chip
            v-for="(item, i) in MAINTAINED_BY"
            :key="i"
            small
            nuxt
            :to="'/assets/' + item.to_id"
            ><AssetIcon os="USER" :size="15" />&nbsp;{{ item.name }}</v-chip
          >
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
<script>
import AssetRiskScore from '../../details/AssetRiskScore.vue'
import AssetIcon from '~/components/assets/AssetIcon.vue'

export default {
  name: 'ServerProfile',
  components: { AssetIcon, AssetRiskScore },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      LOCATED_TO: null,
      OWN_BY: null,
      MAINTAINED_BY: null
    }
  },
  methods: {
    fetchRelations(rel, multiple) {
      const result = this.asset.relations
        ? this.asset?.relations.filter((elt) => {
            return elt.type === rel
          })
        : []
      if (multiple && result.length > 0) this[rel] = result
      else if (!multiple && result.length === 1) this[rel] = result[0]
      else this[rel] = false
      return this[rel]
    }
  }
}
</script>
