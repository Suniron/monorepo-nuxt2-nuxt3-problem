<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CardDetails from '~/components/assets/type/server/CardDetails.vue'
import AssetIcon from '~/components/assets/AssetIcon.vue'
import AssetRiskScore from '~/components/assets/details/AssetRiskScore.vue'

const { asset } = defineProps({
  asset: {
    required: true,
    type: Object,
  },
})

const locatedTo = computed(() => asset.relations.filter(r => r.type === 'LOCATED_TO'))
const maintainedBy = computed(() => asset.relations.filter(r => r.type === 'MAINTAINED_BY'))
const ownedBy = computed(() => asset.relations.filter(r => r.type === 'OWN_BY'))
</script>

<template>
  <v-row>
    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <h3 class="text-lg">
          Summary Details
        </h3>

        <CardDetails :asset="asset" />
      </div>
    </v-col>

    <v-col cols="12" lg="4">
      <div class="asset-profile__details">
        <div v-if="locatedTo.length > 0" style="display: flex">
          <span style="display: inline-block; width: 100px">
            <strong>Located to:</strong>
          </span>
          <p style="display: flex; width: 300px; justify-content: left">
            <v-chip
              style="margin: 0.1em"
              small
              nuxt
              :to="`/assets/${locatedTo[0].to_id}`"
            >
              <AssetIcon os="BUILDING" :size="15" />&nbsp;{{
                locatedTo[0].name
              }}
            </v-chip>
          </p>
        </div>
        <div v-if="ownedBy.length > 0" style="display: flex">
          <span style="display: inline-block; width: 100px">
            <strong> Owner : </strong>
          </span>
          <p style="display: flex; width: 300px; justify-content: left">
            <v-chip
              v-for="(item, i) in ownedBy"
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
        <div v-if="maintainedBy.length > 0" style="display: flex">
          <span style="display: inline-block; width: 100px">
            <strong>Maintainer:</strong>
          </span>
          <p style="display: flex; width: 300px; justify-content: left">
            <v-chip
              v-for="(item, i) in maintainedBy"
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
