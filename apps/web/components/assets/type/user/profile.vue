<template>
  <v-row>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <h3>Summary Details</h3>
        <p>
          <strong>Name:</strong>
          {{ asset.name }}
        </p>
        <p><strong>Job title:</strong> {{ asset.position }}</p>
        <p><strong>Mail:</strong> {{ asset.mail }}</p>
        <p><strong>Phone:</strong> {{ asset.tel }}</p>
      </div>
    </v-col>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <h3></h3>
        <p v-if="relations.LOCATED_TO.length > 0">
          <strong>Located To:</strong>
          <v-chip small nuxt :to="'/assets/' + relations.LOCATED_TO[0].id"
            ><AssetIcon os="BUILDING" :size="15" />&nbsp;{{
              relations.LOCATED_TO[0].name
            }}</v-chip
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
  name: 'UserProfile',
  components: { AssetIcon, AssetRiskScore },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      relations: {
        LOCATED_TO: []
      }
    }
  },
  watch: {
    asset: {
      handler() {
        this.fetchRelations()
      },
      deep: true
    }
  },
  created() {
    this.fetchRelations()
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
    }
  }
}
</script>
