<script>
import { searchAssetsService } from '~/services/assets'

export default {
  data() {
    return {
      availableUserGroups: [],
      chosenUserGroups: [],
      formData: {
        position: this.asset.position || null,
        mail: this.asset?.mail || null,
        tel: this.asset?.tel || null,
        LOCATED_TO: null,
        parents: []
      },
      buildings: [],
      rules: {
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'E-mail must be valid.'
        },
        phone: (value) => {
          const pattern = /^\+(\d){1,3} (\d){4,12}$/
          return !value || pattern.test(value) || 'Phone number must be valid.'
        }
      }
    }
  },
  props: {
    asset: {
      type: Object,
      required: true
    },
    quickedit: {
      type: Boolean,
      required: false
    }
  },
  watch: {
    asset(newAsset) {
      this.restoreTheActualStateInDatabase()
      this.fetchMissions()
    },
    'formData.phone_number'(newValue) {
      if (newValue === '') {
        this.formData.phone_number = null
      }
    }
  },
  created() {
    this.fetchBuildings()
    this.formData.LOCATED_TO = this.fetchLocation()
    this.restoreTheActualStateInDatabase()
    this.fetchMissions()
    this.$root.$on('resetForm', this.resetForm)
    this.changed()
  },
  methods: {
    resetForm() {
      this.formData = {
        LOCATED_TO: this.fetchLocation(),
        mail: this.asset?.mail || null,
        position: this.asset.position || null,
        tel: this.asset?.tel || null,
      }
      this.restoreTheActualStateInDatabase()
      this.changed()
    },
    changed() {
      this.$emit('change', {
        ...this.formData,
        parents: Array.from(
          new Set([
            ...(this.asset.parents ?? [])
              .filter(parent => parent.type !== 'USERGROUP')
              .map(parent => parent.id),
            ...this.chosenUserGroups,
          ]),
        ),
      })
    },
    async fetchBuildings() {
      const serviceParams = {}
      serviceParams.types = ['BUILDING']
      // serviceParams.attribute = 'name'
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.buildings = assets
    },
    fetchLocation() {
      const result = this.asset.relations
        ? this.asset?.relations.filter((elt) => {
          return elt.type === 'LOCATED_TO'
        })
        : []
      // console.log(result)
      if (result.length === 1)
        return result[0].to_id
      else return null
    },
    async fetchMissions() {
      const serviceParams = {}
      serviceParams.types = ['USERGROUP']
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.availableUserGroups = assets
    },
    restoreTheActualStateInDatabase() {
      if (this.asset?.parents?.length > 0) {
        this.chosenUserGroups = this.asset.parents
          .filter(parent => parent.type === 'USERGROUP')
          .map(userGroup => userGroup.id)
      }
    },
  },
}
</script>

<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-text-field
        v-model="formData.position"
        label="Job title"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.mail"
        label="Mail"
        :rules="[rules.email]"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.tel"
        label="Tel"
        :rules="[rules.phone]"
        placeholder="+999 123456789"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
    <v-col cols="12">
      <v-select
        v-model="formData.LOCATED_TO"
        :items="buildings"
        item-text="name"
        item-value="id"
        label="Location"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
    <v-col cols="12">
      <v-select
        v-if="availableUserGroups.length > 0"
        v-model="chosenUserGroups"
        :items="availableUserGroups"
        item-value="id"
        item-text="name"
        class="custom-multiselect"
        multiple
        chips
        deletable-chips
        v-bind="$attrs"
        label="User group"
        single-line
        :disabled="!quickedit"
        :menu-props="{
          bottom: true,
          offsetY: true,
          closeOnClick: true,
        }"
        @change="changed"
        @click.stop
      />
    </v-col>
  </div>
</template>
