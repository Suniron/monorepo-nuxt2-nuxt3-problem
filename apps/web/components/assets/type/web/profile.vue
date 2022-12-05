<template>
  <v-row>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <h3>Summary Details</h3>
        <p>
          <strong>Name:</strong>
          {{ asset.name }}
        </p>
        <p><strong>Url:</strong> {{ asset.url }}</p>
        <p><strong>Language:</strong> {{ asset.language || 'NA' }}</p>
      </div>
    </v-col>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <div style="display:flex" v-if="relations.LOCATED_TO.length > 0">
          <span style="display: inline-block;width:100px;">
            <strong>Hosted by:</strong>
          </span>
          <p style="display: flex; width: 300px; justify-content:left">
            <v-chip small nuxt :to="'/assets/' + relations.LOCATED_TO[0].id"
              ><AssetIcon os="SERVER" :size="15" />&nbsp;{{
                relations.LOCATED_TO[0].name
              }}</v-chip
            >
          </p>
        </div>
        <div style="display:flex" v-if="relations.OWN_BY.length > 0">
          <span style="display: inline-block;width:100px;">
            <strong> Owner : </strong>
          </span>
          <p style="display: flex; width: 300px; justify-content:left">
            <v-chip
              style="margin:0.1em"
              v-for="(item, i) in relations.OWN_BY"
              :key="i"
              small
              nuxt
              :to="'/assets/' + item.to_id"
            >
              <AssetIcon os="USER" :size="15" />&nbsp;
              {{ item.name }}
            </v-chip>
          </p>
        </div>
        <div style="display:flex" v-if="relations.MAINTAINED_BY.length > 0">
          <span style="display: inline-block;width:100px;">
            <strong> Maintainer : </strong>
          </span>
          <p style="display: flex; width: 300px; justify-content:left">
            <v-chip
              style="margin:0.1em"
              v-for="(item, i) in relations.MAINTAINED_BY"
              :key="i"
              small
              nuxt
              :to="'/assets/' + item.to_id"
            >
              <AssetIcon os="USER" :size="15" />&nbsp;
              {{ item.name }}
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
<script>
import AssetRiskScore from '../../details/AssetRiskScore.vue'
import AssetIcon from '~/components/assets/AssetIcon.vue'

export default {
  name: 'WebProfile',
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
        LOCATED_TO: [],
        OWN_BY: [],
        MAINTAINED_BY: []
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
