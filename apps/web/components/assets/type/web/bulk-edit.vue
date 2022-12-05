<template>
  <v-data-table
    :headers="tableHeaders"
    :items="details"
    v-model="formData.selected"
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
            chips
            deletable-chips
            @input="changed"
          ></component>
        </td>
      </tr>
    </template>
    <template #[`item.groups`]="{ item }">
      <v-chip
        v-for="(elt, i) in item.groups"
        :key="i"
        style="margin: 2px;"
        small
        >{{ elt.name }}</v-chip
      >
    </template>
    <template #[`item.tags`]="{ item }">
      <v-chip
        v-for="(elt, i) in item.tags"
        :key="i"
        style="margin: 2px;"
        small
        :color="elt.color"
        >{{ elt.name }}</v-chip
      >
    </template>
    <template #[`item.owners`]="{ item }">
      <v-chip
        v-for="(elt, i) in fetchRelations(item.relations, 'OWN_BY', true)"
        :key="i"
        style="margin: 2px;"
        small
        >{{ elt.name }}</v-chip
      >
    </template>
    <template #[`item.maintainers`]="{ item }">
      <v-chip
        v-for="(elt, i) in fetchRelations(
          item.relations,
          'MAINTAINED_BY',
          true
        )"
        :key="i"
        style="margin: 2px;"
        small
        >{{ elt.name }}</v-chip
      >
    </template>
    <template #[`item.location`]="{ item }">
      <v-chip
        v-if="(elt = fetchRelations(item.relations, 'LOCATED_TO', false))"
        style="margin: 2px;"
        small
        >{{ elt }}</v-chip
      >
    </template>
  </v-data-table>
</template>
<script>
/* eslint no-eval: 0 */
import { VTextField, VSelect } from 'vuetify/lib'
import TagsMultiselect from '~/components/controls/tags-multiselect.vue'
import GroupsMultiselect from '~/components/controls/groups-multiselect'
import { searchAssetsService } from '~/services/assets'

export default {
  components: {
    TagsMultiselect,
    GroupsMultiselect,
    VTextField,
    VSelect
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
  data() {
    return {
      formData: {
        url: null,
        language: null,
        groups: [],
        tags: [],
        OWN_BY: [],
        MAINTAINED_BY: [],
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
          text: 'Url',
          value: 'url',
          component: 'VTextField',
          vmodel: 'url',
          name: '[]',
          itemValue: '',
          itemText: '',
          multiple: false,
          creatable: false
        },
        {
          text: 'Language',
          value: 'language',
          component: 'VTextField',
          vmodel: 'language',
          name: '[]',
          itemValue: '',
          itemText: '',
          multiple: false,
          creatable: false
        },
        {
          text: 'Groups',
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
          text: 'Owner(s)',
          value: 'owners',
          component: 'VSelect',
          vmodel: 'OWN_BY',
          items: 'this.MAINTAINED_BY',
          itemValue: 'id',
          itemText: 'name',
          multiple: true,
          creatable: false
        },
        {
          text: 'Maintainer(s)',
          value: 'maintainers',
          component: 'VSelect',
          vmodel: 'MAINTAINED_BY',
          items: 'this.MAINTAINED_BY',
          itemValue: 'id',
          itemText: 'name',
          multiple: true,
          creatable: false
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
      LOCATED_TO: [],
      MAINTAINED_BY: []
    }
  },
  created() {
    this.fetchAssetsRelation()
  },
  methods: {
    async fetchAssetsRelation() {
      const serviceParams = {}
      serviceParams.types = ['USER', 'BUILDING', 'GROUP']
      // serviceParams.attribute = 'name'
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.assetsRelation = assets
      this.LOCATED_TO = this.selectAssets(['BUILDING'])
      this.MAINTAINED_BY = this.selectAssets(['USER', 'GROUP'])
    },
    selectAssets(types) {
      const res = this.assetsRelation.filter((elt) => types.includes(elt.type))
      return res
    },
    fetchRelations(relations, rel, multiple) {
      const result = relations.filter((elt) => {
        return elt.type === rel
      })
      if (multiple && result.length > 0) return result
      else if (!multiple && result.length === 1) return result[0].name
      else return multiple ? [] : null
    },
    eval(str) {
      return eval(str)
    },
    changed() {
      this.$emit('change', this.formData)
    }
  }
}
</script>
