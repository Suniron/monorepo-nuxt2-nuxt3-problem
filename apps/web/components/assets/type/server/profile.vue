<script>
import AssetIcon from '~/components/assets/AssetIcon.vue'
import AssetRiskScore from '~/components/assets/details/AssetRiskScore.vue'

export default {
  components: { AssetIcon, AssetRiskScore },
  name: 'ServerProfile',
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      relations: {
        LOCATED_TO: [],
        MAINTAINED_BY: [],
        OWN_BY: []
      },
    }
  },
  created() {
    this.fetchRelations()
  },
  watch: {
    asset: {
      deep: true,
      handler() {
        this.fetchRelations()
      }
    },
  },
  methods: {
    fetchRelations() {
      const RELATIONS = Object.keys(this.relations)
      RELATIONS.forEach((rel) => {
        const result = this.asset.relations
          ? this.asset?.relations.filter((elt) => {
            return elt.type === rel
          })
          : []
        this.relations[rel].splice(0, this.relations[rel].length, ...result)
      })
    },
  },
}
</script>

<template>
  <v-row>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <h3>Summary Details</h3>
        <p><strong>Name:</strong> {{ asset.name }}</p>
        <p>
          <strong>IP:</strong>
          {{ asset.ips && asset.ips.map((x) => x.address).join(', ') }}
        </p>
        <p><strong>Operating System:</strong> {{ asset.os }}</p>
        <p>
          <strong>Hostname:</strong>
          <span v-if="asset.hostname">{{ asset.hostname }}</span><span v-else class="text--disabled">N/A</span>
        </p>
      </div>
    </v-col>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <div v-if="relations.LOCATED_TO.length > 0" style="display: flex">
          <span style="display: inline-block; width: 100px">
            <strong>Located to:</strong>
          </span>
          <p style="display: flex; width: 300px; justify-content: left">
            <v-chip
              style="margin: 0.1em"
              small
              nuxt
              :to="`/assets/${relations.LOCATED_TO[0].to_id}`"
            >
              <AssetIcon os="BUILDING" :size="15" />&nbsp;{{
                relations.LOCATED_TO[0].name
              }}
            </v-chip>
          </p>
        </div>
        <div v-if="relations.OWN_BY.length > 0" style="display: flex">
          <span style="display: inline-block; width: 100px">
            <strong> Owner : </strong>
          </span>
          <p style="display: flex; width: 300px; justify-content: left">
            <v-chip
              v-for="(item, i) in relations.OWN_BY"
              :key="i"
              style="margin: 0.1em"
              small
              nuxt
              :to="`/assets/${item.to_id}`"
            >
              <AssetIcon os="USER" :size="15" />&nbsp;
              {{ item.name }}
            </v-chip>
          </p>
        </div>
        <div v-if="relations.MAINTAINED_BY.length > 0" style="display: flex">
          <span style="display: inline-block; width: 100px">
            <strong>Maintainer:</strong>
          </span>
          <p style="display: flex; width: 300px; justify-content: left">
            <v-chip
              v-for="(item, i) in relations.MAINTAINED_BY"
              :key="i"
              style="margin: 0.1em"
              small
              nuxt
              :to="`/assets/${item.to_id}`"
            >
              <AssetIcon os="USER" :size="15" />&nbsp;{{ item.name }}
            </v-chip>
          </p>
        </div>
      </div>
    </v-col>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <AssetRiskScore :asset="asset" />
      </div>
    </v-col>
  </v-row>
</template>
