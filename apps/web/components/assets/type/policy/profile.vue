<template>
  <v-row>
    <v-col cols="12" lg="6">
      <div class="asset-profile__details">
        <h3>Summary Details</h3>
        <p>
          <strong>Name:</strong>
          {{ asset.name }}
        </p>
        <p><strong>Version:</strong> {{ asset.revision }}</p>
        <p><strong>Date:</strong> {{ renderDate() }}</p>
      </div>
    </v-col>
    <v-col cols="12" lg="6">
      <div class="asset-profile__details">
        <h3></h3>
        <p v-if="fetchRelations('MAINTAINED_BY', true)">
          <strong>Contact(s) for this document:</strong>
          <v-chip
            v-for="(item, i) in MAINTAINED_BY"
            :key="i"
            small
            nuxt
            :to="'/assets/' + item.to_id"
            ><AssetIcon os="USER" :size="15" />&nbsp;{{ item.name }}</v-chip
          >
        </p>
        <p v-if="fetchRelations('REVIEWED_BY', true)">
          <strong>Reviewer(s):</strong
          ><v-chip
            v-for="(item, i) in REVIEWED_BY"
            :key="i"
            small
            nuxt
            :to="'/assets/' + item.to_id"
            ><AssetIcon os="USER" :size="15" />&nbsp;{{ item.name }}</v-chip
          >
        </p>
        <p v-if="fetchRelations('APPROVED_BY', true)">
          <strong>Approver(s):</strong
          ><v-chip
            v-for="(item, i) in APPROVED_BY"
            :key="i"
            small
            nuxt
            :to="'/assets/' + item.to_id"
            ><AssetIcon os="USER" size="15" />&nbsp;{{ item.name }}</v-chip
          >
        </p>
        <p v-if="fetchRelations('REFERRED_TO', true)">
          <strong>Reference documents:</strong
          ><v-chip
            v-for="(item, i) in REFERRED_TO"
            :key="i"
            small
            nuxt
            :to="'/assets/' + item.to_id"
            ><AssetIcon os="POLICIES" :size="15" />&nbsp;{{ item.name }}</v-chip
          >
        </p>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import AssetIcon from '~/components/assets/AssetIcon.vue'

export default {
  name: 'PolicyProfile',
  components: { AssetIcon },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      MAINTAINED_BY: null,
      REVIEWED_BY: null,
      APPROVED_BY: null,
      REFERRED_TO: null
    }
  },
  methods: {
    renderDate() {
      if (this.asset.rev_cdate) {
        const date = new Date(this.asset.rev_cdate)
        return date.toISOString().split('T')[0]
      } else return 'N/A'
    },
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
