<script>
/* eslint no-eval: 0 */
import { VTextField } from 'vuetify/lib'
import TagsMultiselect from '~/components/controls/tags-multiselect.vue'
import GroupsMultiselect from '~/components/controls/groups-multiselect'
export default {
  components: {
    GroupsMultiselect,
    TagsMultiselect,
    VTextField,
  },
  data() {
    return {
      formData: {
        location: null,
        groups: [],
        tags: [],
        selected: [],
        isValid: true
      },
      tableHeaders: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Revision',
          value: 'revision',
          component: 'VTextField',
          vmodel: 'revision',
          name: '[]',
          itemValue: '',
          itemText: '',
          multiple: false,
          creatable: false
        },
        {
          text: 'Date' + 'yyyy-mm-dd',
          value: `rev_cdate`,
          component: 'VTextField',
          vmodel: 'rev_cdate',
          name: '[]',
          itemValue: '',
          itemText: '',
          multiple: false,
          creatable: true
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
        }
      ],
      assetsRelation: []
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
  watch: {
    details(newQuestion, oldQuestion) {
      for (const elem of this.details) {
        elem.rev_cdate = elem.rev_cdate.split('T')[0]
      }
    }
  },
  created() {
    for (const elem of this.details) 
      elem.rev_cdate = elem.rev_cdate.split('T')[0]
    
  },
  methods: {
    changed() {
      this.$emit('change', this.formData)
    },
    eval(str) {
      return eval(str)
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
            :item-placeholder="elt.itemText"
            :creatable="elt.creatable"
            :multiple="elt.multiple"
            chips
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
  </v-data-table>
</template>
