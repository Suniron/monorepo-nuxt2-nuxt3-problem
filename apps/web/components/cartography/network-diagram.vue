<template>
  <v-container class="network-diagram">
    <v-row id="map-toolbar" class="grey lighten-2 pt-2 pl-2 pr-2 mb-0">
      <span>
        <v-btn
          icon
          small
          tile
          elevation="3"
          title="Add an existing asset to the network"
          :outlined="addAssetDrawerOpened"
          :disabled="reorganizing"
          class="large-outline no-ripple"
          @click="addAssetDrawerOpened = !addAssetDrawerOpened"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </span>
      <span class="mr-5">
        <v-btn
          icon
          small
          tile
          elevation="2"
          title="Select and move"
          :outlined="selectedTool === 'selector'"
          class="large-outline no-ripple"
          @click="selectedTool = 'selector'"
        >
          <v-icon small>mdi-cursor-default</v-icon>
        </v-btn>
      </span>
      <span>
        <p class="text-caption d-inline">Create a new asset:</p>
        <v-dialog
          v-for="assetType in assetTypes"
          :key="assetType"
          v-model="isSaveModalOpen[assetType]"
          width="500"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              small
              tile
              elevation="2"
              :title="assetType"
              :disabled="reorganizing"
              v-bind="attrs"
              v-on="on"
            >
              <AssetIcon :os="assetType" :size="16" />
            </v-btn>
          </template>
          <template #default>
            <SaveAssetModal
              :asset="{ type: assetType }"
              @saved="createAssetNode"
              @close="isSaveModalOpen[assetType] = false"
              :allowed-asset-types="assetTypes"
            />
          </template>
        </v-dialog>
      </span>
      <span>
        <p class="text-caption d-inline">Link assets:</p>
        <v-btn
          v-for="linkType in links"
          :key="linkType.value"
          icon
          small
          tile
          elevation="2"
          :title="linkType.text"
          :outlined="selectedTool === linkType.value"
          :disabled="reorganizing"
          class="large-outline no-ripple"
          @click="
            selectedTool =
              selectedTool === linkType.value ? 'selector' : linkType.value
          "
        >
          <v-icon :color="linkType.color">{{ linkType.icon }}</v-icon>
        </v-btn>
      </span>
      <span class="mr-5">
        <v-text-field
          v-model="networkFilter"
          class="ma-0 pa-0"
          placeholder="Search in the network"
          hide-details
          @click.stop=""
          height="32"
        ></v-text-field>
      </span>
      <span>
        <p class="text-caption d-inline">Fit map:</p>
        <v-btn
          icon
          small
          tile
          elevation="2"
          class="large-outline no-ripple"
          title="Adjust map"
          @click="fitGraph()"
        >
          <v-icon>mdi-crosshairs-gps</v-icon>
        </v-btn>
      </span>
      <span class="d-flex align-baseline">
        <p class="text-caption d-inline">Reorganize:</p>
        <div class="ml-1">
          <v-btn
            icon
            small
            tile
            elevation="2"
            class="large-outline no-ripple"
            title="Auto organize map"
            :disabled="loading"
            :loading="reorgaAnimating"
            @click="reorganizeGraph()"
          >
            <v-icon>{{ reorganizing ? 'mdi-reload' : 'mdi-auto-fix' }}</v-icon>
          </v-btn>
          <div
            v-if="reorganizing"
            class="carto-reorga-additional grey lighten-3"
          >
            <v-btn
              icon
              small
              tile
              elevation="2"
              class="large-outline no-ripple"
              title="Cancel reorganizing"
              :disabled="reorgaAnimating"
              @click="reorganizeGraph('cancel')"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn
              icon
              small
              tile
              elevation="2"
              class="large-outline no-ripple"
              title="Confirm current reorganization"
              :disabled="reorgaAnimating"
              @click="reorganizeGraph('confirm')"
            >
              <v-icon>mdi-check-bold</v-icon>
            </v-btn>
          </div>
        </div>
      </span>
      <span class="carto-toolbar-separator flex-grow-1" />
      <span>
        <p class="text-caption d-inline">Export:</p>
        <v-btn
          icon
          small
          tile
          elevation="2"
          title="Download as image"
          :loading="exporting"
          @click="downloadNetwork"
        >
          <v-icon>mdi-download-box-outline</v-icon>
        </v-btn>
      </span>
    </v-row>

    <!-- Modal which is openned on "right click > edit" on an map asset -->
    <v-dialog v-model="isEditAssetDialogOpen" max-width="600px">
      <SaveAssetModal
        :asset="assetToEdit"
        no-asset-info
        is-update
        @saved="editAssetNode"
        @close="closeDialogs"
      />
    </v-dialog>

    <!-- Modal which is openned on "right click > Add asset" on map blank area -->
    <v-dialog v-model="isAddAssetDialogOpen" max-width="600px">
      <SaveAssetModal
        no-asset-info
        @saved="createAssetNodeOnPointerPosition"
        @close="closeDialogs"
      />
    </v-dialog>

    <div
      class="add-asset-panel"
      :class="{
        'panel-open': addAssetDrawerOpened
      }"
      :style="{
        width: addAssetDrawerOpened ? '250px' : '0'
      }"
    >
      <div class="h-100 overflow-y-auto">
        <v-text-field
          v-model="addNodeFilter"
          class="ma-0 pa-1 overflow-y-hidden"
          placeholder="Search assets to add"
          prepend-inner-icon="mdi-magnify"
          hide-details
          @click.stop=""
          height="32"
        ></v-text-field>
        <v-treeview
          :items="groupedAssets"
          :search="addNodeFilter"
          open-on-click
        >
          <template #label="{ item }">
            <draggable
              v-if="item.type"
              :value="assetLists"
              group="addAssetDragGroup"
              :id="item.id"
              :sort="false"
              :put="false"
              :pull="false"
            >
              <v-chip style="margin: 2px" :title="item.name"
                ><AssetIcon :os="item.type" :size="20" />&nbsp;{{
                  item.name
                }}</v-chip
              >
            </draggable>
            <span v-else>{{ item.name }}</span>
          </template>
        </v-treeview>
      </div>
    </div>
    <draggable
      v-model="assetListsCy"
      group="addAssetDragGroup"
      :options="trashOptions"
      @add="assetMoved"
      ghost-class="d-none"
    >
      <div
        :id="'cyto-' + cyId"
        :style="{ width: '100%', height: '700px' }"
      ></div>
    </draggable>
    <asset-edit-drawer
      v-if="isAssetSelected"
      ref="editDrawer"
      :node-selected="isAssetSelected"
      :asset-id="selectedAsset"
      @saved="syncSelectedAsset"
      @close="closeDrawer"
    />
    <!-- <relation-edit-drawer
      v-if="isEdgeSelected"
      :edge-selected="isEdgeSelected"
      :from-asset="selectedAssetFrom"
      :to-asset="selectedAssetTo"
      :selected-edge="selectedEdge"
      @saved="fetchGraphData"
      @close="closeDrawer"
    />-->
    <v-dialog v-model="isDeleteDialogOpen" width="500">
      <template #default>
        <v-card>
          <v-card-title>Delete Element/Asset</v-card-title>
          <v-card-text
            ><p>
              What do you want to do ? <br /><strong>"Delete element"</strong>:
              This action will delete the element from the map ONLY
              <br /><strong>"Delete asset"</strong>: This will delete the asset
              from the system
            </p></v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="isDeleteDialogOpen = false">
              Cancel
            </v-btn>
            <v-btn color="error" text @click="removeElement(true)">
              Delete asset
            </v-btn>
            <v-btn color="primary" text @click="removeElement(false)">
              Delete element
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>

<script>
// Modals
// import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import _ from 'lodash'
import fcose from 'cytoscape-fcose'
import SaveAssetModal from '~/components/assets/save-asset-modal.vue'
import AssetEditDrawer from '~/components/assets/asset-edit-drawer.vue'
// import RelationEditDrawer from '~/components/cartography/dialogs/relation-edit-drawer.vue'
import AssetIcon from '~/components/assets/AssetIcon.vue'
// Services
import {
  fetchCartographyElementsService,
  addCartographyElementService,
  updateCartographyElementService,
  deleteCartographyElementService
} from '~/services/cartography'
// import { getAssetsGraphService } from '~/services/assets/network'
import {
  searchAssetsService,
  createAssetService,
  deleteAssetService,
  searchAssetByIdService
} from '~/services/assets'
import {
  createRelationService,
  deleteRelationService
} from '~/services/relations'
import { severityColor } from '~/utils/color.utils'
import ICONS, { getAssetIcons } from '~/assets/img/icons'

export default {
  name: 'NetworkMap',
  components: {
    SaveAssetModal,
    AssetEditDrawer,
    // RelationEditDrawer,
    draggable,
    AssetIcon
  },
  props: {
    cyId: {
      type: Number,
      required: true
    },
    networkName: {
      type: String,
      default: 'Network'
    }
  },
  data() {
    return {
      networkFilter: '',
      addNodeFilter: '',
      name: '',
      assetLists: [],
      assetListsCy: [],
      assetListsColor: {},
      isDeleteDialogOpen: false,
      isAddAssetDialogOpen: false,
      isEditAssetDialogOpen: false,
      assetToEdit: null,
      isAssetSelected: false,
      isEdgeSelected: false,
      selected: [],
      selectedEdges: [],
      selectedAsset: null,
      assetTypes: ['SERVER', 'WEB', 'USER', 'BUILDING'],
      type: '',
      selectedAssetFrom: { name: '', id: -1 },
      selectedAssetTo: { name: '', id: -1 },
      selectedEdge: {},
      links: [
        {
          value: 'CONNECTED_TO',
          text: 'Is connected to',
          icon: 'mdi-minus',
          color: 'dark'
        },
        {
          value: 'LOCATED_TO',
          text: 'Is located at',
          icon: 'mdi-dots-horizontal',
          color: 'dark'
        },
        {
          value: 'OWN_BY',
          text: 'Is owned by',
          icon: 'mdi-minus',
          color: 'blue lighten-2'
        },
        {
          value: 'MAINTAINED_BY',
          text: 'Is maintained by',
          icon: 'mdi-dots-horizontal',
          color: 'blue lighten-2'
        }
      ],
      link: '',
      trashOptions: {
        group: {
          name: 'trash',
          draggable: '.dropitem',
          put: () => true,
          pull: false
        }
      },
      isSaveModalOpen: {},
      exporting: false,
      selectedTool: 'selector',
      addAssetDrawerOpened: false,
      reorganizing: false,
      reorgaAnimating: false,
      loading: true
    }
  },
  computed: {
    groupedAssets() {
      const grouped = {}
      this.assetLists.forEach((asset) => {
        const assetCopy = _.cloneDeep(asset)
        delete assetCopy.children
        if (grouped[assetCopy.type] === undefined) {
          grouped[assetCopy.type] = {
            id: `group-${Object.keys(grouped).length}`,
            name: assetCopy.type,
            children: [assetCopy]
          }
        } else {
          grouped[assetCopy.type].children.push(assetCopy)
        }
      })

      return Object.values(grouped).sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base'
        })
      })
    }
  },
  watch: {
    networkFilter() {
      const nodes = this.cy.elements()
      nodes.forEach((node) => {
        const nameMatches = node
          .data()
          .name?.toLowerCase()
          .includes(this.networkFilter.toLowerCase())

        const nodeHasMatchingChild =
          node.children((child) =>
            child
              .data()
              .name?.toLowerCase()
              .includes(this.networkFilter.toLowerCase())
          ).length > 0

        const parentHasMatchingChild =
          node.parent().children((child) =>
            child
              .data()
              .name?.toLowerCase()
              .includes(this.networkFilter.toLowerCase())
          ).length > 0

        node.style({
          opacity:
            nameMatches ||
            nodeHasMatchingChild ||
            this.networkFilter.length === 0
              ? '1'
              : '0.1'
        })

        node.parent()?.style({
          opacity:
            parentHasMatchingChild || this.networkFilter.length === 0
              ? '1'
              : '0.1'
        })
      })
    },
    reorganizing() {
      if (this.reorganizing) {
        this.addAssetDrawerOpened = false
      }
      this.configureContextMenus(this.cy)
    }
  },
  created() {
    this.boundKeyDownHandler = this.keyDownHandler.bind(this)
    this.cy = null

    this.ctxMenus = null
    this.edgehandles = null

    this.pointerEvent = null
  },
  destroyed() {
    document.removeEventListener('keydown', this.boundKeyDownHandler)
  },
  async mounted() {
    const [cytoscapeModule, ...extensionModules] = await Promise.all([
      import('cytoscape'),
      // import('cytoscape-node-html-label'),
      import('cytoscape-context-menus'),
      import('cytoscape-edgehandles')
    ])

    this.registerExtensions(
      cytoscapeModule.default,
      extensionModules.map((mod) => mod.default)
    )

    // Other imports
    await Promise.all([
      import('cytoscape-context-menus/cytoscape-context-menus.css')
    ])
    this.initializeGraph(cytoscapeModule.default)
  },
  methods: {
    /**
     * Fit to all elements in the graph
     */
    fitGraph() {
      if (!this.cy) {
        return
      }

      this.cy.fit()
    },
    async assetMoved(evt, orig) {
      const target = evt.originalEvent.target

      const deltaX =
        (evt.originalEvent.clientX -
          target.getBoundingClientRect().x -
          this.cy.viewport().pan().x) /
        this.cy.viewport().zoom()

      const deltaY =
        (evt.originalEvent.clientY -
          target.getBoundingClientRect().y -
          this.cy.viewport().pan().y) /
        this.cy.viewport().zoom()

      const asset = this.assetLists.find((a) => a.id === parseInt(evt.from.id))
      if (asset) {
        const ceId = await addCartographyElementService(
          this.$axios,
          this.cyId,
          {
            asset_id: asset.id,
            cygroup: 'nodes',
            x: deltaX,
            y: deltaY
          }
        )
        const lastNewAssetNode = {
          data: {
            id: ceId,
            name: asset.name,
            group: 'nodes',
            type:
              asset.os?.toLowerCase() ||
              asset.language?.toLowerCase() ||
              asset.type.toLowerCase(),
            asset_id: asset.id
          },
          position: {
            x: deltaX,
            y: deltaY
          },
          classes:
            asset.os?.toLowerCase() ||
            asset.language?.toLowerCase() ||
            asset.type.toLowerCase()
        }
        this.fetchGraphData()
        this.cy.add(lastNewAssetNode)
        return true
      } else return false
    },
    /**
     * Call node asset creation with the last cursor position on map
     * @param {any} asset
     * @returns {void}
     */
    createAssetNodeOnPointerPosition(asset) {
      if (!this.pointerEvent?.position) {
        return this.createAssetNode(asset)
      }

      this.createAssetNode(asset, this.pointerEvent.position)
    },
    /**
     * Create an asset on map. Position can be passed optionnaly
     *
     * @param {any} asset
     * @param {{x: number, y:number}} [position] (Optionnal)
     * @returns {void}
     *
     */
    async createAssetNode(asset, position = null) {
      const ceid = await addCartographyElementService(this.$axios, this.cyId, {
        asset_id: asset.id,
        cygroup: 'nodes',
        ...position
      })

      this.cy.add({
        data: {
          id: ceid,
          name: this.name,
          group: 'nodes',
          asset_id: asset.id
        },
        position,
        classes: this.type.toLowerCase()
      })
      this.name = ''
      this.type = ''
      this.fetchGraphData() // Redrawing the layout to include new node properly
    },
    registerExtensions(cytoscape, extensions = []) {
      cytoscape.use(fcose)
      extensions.forEach((ext) => {
        ext(cytoscape) // register extension
      })
    },
    initializeGraph(cytoscape) {
      this.cy = cytoscape({
        container: document.getElementById('cyto-' + this.cyId),
        style: [
          // the stylesheet for the graph
          {
            selector: 'node',
            style: {
              'background-color': '#666',
              'background-opacity': '0.3',
              label: 'data(name)',
              'border-color': 'data(color)',
              'background-fit': 'cover',
              'background-width-relative-to': 'inner',
              'background-height-relative-to': 'inner',
              'border-width': '2',
              shape: 'round-rectangle',
              padding: '3px'
            }
          },
          {
            selector: 'node:selected',
            style: {
              width: '60%',
              height: '60%',
              'border-width': '6',
              'font-weight': 'bold'
            }
          },

          {
            selector: 'edge',
            style: {
              width: '2',
              'line-color': '#888',
              'line-style': 'solid',
              'curve-style': 'bezier'
            }
          },
          {
            selector: 'edge:selected',
            style: {
              'line-color': '#0C8F10'
            }
          },
          {
            selector: '.OWN_BY',
            style: {
              'line-color': '#9BEDFF'
            }
          },
          {
            selector: '.MAINTAINED_BY',
            style: {
              'line-color': '#9BEDFF',
              'line-style': 'dashed'
            }
          },
          {
            selector: '.LOCATED_TO',
            style: {
              'line-color': '#ddd',
              'line-style': 'dashed'
            }
          },
          ...Object.keys(getAssetIcons(['network'], true)).map((iconName) => ({
            selector: `.${iconName.toLowerCase()}`,
            style: {
              'background-image': `url(${ICONS[iconName].src})`,
              'background-fit': 'cover'
            }
          }))
        ],
        boxSelectionEnabled: true
      })

      this.configureContextMenus(this.cy)
      this.addEdgeHandles(this.cy)
      this.addGraphEvents(this.cy)
      this.fetchGraphData()
    },
    addNodeIcons(cy) {
      cy.nodeHtmlLabel([])
    },
    addGraphEvents(cy) {
      cy.on('cxttap', (evt) => {
        // Note: using optional chaining for select() method due to the background being a valid target with no select method

        // Unselect all elements unless the user is holding shift or ctrl
        // Or if the user is clicking a selected node
        if (
          !(evt.originalEvent.shiftKey || evt.originalEvent.ctrlKey) &&
          !evt.target.selected?.()
        ) {
          this.cy.elements((el) => el.selected).unselect()
        }

        // Selecting the node being right-clicked
        evt.target.select?.()
      })
      cy.on('tap', (evt) => {
        // Waiting for the next tick so all the events have finished firing & propagating
        this.$nextTick(() => {
          // Set the selected asset property if we have a single asset selected
          if (this.selected.length === 1) {
            this.selectedAsset = parseInt(this.selected[0].asset_id)
          }
          // Open the asset edition drawer if we only have a single selected asset and it was a left click
          this.isAssetSelected =
            this.selected.length === 1 && evt.originalEvent.button === 0
        })
      })
      cy.on('layoutstop', () => {
        this.loading = false
      })
      cy.on('dragfree', (evt) => {
        // Do not update the database while reorganizing
        if (!this.reorganizing) {
          this.updateNode(evt.target)
        }
      })
      cy.on('select', 'node', (evt) => {
        if (this.selectedTool !== 'selector') {
          this.startConnectingNodes(this.selectedTool, evt)
          return
        }
        this.isAssetSelected = false
        const node = evt.target
        const data = node.data()
        this.selected.push(data)
      })
      cy.on('unselect', 'node', (evt) => {
        const node = evt.target
        const index = this.selected.indexOf(node.data())
        if (index !== -1) this.selected.splice(index, 1)
      })
      cy.on('select', 'edge', (evt) => {
        const edge = evt.target
        this.selectedEdge = edge.data()
        this.selectedAssetFrom = cy.$('#' + this.selectedEdge.source).data()
        this.selectedAssetTo = cy.$('#' + this.selectedEdge.target).data()
        this.isEdgeSelected = true
        this.selectedEdges.push(edge.data())
      })
      cy.on('unselect', 'edge', (evt) => {
        const edge = evt.target
        const index = this.selectedEdges.indexOf(edge.data())
        if (index !== -1) this.selectedEdges.splice(index, 1)
        this.isEdgeSelected = false
      })
      cy.on('ehcomplete', async (evt, source, target, edge) => {
        const sourceData = cy.$('#' + source.id()).data()
        const targetData = cy.$('#' + target.id()).data()
        const rel = await createRelationService(this.$axios, {
          type: this.link,
          from_asset_id: sourceData.asset_id,
          to_asset_id: targetData.asset_id
        })
        const eid = await addCartographyElementService(this.$axios, this.cyId, {
          relation_id: rel,
          cygroup: 'edges'
        })
        edge.remove()
        this.cy.add({
          data: {
            id: eid,
            source: source.id(),
            target: target.id(),
            name: this.link
          },
          classes: this.link
        })
      })
      document.addEventListener('keydown', this.boundKeyDownHandler)
    },

    keyDownHandler(evt) {
      const isUserFocusInput = ['INPUT', 'TEXTAREA']
      if (isUserFocusInput.includes(document.activeElement.tagName)) {
        return
      }

      // Separating the conditions to allow better extensibility
      if (this.selected.length > 0 && evt.code === 'Delete') {
        this.isDeleteDialogOpen = true
      }
    },

    addEdgeHandles(cy) {
      this.edgehandles = cy.edgehandles()
    },

    async updateNode(node) {
      if (node.isParent()) {
        const children = node.children()
        children.forEach(async (elt) => {
          await updateCartographyElementService(
            this.$axios,
            this.cyId,
            elt.id(),
            {
              x: elt.position('x'),
              y: elt.position('y')
            }
          )
        })
      } else
        await updateCartographyElementService(
          this.$axios,
          this.cyId,
          node.id(),
          {
            x: node.position('x'),
            y: node.position('y')
          }
        )
    },

    configureContextMenus(cy) {
      this.ctxMenus = {
        menuItems: [
          {
            id: 'edit-asset',
            selector: 'node',
            content: 'Edit asset',
            tooltipText: "Edit asset's information",
            onClickFunction: this.openEditAssetDialog
          }
        ].concat(
          this.reorganizing
            ? []
            : [
                {
                  id: 'add-node',
                  content: 'Add asset',
                  tooltipText: 'Add an asset node',
                  coreAsWell: true,
                  onClickFunction: this.openAddAssetNodeDialog
                },
                {
                  id: 'connect-node',
                  selector: 'node',
                  content: 'Connect',
                  tooltipText: 'Connect asset node to other asset node',
                  submenu: this.links.map((elt) => ({
                    id: elt.value,
                    selector: 'node',
                    content: elt.text,
                    onClickFunction: this.startConnectingNodes.bind(
                      this,
                      elt.value
                    )
                  }))
                },
                {
                  id: 'group-node',
                  selector: 'node',
                  content: 'Create Network',
                  tooltipText: 'Set assets in the same network',
                  onClickFunction: this.groupNodes
                },
                {
                  id: 'remove-node',
                  selector: 'node, edge',
                  content: 'Remove',
                  tooltipText: 'Remove element from map',
                  onClickFunction: this.removeDialog
                }
              ]
        )
      }
      this.ctxMenus = cy.contextMenus(this.ctxMenus)
    },
    removeDialog(evt) {
      const asset = evt.target || evt.cyTarget
      if (asset.isNode()) {
        if (!this.selected.includes(asset.data)) {
          this.selected.push(asset.data())
        }
      } else {
        this.selectedEdges.push(asset.data())
      }
      this.isDeleteDialogOpen = true
    },
    async removeElement(rmAsset) {
      await this.selected.forEach(async (elt) => {
        const node = this.cy.$('#' + elt.id)
        if (node.isParent()) {
          const children = node.children()
          children.move({ parent: null })
          children.forEach(async (child) => {
            await updateCartographyElementService(
              this.$axios,
              this.cyId,
              child.id(),
              { parent: '' }
            )
          })
        }
        if (rmAsset) await deleteAssetService(this.$axios, elt.asset_id)
        await deleteCartographyElementService(this.$axios, this.cyId, elt.id)
        this.cy.$('#' + elt.id).remove()
        if (this.selectedAsset === parseInt(elt.asset_id)) {
          this.selectedAsset = null
          this.isAssetSelected = false
        }
      })
      this.selected = []
      await this.selectedEdges.forEach(async (elt) => {
        if (rmAsset) await deleteRelationService(this.$axios, elt.relation_id)
        await deleteCartographyElementService(this.$axios, this.cyId, elt.id)
        this.cy.$('#' + elt.id).remove()
      })
      this.selectedEdges = []
      this.isDeleteDialogOpen = false
      this.fetchGraphData()
    },

    startConnectingNodes(link, evt) {
      this.link = link
      const node = evt.target || evt.cyTarget

      this.edgehandles.start(node)
    },

    async groupNodes(evt) {
      if (this.selected !== 0) {
        let [parent] = this.selected.filter(
          (elt) =>
            this.cy.$('#' + elt.id).isParent() === true ||
            this.cy
              .$('#' + elt.id)
              .data()
              .type.toLowerCase() === 'network'
        )
        if (!parent) {
          const net = await createAssetService(this.$axios, {
            name: 'New Network',
            type: 'NETWORK'
          })
          const ceid = await addCartographyElementService(
            this.$axios,
            this.cyId,
            { asset_id: net.id, cygroup: 'nodes' }
          )
          parent = this.cy.add({
            data: {
              id: ceid,
              name: 'New Network',
              label: '',
              asset_id: net.id
            },
            classes: 'network'
          })
        } else parent = this.cy.$('#' + parent.id)
        this.selected.forEach(async (elt) => {
          if (parent.id() !== elt.id) {
            const node = this.cy.$('#' + elt.id)
            if (node.data('parent') !== parent.id()) {
              await createRelationService(this.$axios, {
                type: 'BELONGS_TO',
                from_asset_id: node.data().asset_id,
                to_asset_id: parent.data().asset_id
              })
              await updateCartographyElementService(
                this.$axios,
                this.cyId,
                elt.id,
                { parent: parent.id() }
              )
              this.fetchGraphData()
              node.move({ parent: parent.id() })
            }
          }
        })
      }
    },

    openEditAssetDialog(evt) {
      this.pointerEvent = evt

      const node = this.cy.getElementById((evt.target || evt.cyTarget).id())
      const nodeData = node.data()
      this.$set(this, 'assetToEdit', { ...nodeData, id: nodeData.asset_id })

      this.isEditAssetDialogOpen = true
    },

    openAddAssetNodeDialog(evt) {
      this.pointerEvent = evt
      this.isAddAssetDialogOpen = true
    },

    closeDialogs() {
      this.isAddAssetDialogOpen = false
      this.isEditAssetDialogOpen = false

      this.pointerEvent = null
      this.assetToEdit = null
    },
    closeDrawer() {
      this.isAssetSelected = false
      this.isEdgeSelected = false
      this.cy.$().unselect()
      this.selected = []
    },
    editAssetNode(payload) {
      const node = this.pointerEvent.target || this.pointerEvent.cyTarget

      const newData = {
        name: payload.name,
        type: payload.type
      }
      node.data(newData)
      this.syncSelectedAsset(node.data().asset_id)
      this.closeDialogs()
    },

    fetchColor(assets) {
      let severity = 0
      let severityName = 'NONE'
      let colorSeverity = ''
      for (let i = 0; i < assets.length; i++) {
        if (assets[i].vulnerabilities.critical > 0) {
          severity = 4
          severityName = 'CRITICAL'
        } else if (assets[i].vulnerabilities.high > 0) {
          severity = 3
          severityName = 'HIGH'
        } else if (assets[i].vulnerabilities.medium > 0) {
          severity = 2
          severityName = 'MEDIUM'
        } else if (assets[i].vulnerabilities.low > 0) {
          severity = 1
          severityName = 'LOW'
        } else {
          severity = 0
          severityName = 'NONE'
        }
        if (severityName === 'NONE') {
          colorSeverity = '#32CD32'
        } else {
          colorSeverity = severityColor(severityName)
        }
        this.assetListsColor[assets[i].id] = {
          severity,
          color: colorSeverity
        }
      }
    },
    assignColor(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].group === 'nodes') {
          data[i].data.severity = this.assetListsColor[
            data[i].data.asset_id
          ].severity
          data[i].data.color = this.assetListsColor[data[i].data.asset_id].color

          let idChild = i
          while (data[idChild].data.parent != null) {
            const isFound = (element) =>
              element.data.id === parseInt(data[idChild].data.parent)
            const idParent = data.findIndex(isFound)
            if (
              idParent !== -1 &&
              data[idParent].data.id === parseInt(data[idChild].data.parent)
            ) {
              if (
                data[idParent].data.severity === undefined ||
                data[idParent].data.severity < data[idChild].data.severity
              ) {
                data[idParent].data.color = data[idChild].data.color
                data[idParent].data.severity = data[idChild].data.severity
                this.assetListsColor[data[idParent].data.asset_id].severity =
                  data[idChild].data.severity
                this.assetListsColor[data[idParent].data.asset_id].color =
                  data[idChild].data.color
                idChild = idParent
              } else break
            } else break
          }
        }
      }
    },

    async fetchGraphData() {
      try {
        this.isAssetSelected = false
        this.selectedAsset = null
        this.selected = []
        this.isEdgeSelected = false
        const { assets } = await searchAssetsService(this.$axios, {})
        const data = await fetchCartographyElementsService(
          this.$axios,
          this.cyId
        )
        this.assetLists = assets.filter(
          (el) => data.findIndex((e) => e.data.asset_id === el.id) < 0
        )
        this.fetchColor(assets)
        this.assignColor(data)
        this.setGraphData(data)
      } catch (error) {
        console.error(error)
      }
    },
    setGraphData(nodesEdges = []) {
      this.cy.elements().remove()
      this.cy.add(nodesEdges)
      this.cy
        .layout({
          name: 'preset'
        })
        .run()
    },
    downloadNetwork() {
      this.exporting = true
      const a = document.createElement('a')
      a.href = this.cy.png({
        full: true
      })
      a.download = `${this.networkName}.png`
      a.click()
      this.exporting = false
    },
    async syncSelectedAsset(assetId = null) {
      let asset = null
      if (this.$refs.editDrawer) {
        // If the edit drawer is open
        asset = await this.$refs.editDrawer?.fetchAssetById()
      } else if (assetId) {
        // If the assetId is passed from the parameters
        asset = await searchAssetByIdService(this.$axios, assetId)
      } else {
        // Else there is no asset to get the info from
        return
      }

      const newData = {
        name: asset.name,
        type: asset.type
      }
      const node = this.cy
        .elements()
        .find((el) => el.data().asset_id === asset.id)
      node.data(newData)
    },
    async reorganizeGraph(action) {
      switch (action) {
        case 'cancel':
          this.fetchGraphData()
          this.reorganizing = false
          break

        case 'confirm':
          this.reorgaAnimating = true
          await Promise.all(
            this.cy.nodes().map((node) => this.updateNode(node))
          )
          this.reorgaAnimating = false
          this.reorganizing = false
          break

        default:
          this.reorganizing = true
          this.reorgaAnimating = true
          this.cy
            .layout({
              name: 'fcose',
              nodeDimensionsIncludeLabels: true,
              quality: 'proof',
              idealEdgeLength: () => 100,
              stop: () => (this.reorgaAnimating = false)
            })
            .run()
          break
      }
    }
  }
}
</script>

<style lang="scss">
#map-toolbar > span {
  margin-left: 10px !important;
  margin-right: 10px !important;
}

#cyto {
  .server-node {
    color: #666;
  }
  .web-node {
    color: #666;
  }
}

.network-diagram {
  &__toolbar {
    background-color: cyan;
    padding: 16px 8px;
    margin-bottom: 20px;
  }

  .v-treeview-node__level {
    width: 0px !important;
  }
}

.large-outline.v-btn--outlined {
  border: solid currentColor;
}

.no-ripple .v-ripple__container {
  opacity: 0 !important;
}

.add-asset-panel {
  position: absolute;
  max-height: 700px;
  height: 700px;
  transition: width 0.2s;
  margin-left: -12px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(189, 189, 189, 0.75);
  backdrop-filter: blur(2px);
}

.add-asset-panel.panel-open {
  transition: width 0.2s;
}

.carto-reorga-additional {
  position: absolute;
  transform: translateX(-22px);
  padding: 4px;
  z-index: 3;
}
</style>
