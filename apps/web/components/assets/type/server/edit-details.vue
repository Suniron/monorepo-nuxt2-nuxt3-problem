<template>
  <div class="d-flex">
    <v-row
      class="d-flex flex-column mr-4 justify-space-around m-5 w-50 bg-secondary rounded-0"
    >
      <v-col>
        <v-text-field
          label="Asset Name"
          v-model="formData.name"
          @change="assetChanged"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="formData.os"
          label="Operating System"
          @change="assetChanged"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="formData.hostname"
          label="Hostname"
          @change="assetChanged"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="formData.OWN_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Owner"
          @change="assetChanged"
          multiple
          small-chips
          deletable-chips
        />
      </v-col>
      <v-col>
        <v-select
          v-model="formData.MAINTAINED_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Maintainer"
          @change="assetChanged"
          multiple
          small-chips
          deletable-chips
        />
      </v-col>
      <v-col>
        <v-select
          v-model="formData.LOCATED_TO"
          :items="selectAssets(['BUILDING'])"
          item-text="name"
          item-value="id"
          label="Located to"
          @change="assetChanged"
        />
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="formData.IPs">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Address info</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <!-- THIS MODAL IS USED FOR CREATING OR UPDATING AN IP. -->
          <v-dialog v-model="isModalOpen" max-width="800px">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="resetItemSelected()"
                color="primary"
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                >Add address</v-btn
              >
            </template>
            <v-card>
              <v-form v-model="isFormValid">
                <v-card-title
                  ><span class="text-h5">{{ formTitle }}</span></v-card-title
                >
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field
                          v-model="itemSelected.address"
                          :rules="[ipValidation]"
                          label="Address"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field
                          v-model="itemSelected.mac"
                          :rules="[macValidation]"
                          label="Mac"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field
                          v-model="itemSelected.iface"
                          label="Interface"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field
                          v-model="itemSelected.mask"
                          label="Netmask"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="mr-2" @click.stop="cancelAndResetState">
                    {{ $t('action.cancel') }}</v-btn
                  >
                  <v-btn
                    color="primary"
                    :disabled="!isFormValid"
                    @click.stop="saveAddress"
                  >
                    {{ $t('action.save') }}</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>

          <!-- THIS IS THE MODAL TO DELETE AN IP -->
          <v-dialog v-model="dialogDelete" max-width="540px">
            <v-card>
              <v-card-title class="justify-center red--text font-weight-bold">
                {{ $t('t.irreversibleAction') }}
              </v-card-title>
              <v-card-text class="font-weight-bold">
                {{ $t('t.deleteMessage') }}
                <span class="black--text"> {{ itemSelected.address }} </span>?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mr-2" @click="close">
                  {{ $t('action.cancel') }}</v-btn
                >
                <v-btn color="error" @click="deleteItem(itemSelected)">
                  {{ $t('action.deleteMyIps') }}
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!--  END OF MODAL -->
        </v-toolbar>
      </template>
      <template #[`item.actions`]="item">
        <!-- WHERE WE DISPLAY THE EDIT AND DELETE BTN -->
        <v-icon
          small
          class="mr-2"
          @click="
            isModalOpen = true
            isCreating = false
            itemSelected = cloneDeep(item.item)
          "
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="
            dialogDelete = true
            itemSelected = cloneDeep(item.item)
          "
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- THIS IS WHERE WE DISPLAY THE SNACKBAR,
    WE'LL HAVE TO CHANGE THE SNACKTEXT, SNACKCOLOR TO DISPLAY DIFFERENTS INFORMATIONS -->
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
    </v-snackbar>
  </div>
</template>
<script>
import _ from 'lodash'
import { searchAssetsService } from '~/services/assets'
import {
  deleteIpService,
  updateIpService,
  createIpService
} from '~/services/ips'
export default {
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: this.asset?.name,
        os: this.asset?.os,
        hostname: this.asset?.hostname,
        IPs: _.cloneDeep(this.asset.ips),
        OWN_BY: this.fetchRelations('OWN_BY', true),
        MAINTAINED_BY: this.fetchRelations('MAINTAINED_BY', true),
        LOCATED_TO: this.fetchRelations('LOCATED_TO', false)
      },
      headers: [
        { text: 'Address', value: 'address' },
        { text: 'Mac', value: 'mac' },
        { text: 'Iface', value: 'iface' },
        { text: 'Netmask', value: 'mask' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      snack: false,
      snackColor: '',
      snackText: '',
      isModalOpen: false,
      dialogDelete: false,
      isFormValid: true,
      itemSelected: {
        address: '',
        mac: '',
        iface: '',
        mask: ''
      },
      assets: [],
      isCreating: true
    }
  },
  computed: {
    formTitle() {
      return this.isCreating ? 'New Address' : 'Edit Address'
    }
  },
  watch: {
    'formData.hostname'(newValue) {
      if (newValue?.trim() === '') {
        this.formData.hostname = null
      }
    },
    'formData.os'(newValue) {
      if (newValue?.trim() === '') {
        this.formData.os = null
      }
    }
  },
  created() {
    this.fetchAssets()
  },
  methods: {
    cloneDeep(value) {
      return _.cloneDeep(value)
    },
    async fetchAssets() {
      const serviceParams = {}
      serviceParams.types = ['USER', 'BUILDING', 'GROUP']
      // serviceParams.attribute = 'name'
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.assets = assets
    },
    selectAssets(types) {
      const res = this.assets.filter((elt) => types.includes(elt.type))
      return res
    },
    assetChanged() {
      this.$emit('change', this.formData)
    },
    ipValidation(ip) {
      return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ip
      )
    },
    macValidation(mac) {
      return (
        /^[0-9a-fA-F]{1,2}([.:-])(?:[0-9a-fA-F]{1,2}\1){4}[0-9a-fA-F]{1,2}$/.test(
          mac
        ) ||
        mac === null ||
        mac === ''
      )
    },
    close() {
      this.isModalOpen = false
      this.dialogDelete = false
    },
    async saveAddress() {
      if (this.isCreating) {
        this.itemSelected.assetId = this.asset.id
        const { status } = await createIpService(this.$axios, this.itemSelected)
        if (status === 201) {
          this.snack = true
          this.snackColor = 'success'
          this.snackText = 'Address created'
          this.$root.$emit('fetchDataAgain')
        } else {
          this.snack = true
          this.snackColor = 'error'
          this.snackText = 'Something went wrong'
        }
      } else {
        const { status } = await updateIpService(this.$axios, this.itemSelected)
        if (status === 204) {
          this.snack = true
          this.snackColor = 'success'
          this.snackText = 'Address updated'
          this.$root.$emit('fetchDataAgain')
        } else {
          this.snack = true
          this.snackColor = 'error'
          this.snackText = 'Something went wrong'
        }
      }
      this.close()
    },
    cancelAndResetState() {
      this.close()
      this.formData = {
        name: this.asset?.name,
        os: this.asset?.os,
        IPs: _.cloneDeep(this.asset.ips),
        OWN_BY: this.fetchRelations('OWN_BY', true),
        MAINTAINED_BY: this.fetchRelations('MAINTAINED_BY', true),
        LOCATED_TO: this.fetchRelations('LOCATED_TO', false)
      }
    },
    resetItemSelected() {
      this.isCreating = true
      this.itemSelected = {
        address: '',
        mac: '',
        iface: '',
        mask: ''
      }
    },
    async deleteItem(item) {
      const { status } = await deleteIpService(
        this.$axios,
        this.itemSelected.id
      )
      if (status === 204) {
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'IP deleted'
        this.formData.IPs.splice(this.formData.IPs.indexOf(item), 1)
      } else {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'Something went wrong'
      }
      this.dialogDelete = false
    },
    fetchRelations(rel, multiple) {
      const result = this.asset.relations
        ? this.asset?.relations.filter((elt) => {
            return elt.type === rel
          })
        : []
      if (multiple && result.length > 0) return result.map((elt) => elt.to_id)
      else if (!multiple && result.length === 1) return result[0].to_id
      else return multiple ? [] : null
    }
  }
}
</script>
