<template>
  <v-container>
    <h4>
      Whitelisted domain
      <v-tooltip right>
        <template #activator="{ on, attrs }">
          <v-icon color="primary" dark v-bind="attrs" v-on="on">
            mdi-information
          </v-icon>
        </template>
        <span>
          The domain will be used by XRATOR during phishing simulation. Add it
          into your infrastructure whitelist.
        </span>
      </v-tooltip>
    </h4>
    <CompanyDomainPicker />
    <h4>Company logo</h4>
    <CompanyLogoPicker />
  </v-container>
</template>

<script>
// @ts-check
import CompanyLogoPicker from './CompanyLogoPicker.vue'
import CompanyDomainPicker from './CompanyDomainPicker.vue'
export default {
  components: { CompanyLogoPicker, CompanyDomainPicker }
}
</script>
