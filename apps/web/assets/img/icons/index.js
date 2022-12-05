import path from 'path'

const ICONS = {
  windows: {
    src: '/img/icons/windows.png',
    alt: 'Microsoft Windows icon'
  },
  macos: {
    src: '/img/icons/mac-os.png',
    alt: 'macOS icon'
  },
  ubuntu: {
    src: '/img/icons/ubuntu.png'
  },
  debian: {
    src: '/img/icons/debian.png'
  },
  redhat: {
    src: '/img/icons/redhat.png',
    alt: 'Red Hat icon'
  },
  php: {
    src: '/img/icons/php.png',
    alt: 'PHP icon'
  },
  user: {
    src: '/img/icons/user.png'
  },
  usergroup: {
    src: '/img/icons/users.png'
  },
  building: {
    src: '/img/icons/building.png'
  },
  certif: {
    src: '/img/icons/certif.png'
  },
  unit: {
    src: '/img/icons/unit.png'
  },
  mission: {
    src: '/img/icons/mission.png'
  },
  policy: {
    src: '/img/icons/documents.png'
  },
  procedure: {
    src: '/img/icons/documents.png'
  },
  network: {
    src: '/img/icons/network.png',
    alt: 'Microsoft Windows icon',
    // eslint-disable-next-line no-loss-of-precision
    width: 70.32258064516129,
    height: 60
  },
  web: {
    src: '/img/icons/web.png'
  },
  server: {
    src: '/img/icons/server.png'
  },
  linux: {
    src: '/img/icons/linux.png'
  },
  centos: {
    src: '/img/icons/centos.png'
  },
  eos: {
    src: '/img/icons/eos.jpg',
    alt: 'EOS icon'
  },
  sunos: {
    src: '/img/icons/sunos.jpg'
  },
  hp: {
    src: '/img/icons/hp.png',
    alt: 'HP icon'
  },
  xerox: {
    src: '/img/icons/xerox.jpg'
  },
  dell: {
    src: '/img/icons/dell.png'
  },
  cisco: {
    src: '/img/icons/cisco.png'
  },
  mikrotik: {
    src: '/img/icons/mikrotik.png'
  },
  huawei: {
    src: '/img/icons/huawei.png'
  },
  '3com': {
    src: '/img/icons/3com.png'
  },
  firewall: {
    src: '/img/icons/firewall.png'
  },
  wifi: {
    src: '/img/icons/wifi.png'
  },
  vuejs: {
    src: '/img/icons/vuejs.png'
  },
  nodejs: {
    src: '/img/icons/nodejs.png'
  },
  internet: {
    src: '/img/icons/internet.png'
  },
  computer: {
    src: '/img/icons/computer.png'
  },
  ldap: {
    src: '/img/icons/ldap.png'
  },
  switch: {
    src: '/img/icons/switch.png'
  },
  printer: {
    src: '/img/icons/printer.png'
  },
  vpn: {
    src: '/img/icons/vpn.png'
  },
  fortios: {
    src: '/img/icons/fortios.png'
  },
  unix: {
    src: '/img/icons/linux.png'
  },
  'os/400': {
    src: '/img/icons/os/as400.png'
  }
}

function importAll(r) {
  return r.keys().map(r)
}

const images = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/))

Object.keys(ICONS).forEach((assetType) => {
  // Setting the default values
  ICONS[assetType] = {
    alt: assetType.charAt(0).toUpperCase() + assetType.slice(1),
    width: 60,
    height: 60,
    ...ICONS[assetType]
  }

  // if (process.env.NODE_ENV === 'development') {
  ICONS[assetType].src = images.find((p) =>
    p.includes(path.basename(`/${ICONS[assetType].src.split('.')[0]}.`))
  )
  // }
})

/**
 * @typedef {keyof typeof ICONS} iconName
 */

/**
 * Returns the ist of assets icons
 * @param {iconName[]} [filter=typeof keyof ICONS]
 * @param {boolean} [blacklist=false]
 * @returns {{
 *  src: string,
 *  alt: string,
 *  width: number,
 *  height: number,
 * }}
 */
export function getAssetIcons(filter = Object.keys(ICONS), blacklist = false) {
  const filteredAssetIcons = {}
  Object.keys(ICONS).forEach((iconName) => {
    if (filter.includes(iconName) !== blacklist) {
      filteredAssetIcons[iconName] = ICONS[iconName]
    }
  })

  return filteredAssetIcons
}

export default ICONS
