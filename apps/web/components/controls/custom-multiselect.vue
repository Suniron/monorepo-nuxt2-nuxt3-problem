<template>
  <div>
    <v-select
      :items="values"
      item-value="id"
      item-text="name"
      :value="selected"
      class="custom-multiselect"
      multiple
      chips
      deletable-chips
      @change="changeValues"
      @click.stop="removeTabIndex"
      v-bind="$attrs"
      :label="placeholder"
      single-line
      :menu-props="{
        contentClass: 'custom-multiselect__no-tabindex',
        disableKeys: true,
        bottom: true,
        offsetY: true,
        closeOnClick: true
      }"
    >
      <template #selection="{ item, index }">
        <v-chip
          v-if="index <= visibleItems"
          :color="item.color"
          :close="index < visibleItems"
          @click:close="unselectValue(item)"
        >
          {{ getChipText(item, index) }}
        </v-chip>
      </template>
      <template #append-item>
        <slot />
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  name: 'CustomMultiselect',
  props: {
    values: {
      type: Array,
      required: true
    },
    /**
     * The IDs of the selected values
     */
    selectedValues: {
      type: Array,
      required: true,
      default: () => []
    },
    /**
     * Number of item chips shown before showing "+10" chip indicator of more items selected
     */
    visibleItems: {
      type: Number,
      default: 3
    },
    placeholder: {
      type: String,
      default: 'Select a value'
    }
  },
  computed: {
    /**
     * Resolves the selected values to their IDs if they are objects with an 'id' property
     */
    selectedIds() {
      return this.selectedValues.map(
        (selectedValue) => selectedValue.id ?? selectedValue
      )
    },
    selected() {
      return this.selectedIds.map(this.getValueFormId)
    }
  },
  watch: {
    values(_, oldValues) {
      if (oldValues.length === 0) {
        return
      }
      this.selectedIds
        .filter((selectedValue) => {
          return !this.values.find((value) => value.id === selectedValue)
        })
        .forEach((removedValueId) => {
          this.unselectValue(oldValues.find((val) => val.id === removedValueId))
        })
    }
  },
  methods: {
    removeTabIndex() {
      // This is a workaround to remove the tabindex from the menu items, preventing the "enter" key from being used in the slot
      this.$nextTick(() => {
        const config = { attributes: true, childList: true, subtree: true }
        const parents = document.querySelectorAll(
          '.custom-multiselect__no-tabindex'
        )
        ;[...parents].forEach((parent) => {
          new MutationObserver(() => {
            const elements = [...parent.querySelectorAll('*[tabindex = "0"]')]
            elements.forEach((element) => {
              element.setAttribute('tabindex', '-1')
            })
          }).observe(parent, config)
        })
      })
    },
    getValueFormId(valueId) {
      return this.values.find((val) => val.id === valueId)
    },
    getChipText(item, idx) {
      if (idx < this.visibleItems) return item.name
      return '+' + (this.selectedIds.length - this.visibleItems)
    },
    unselectValue(value) {
      this.changeValues(this.selectedIds.filter((valId) => valId !== value.id))
    },
    changeValues(newIds) {
      const newValues = newIds.map((valueId) =>
        this.values.find((val) => val.id === valueId)
      )
      this.$emit('change', newValues)
    }
  }
}
</script>

<style lang="scss">
.custom-multiselect {
  display: inline-flex;
}
</style>
