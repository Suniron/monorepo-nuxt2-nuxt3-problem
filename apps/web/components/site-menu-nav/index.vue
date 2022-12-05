<template>
  <!--
    Had to use a mouse event because of Vuetify bug:
    https://github.com/vuetifyjs/vuetify/issues/14585
  -->
  <v-navigation-drawer
    :value="show"
    @input="(e) => $emit('update:show', e)"
    app
    permanent
    :mini-variant="expandLock === false"
    :expand-on-hover="expandLock === false"
    :width="expandLock || mouseOver ? 256 : 56"
    @mouseenter.native="mouseOver = true"
    @mouseleave.native="mouseOver = false"
  >
    <!-- Logged in menu -->
    <v-list
      v-if="isLoggedIn"
      class="site-nav-list pl-0 pr-0 text-no-wrap"
      dense
      nav
    >
      <!-- Xrator Logo -->
      <v-list-item>
        <v-list-item-content>
          <img
            v-if="expandLock || mouseOver"
            class="logo-img"
            src="~/assets/img/logos/xrator-brand.png"
            alt="Xrator logo"
          />
          <img
            v-else
            class="logo-img"
            src="~/assets/img/logos/xrator-icon.png"
            alt="Xrator logo"
          />
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <!-- ### MENU ITEMS ### -->
      <!-- Dashboard menu item -->
      <SimpleMenuItem title="Dashboard" to="/dashboard" icon="mdi-chart-box" />

      <!-- Assets menu item -->
      <DropdownMenuItem :item="assets" @open="refreshAssetSummary" />

      <!-- Scans menu item -->
      <SimpleMenuItem title="Scans" to="/scans" icon="mdi-cube-scan" />

      <!-- Vulnerabilities menu item -->
      <SimpleMenuItem
        title="Vulnerabilities"
        to="/vulnerabilities"
        icon="mdi-bug"
      />

      <!-- Business Impact menu item -->
      <SimpleMenuItem
        title="Business Impact"
        to="/business-impact"
        icon="mdi-glass-fragile"
      />

      <!-- Remediation Project menu item -->
      <SimpleMenuItem title="Remediation Projects" to="/remediation-projects">
        <template #custom-icon>
          <v-list-item-icon>
            <img
              class="logo-img"
              src="~/assets/img/icons/health-cure.svg"
              alt="Health Cure Logo"
            />
          </v-list-item-icon>
        </template>
      </SimpleMenuItem>

      <!-- Cartography menu item -->
      <DropdownMenuItem :item="cartography" />

      <!-- Governance menu item -->
      <DropdownMenuItem :item="governance" @open="refreshAssetSummary" />

      <!-- Audit menu item -->
      <SimpleMenuItem title="Audit" to="/audit" icon="mdi-account-box" />

      <!-- Sensors menu item -->
      <SimpleMenuItem
        title="Sensors"
        to="/sensors"
        icon="mdi-access-point-network"
      />

      <!-- Settings menu item -->
      <SimpleMenuItem
        title="Settings"
        to="/settings"
        icon="mdi-cog"
        v-if="isUserAdmin"
      />
    </v-list>

    <!-- Logged out menu -->
    <v-list v-else class="site-nav-list" dense nav>
      <v-list-item>
        <v-list-item-content>
          <img
            class="logo-img"
            src="~/assets/img/logos/xrator-brand.png"
            alt="Xrator logo"
          />
        </v-list-item-content>
      </v-list-item>

      <v-list-item nuxt to="/sign-in" v-test="'navbar-sign-in'">
        <v-list-item-icon>
          <v-icon>mdi-login</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          Sign in
        </v-list-item-content>
      </v-list-item>
      <!-- Temporarily commented signup since there wont be signup soon -->
      <!-- <v-list-item nuxt to="/sign-up">
        <v-list-item-icon>
          <v-icon>mdi-account-plus</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          Sign up
        </v-list-item-content>
      </v-list-item> -->
    </v-list>
    <template #append>
      <div v-if="mouseOver" class="mx-3 text-center grey--text">
        <p class="ma-0">Version: {{ version }}</p>
      </div>
      <v-list class="site-nav-list text-no-wrap" dense nav>
        <v-list-item @click="toggleExpandLock">
          <v-list-item-icon>
            <v-icon> {{ expandLock ? 'mdi-lock' : 'mdi-lock-open' }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            Lock menu
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
// @ts-check
import { mapGetters, mapActions } from 'vuex'
import SimpleMenuItem from './SimpleMenuItem.vue'
import DropdownMenuItem from '~/components/site-menu-nav/DropdownMenuItem.vue'
import ICONS from '~/assets/img/icons'

export default {
  name: 'SiteNavMenu',
  components: { DropdownMenuItem, SimpleMenuItem },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    expandLock: false,
    mouseOver: false,
    governance: {
      action: 'mdi-archive-arrow-down',
      items: [
        {
          title: 'Policy',
          assetType: 'POLICY',
          link: '/assets?types=POLICY',
          icon: 'mdi-file-alert'
        },
        {
          title: 'Procedure',
          assetType: 'PROCEDURE',
          link: '/assets?types=PROCEDURE',
          icon: 'mdi-file-lock'
        }
      ],
      title: 'Governance'
    },
    assets: {
      action: 'mdi-server',
      items: [
        {
          title: 'All',
          assetType: 'ALL',
          link: '/assets'
        },
        {
          title: 'Server',
          assetType: 'SERVER',
          link: '/assets?types=SERVER',
          customImg: ICONS.server
        },
        {
          title: 'Web',
          assetType: 'WEB',
          link: '/assets?types=WEB',
          customImg: ICONS.web
        },
        {
          title: 'Network',
          assetType: 'NETWORK',
          link: '/assets?types=NETWORK',
          customImg: ICONS.network
        },
        {
          title: 'People',
          assetType: 'USER',
          link: '/assets?types=USER',
          customImg: ICONS.user
        },
        {
          title: 'Building',
          assetType: 'BUILDING',
          link: '/assets?types=BUILDING',
          customImg: ICONS.building
        },
        {
          title: 'Business Unit',
          assetType: 'UNIT',
          link: '/assets?types=UNIT',
          customImg: ICONS.unit
        },
        {
          title: 'Business Mission',
          assetType: 'MISSION',
          link: '/assets?types=MISSION',
          customImg: ICONS.mission
        },
        {
          title: 'User Group',
          assetType: 'USERGROUP',
          link: '/assets?types=USERGROUP',
          customImg: ICONS.usergroup
        }
      ],
      title: 'Assets'
    },
    cartography: {
      action: 'mdi-graphql',
      items: [
        {
          title: 'Network',
          link: '/cartography/network',
          icon: 'mdi-network'
        },
        {
          title: 'World Map',
          link: '/cartography/worldmap',
          icon: 'mdi-map-marker'
        }
      ],
      title: 'Cartography'
    }
  }),
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    /**
     * @returns {boolean}
     */
    isUserAdmin() {
      return this.$store.getters['user/isAdmin']
    },
    /**
     * @returns {string}
     */
    version() {
      return process.env.PACKAGE_VERSION
    }
  },
  mounted() {
    this.expandLock = localStorage.getItem('userpref-navbar-lock') === '1'

    // Forcing navbar to update because of a vuetify bug which ignores the dynamic width on initialization
    this.expandLock = !this.expandLock
    setImmediate(() => {
      this.expandLock = !this.expandLock
    })
  },
  methods: {
    ...mapActions('user', ['deauthorize']),
    ...mapActions('assets', ['updateAssetSummary']),
    toggleExpandLock() {
      this.expandLock = !this.expandLock
      localStorage.setItem('userpref-navbar-lock', this.expandLock ? '1' : '0')
    },
    refreshAssetSummary() {
      this.updateAssetSummary(this.$axios)
    }
  }
}
</script>

<style lang="scss">
.site-nav-list {
  .logo-img {
    width: 100%;
  }
}

a.v-list-item .logo-img {
  opacity: 0.54;
}

a.v-list-item--active .logo-img {
  opacity: 1;
}
</style>
