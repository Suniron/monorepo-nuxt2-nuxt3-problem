<script>
export default {
  name: 'RiskIndicators',
  computed: {
    risks() {
      return this.asset.vulnerabilities || {}
    },
    orderedRisks() {
      return ['critical', 'high', 'medium', 'low'].map((level) => [
        level,
        this.risks[level]
      ])
    }
  },
  methods: {
    goToAssetDetails(severity) {
      this.$router.push(
        this.localePath({
          name: 'assets-id',
          params: { id: this.asset.id },
          query: { severities: severity },
        }),
      )
    },
  },
  props: {
    asset: {
      required: true,
      type: Object,
    },
  },
}
</script>

<template>
  <div class="risk-indicator">
    <v-btn
      v-for="[level, amount] of orderedRisks"
      :key="level"
      :class="`risk risk--${level}`"
      x-small
      @click.stop="goToAssetDetails(level)"
    >
      {{ amount }}
    </v-btn>
  </div>
</template>

<style lang="scss">
.risk-indicator {
  display: inline-block;
  .v-btn {
    &.risk {
      padding: 0;
      min-width: 24px;
      margin-left: 4px;
      border-radius: 200px;

      &.risk--low {
        background-color: #f0d802 !important;
        color: black;
      }

      &.risk--medium {
        background-color: #ed9b0e !important;
        color: black;
      }

      &.risk--high {
        background-color: #d92b2b !important;
      }

      &.risk--critical {
        background-color: #941e1e !important;
      }
    }
  }
}
</style>
