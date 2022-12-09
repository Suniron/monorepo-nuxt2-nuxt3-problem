<script>
/* eslint no-eval: 0 */
import { VSelect, VTextField } from 'vuetify/lib'
import TagsMultiselect from '~/components/controls/tags-multiselect.vue'
import GroupsMultiselect from '~/components/controls/groups-multiselect'

import { searchAssetsService } from '~/services/assets'

export default {
  components: {
    GroupsMultiselect,
    TagsMultiselect,
    VSelect,
    VTextField,
  },
  data() {
    return {
      formData: {
        position: null,
        mail: null,
        tel: null,
        groups: [],
        tags: [],
        LOCATED_TO: null,
        selected: [],
        isValid: true
      },
      tableHeaders: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Job title',
          value: 'position',
          component: 'VTextField',
          vmodel: 'position',
          name: '[]',
          itemValue: '',
          itemText: '',
          multiple: false,
          creatable: false
        },
        {
          text: 'Email',
          value: 'mail',
          component: 'VTextField',
          vmodel: 'mail',
          name: '[]',
          rules: [(v) => this.isValidEmail(v)],
          itemValue: '',
          itemText: '',
          multiple: false,
          creatable: false
        },
        {
          text: 'Phone',
          value: 'tel',
          component: 'VTextField',
          vmodel: 'tel',
          name: '[]',
          rules: [(v) => this.isValidPhone(v)],
          itemValue: '',
          itemText: '',
          placeHolder: '+33 123456789',
          multiple: false,
          creatable: false
        },
        {
          text: 'Teams',
          value: 'groups',
          component: 'groups-multiselect',
          vmodel: 'groups',
          name: '[]',
          itemValue: '',
          itemText: '',
          multiple: false,
          creatable: false
        },
        {
          text: 'Tags',
          value: 'tags',
          component: 'tags-multiselect',
          vmodel: 'tags',
          name: '[]',
          itemValue: '',
          itemText: '',
          multiple: false,
          creatable: true
        },
        {
          text: 'Location',
          value: 'location',
          component: 'VSelect',
          vmodel: 'LOCATED_TO',
          items: 'this.LOCATED_TO',
          itemValue: 'id',
          itemText: 'name',
          multiple: false,
          creatable: false
        }
      ],
      assetsRelation: [],
      LOCATED_TO: []
    }
  },
  props: {
    asset: {
      type: Object,
      default() {
        return {}
      }
    },
    details: {
      type: Array,
      required: true
    }
  },
  created() {
    this.fetchAssetsRelation()
  },
  methods: {
    changed() {
      if (
        this.isValidEmail(this.formData.mail) === true
        && this.isValidPhone(this.formData.tel) === true
      )
        this.formData.isValid = true
      else
        this.formData.isValid = false

      this.$emit('change', this.formData)
    },
    eval(str) {
      return eval(str)
    },
    async fetchAssetsRelation() {
      const serviceParams = {}
      serviceParams.types = ['BUILDING']
      // serviceParams.attribute = 'name'
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.assetsRelation = assets
      this.LOCATED_TO = this.selectAssets(['BUILDING'])
    },
    fetchRelations(relations, rel, multiple) {
      const result = relations.filter((elt) => {
        return elt.type === rel
      })
      if (multiple && result.length > 0)
        return result
      else if (!multiple && result.length === 1)
        return result[0].name
      else return multiple ? [] : null
    },
    isValidEmail(email) {
      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email,
        )
        && email !== ''
        && email !== null
      )
        return 'E-mail must be valid.'

      return true
    },
    isValidPhone(phone) {
      if (
        !/^\+(\d){1,3} (\d){4,12}$/.test(phone)
        && phone !== null
        && phone !== ''
      )
        return 'Phone number must be valid.'

      return true
    },
    selectAssets(types) {
      const res = this.assetsRelation.filter(elt => types.includes(elt.type))
      return res
    },
  },
}
</script>

<template>
  <v-data-table
    v-model="formData.selected"
    :headers="tableHeaders"
    :items="details"
    class="elevation-1"
    disable-pagination
    hide-default-footer
    show-select
    @input="changed"
  >
    <template #[`body.prepend`]="{ headers }">
      <tr>
        <td v-for="(elt, i) in headers" :key="i">
          <component
            :is="elt.component"
            v-model="formData[elt.vmodel]"
            :items="eval(elt.items)"
            :item-value="elt.itemValue"
            :item-text="elt.itemText"
            :creatable="elt.creatable"
            :multiple="elt.multiple"
            :rules="elt.rules"
            chips
            :placeholder="elt.placeHolder"
            deletable-chips
            @input="changed"
          />
        </td>
      </tr>
    </template>
    <template #[`item.groups`]="{ item }">
      <v-chip
        v-for="(elt, i) in item.groups"
        :key="i"
        style="margin: 2px;"
        small
      >
        {{ elt.name }}
      </v-chip>
    </template>
    <template #[`item.tags`]="{ item }">
      <v-chip
        v-for="(elt, i) in item.tags"
        :key="i"
        style="margin: 2px;"
        small
        :color="elt.color"
      >
        {{ elt.name }}
      </v-chip>
    </template>
    <template #[`item.location`]="{ item }">
      <v-chip
        v-if="(elt = fetchRelations(item.relations, 'LOCATED_TO', false))"
        style="margin: 2px;"
        small
      >
        {{ elt }}
      </v-chip>
    </template>
  </v-data-table>
</template>
