<script>
/* eslint no-eval: 0 */
import { VTextField } from 'vuetify/lib'
import TagsMultiselect from '~/components/controls/tags-multiselect.vue'
import GroupsMultiselect from '~/components/controls/groups-multiselect'
import { netmaskValid } from '~/utils/asset.utils'
export default {
  components: {
    GroupsMultiselect,
    TagsMultiselect,
    VTextField,
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
          text: 'Network',
          value: `network`,
          component: 'VTextField',
          vmodel: 'network',
          name: '[]',
          itemValue: '',
          itemText: '',
          multiple: false,
          creatable: true
        },
        {
          text: 'Netmask',
          value: `netmask`,
          component: 'VTextField',
          vmodel: 'netmask',
          name: '[]',
          itemValue: '',
          rules:[(v) => this.isValidNetmask(v)],
          itemText: '',
          placeHolder: '255.255.255.0 or 24',
          multiple: false,
          creatable: true
        },
        {
          text: 'Gateway',
          value: `gateway`,
          component: 'VTextField',
          vmodel: 'gateway',
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
  created() {},
  methods: {
    changed() {
      if (
        this.isValidNetmask(this.formData.netmask) === true
      )
        this.formData.isValid = true
      else
        this.formData.isValid = false
      this.$emit('change', this.formData)
    },
    eval(str) {
      return eval(str)
    },
    isValidNetmask(netmask) {
      const result = netmaskValid(netmask)
      if (result.isValid)
        this.formData.netmask = result.response
      return result.isValid || result.response
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
            :rules="elt.rules"
            :placeholder="elt.placeHolder"
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
