<script>
export default {
  data() {
    return {
      form: {
        id: this.item.id,
        ipId: null,
        ports: []
      },
      itemPorts: []
    }
  },
  props: {
    ips: {
      type: Array,
      default() {
        return []
      }
    },
    ports: {
      type: Array,
      default() {
        return []
      }
    },
    item: {
      type: Object,
      required: true
    },
    first: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    addIp() {
      if (this.first)
        this.$emit('add')
      else this.$emit('delete', this.form.id)
    },
    ipChange() {
      if (!this.form?.ipId?.address)
        this.form.ipId = { address: this.form.ipId, id: null }
      if (this.ipValidator(this.form.ipId.address)) {
        this.itemPorts = this.ports.filter(
          x => x.address === this.form.ipId.address,
        )
      }
      else { this.form.ipId = '' }
      this.$emit('change', this.form)
    },
    ipValidator(ip) {
      return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ip,
      )
    },
    portChange() {
      this.form.ports = this.form.ports.reduce((arr, e) => {
        if (
          (/[\d]+/.test(e.number) && /(tcp|udp)/.test(e.protocol))
          || /[\d]+\/(tcp|udp)/.test(e)
        ) {
          arr.push({
            id: e?.id || null,
            number: e?.number ?? e.split('/')[0],
            protocol: e?.protocol || e.split('/')[1],
          })
        }
        return arr
      }, [])
      this.$emit('change', this.form)
    },
  },
}
</script>

<template>
  <v-row>
    <v-col cols="12" lg="4">
      <v-combobox
        v-model="form.ipId"
        :items="ips"
        item-text="address"
        label="Affected IP *"
        chips
        @change="ipChange"
      />
    </v-col>
    <v-col cols="12" lg="8">
      <v-combobox
        v-model="form.ports"
        :items="itemPorts"
        :item-text="(item) => `${item.number}/${item.protocol}`"
        label="Affected ports (ex: 139/tcp)"
        chips
        multiple
        deletable-chips
        :append-outer-icon="first ? 'mdi-plus-circle-outline' : 'mdi-delete'"
        @change="portChange"
        @click:append-outer="addIp"
      >
        <!-- <template slot="selection" slot-scope="data">
          {{ data.item.number }}/{{ data.item.protocol }}
        </template>
        <template slot="item" slot-scope="data">
          {{ data.item.number }}/{{ data.item.protocol }}
        </template> -->
      </v-combobox>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.v-input__icon--append-outer .v-icon {
  color: #0c8f10;
}
</style>
