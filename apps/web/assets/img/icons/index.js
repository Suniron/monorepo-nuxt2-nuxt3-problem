import path from 'path'

const ICONS = {
  '3com': {
    src: '/img/icons/3com.png',
  },
  'building': {
    src: '/img/icons/building.png',
  },
  'centos': {
    src: '/img/icons/centos.png',
  },
  'certif': {
    src: '/img/icons/certif.png',
  },
  'cisco': {
    src: '/img/icons/cisco.png',
  },
  'computer': {
    src: '/img/icons/computer.png',
  },
  'debian': {
    src: '/img/icons/debian.png',
  },
  'dell': {
    src: '/img/icons/dell.png',
  },
  'eos': {
    alt: 'EOS icon',
    src: '/img/icons/eos.jpg',
  },
  'firewall': {
    src: '/img/icons/firewall.png',
  },
  'fortios': {
    src: '/img/icons/fortios.png',
  },
  'hp': {
    alt: 'HP icon',
    src: '/img/icons/hp.png',
  },
  'huawei': {
    src: '/img/icons/huawei.png',
  },
  'internet': {
    src: '/img/icons/internet.png',
  },
  'ldap': {
    src: '/img/icons/ldap.png',
  },
  'linux': {
    src: '/img/icons/linux.png',
  },
  'macos': {
    alt: 'macOS icon',
    src: '/img/icons/mac-os.png',
  },
  'mikrotik': {
    src: '/img/icons/mikrotik.png',
  },
  'mission': {
    src: '/img/icons/mission.png',
  },
  'network': {
    alt: 'Microsoft Windows icon',
    height: 60,

    src: '/img/icons/network.png',
    width: 70.32258064516129,
  },
  'nodejs': {
    src: '/img/icons/nodejs.png',
  },
  'os/400': {
    src: '/img/icons/os/as400.png',
  },
  'php': {
    alt: 'PHP icon',
    src: '/img/icons/php.png',
  },
  'policy': {
    src: '/img/icons/documents.png',
  },
  'printer': {
    src: '/img/icons/printer.png',
  },
  'procedure': {
    src: '/img/icons/documents.png',
  },
  'redhat': {
    alt: 'Red Hat icon',
    src: '/img/icons/redhat.png',
  },
  'server': {
    src: '/img/icons/server.png',
  },
  'sunos': {
    src: '/img/icons/sunos.jpg',
  },
  'switch': {
    src: '/img/icons/switch.png',
  },
  'ubuntu': {
    src: '/img/icons/ubuntu.png',
  },
  'unit': {
    src: '/img/icons/unit.png',
  },
  'unix': {
    src: '/img/icons/linux.png',
  },
  'user': {
    src: '/img/icons/user.png',
  },
  'usergroup': {
    src: '/img/icons/users.png',
  },
  'vpn': {
    src: '/img/icons/vpn.png',
  },
  'vuejs': {
    src: '/img/icons/vuejs.png',
  },
  'web': {
    src: '/img/icons/web.png',
  },
  'wifi': {
    src: '/img/icons/wifi.png',
  },
  'windows': {
    alt: 'Microsoft Windows icon',
    src: '/img/icons/windows.png',
  },
  'xerox': {
    src: '/img/icons/xerox.jpg',
  },
}

function importAll(r) {
  return r.keys().map(r)
}

const images = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/))

Object.keys(ICONS).forEach((assetType) => {
  // Setting the default values
  ICONS[assetType] = {
    alt: assetType.charAt(0).toUpperCase() + assetType.slice(1),
    height: 60,
    width: 60,
    ...ICONS[assetType],
  }

  // if (process.env.NODE_ENV === 'development') {
  ICONS[assetType].src = images.find(p =>
    p.includes(path.basename(`/${ICONS[assetType].src.split('.')[0]}.`)),
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
    if (filter.includes(iconName) !== blacklist)
      filteredAssetIcons[iconName] = ICONS[iconName]
  })

  return filteredAssetIcons
}

export default ICONS
