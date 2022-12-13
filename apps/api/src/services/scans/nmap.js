// Handful patterns
// -- IP regex
const p_ip_elementary
  = '(?:[\\d]{1,3})\\.(?:[\\d]{1,3})\\.(?:[\\d]{1,3})\\.(?:[\\d]{1,3})'
const p_mac_elementary = '[0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F]'

// Nmap Normal Output patterns
// -- Target
const p_ip_nmap5
  = `Interesting.*on\\s(?:(?<fqdn_nmap5>.*) (?=\\((?<ip_nmap5>${
   p_ip_elementary
   })\\)))|Interesting.*on\\s(?<ip_only_nmap5>.*)\\:`
const p_ip_nmap6
  = `Nmap.*for\\s(?:(?<fqdn_nmap6>.*) (?=\\((?<ip_nmap6>${
   p_ip_elementary
   })\\)))|Nmap.*for\\s(?<ip_only_nmap6>${
   p_ip_elementary
   })`

const p_ip = new RegExp(`${p_ip_nmap5}|${p_ip_nmap6}`)

// -- rDNS
const p_rdns = new RegExp(
  `rDNS record for (?<ip>${p_ip_elementary}):\\s(?<rdns>.*)`,
)

// -- Port header
const p_port_header = /^(?<port>PORT)\s+(?<state>STATE)\s+(?<service>SERVICE)\s+(?<reason>REASON\s*)?(?<version>VERSION$)?/

// -- Port finding
const p_port_without_reason = /^(?<number>[\d]+)\/(?<protocol>tcp|udp)\s+(?:open|open\|filtered)\s+(?<service>[\w\S]*)(?:\s*(?<version>.*))?$/
const p_port_with_reason = /^(?<number>[\d]+)\/(?<protocol>tcp|udp)\s+(?:open|open\|filtered)\s+(?<service>[\w\S]*)\s+(?<reason>.* ttl [\d]+)\s*(?:\s*(?<version>.*))$/

// -- Script output finding
const p_script = /^\|[\s|\_](?<script>.*)$/

// -- MAC address
const p_mac = new RegExp(
  `MAC Address:\\s(?<mac_addr>(${
    p_mac_elementary
    }))\\s\\((?<mac_vendor>.*)\\)`,
)

// -- OS detection (pattern order is important, the latter position the more precise and reliable the information is)
const p_os = /(?:^Service Info: OS|^OS|\s+OS|^OS details|smb-os-discovery|\|):\s(?<os>[^;]+)/

// -- Network distance
const p_network_dist = /Network Distance:\s(?<hop_number>\d+)\shops?/

// Nmap Grepable output
// -- Target, Ports
const p_grepable = /(?<whole_line>^Host:\s.*)/

// Traceroute output
// -- traceroute normal line
const t_line
  = `^\\d+\\s+\\d+\\.\\d+\\sms\\s+((?<fqdn>.*)\\s\\((?<ipv4_1>${
   p_ip_elementary
   })\\)|(?<ipv4_2>${
   p_ip_elementary
   }))`

// -- traceroute unknown hop
const t_unknown = '^(?<dummy>\\d)\\s+\\.\\.\\.'

// -- traceroute same as
const t_same_as
  = `^Hop (?<start>\\d)(-(?<end>\\d)|)\\sis\\sthe\\ssame\\sas\\sfor\\s(?<orig>${
   p_ip_elementary
   })`

// -- traceroute reg
const t_reg = new RegExp(`(${t_line}|${t_unknown}|${t_same_as})`)

// Handful functions
const dottedquad_to_num = (ip) => {
  /**
   *    Convert decimal dotted quad string IP to long integer
   **/
  const d = ip.split('.')
  return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3]
}

/**
 *    Check the list for a potential pattern match
 *    @param list : a list of potential matching groups
 *    @rtype : return the string representation of the unique value that matched, or nothing if nothing matched
 **/
const unique_match_from_list = (list) => {
  let result = ''
  for (const item in list) {
    if (list[item] !== undefined)
      result = list[item].toString()
  }

  return result
}

/**
 *  Return the desired group_name from a list of matching patterns
 * @param regex : a regular expression with named groups
 * @param group_name : the desired matching group name value
 * @param unfiltered_list : a list of matches
 * @rtype : the string value
 */
const extract_matching_pattern = (regex, group_name, unfiltered_list) => {
  let result = ''
  const filtered_list = unfiltered_list.filter(e => e.match(regex))

  if (filtered_list.length === 1) {
    const filtered_string = filtered_list.join('')
    result = filtered_string.match(regex).groups[group_name]
  }
  return result
}

class Host {
  constructor(ip, hostname = undefined) {
    this.ip_dottedquad = ip
    this.ip_num = dottedquad_to_num(ip)
    this.hostname = hostname === '' ? [] : [hostname]
    this.rdns = undefined
    this.ports = {}
    this.os = undefined
    this.mac = undefined
    this.mac_address_vendor = undefined
    this.network_distance = undefined
    this.type = 'SERVER'
    this.trace = []
  }

  add_port(port) {
    this.ports[`${port.number}/${port.protocol}`] = port
  }

  // Getters
  get get_ip_num_format() {
    return this.ip_num.toString()
  }

  get get_ip_dotted_format() {
    return this.ip_dottedquad.toString()
  }

  get get_fqdn() {
    return this.hostname
  }

  get get_rdns_record() {
    return this.rdns.toString()
  }

  get get_port_list() {
    return this.ports
  }

  get get_port_number_list() {
    if (!this.get_port_list) {
      return ['']
    }
    else {
      const result = []
      const ports = this.get_port_list
      for (const port in ports)
        result.push(port.get_number)
      return result
    }
  }

  get get_port_protocol_list() {
    if (!this.get_port_list) {
      return ['']
    }
    else {
      const result = []
      const ports = this.get_port_list
      for (const port in ports)
        result.push(port.get_protocol)
      return result
    }
  }

  get get_port_service_list() {
    if (!this.get_port_list) {
      return ['']
    }
    else {
      const result = []
      const ports = this.get_port_list
      for (const port in ports) result.push(port.get_service)
      return result
    }
  }

  get get_port_version_list() {
    if (!this.get_port_list) {
      return ['']
    }
    else {
      const result = []
      const ports = this.get_port_list
      for (const port in ports)
        result.push(port.get_version)
      return result
    }
  }

  get get_port_script_list() {
    if (!this.get_port_list) {
      return ['']
    }
    else {
      const result = []
      const ports = this.get_port_list
      for (const port in ports)
        result.push(port.get_script)
      return result
    }
  }

  get get_os() {
    return this.os.toString()
  }

  get get_mac_address() {
    return this.mac.toString()
  }

  get get_mac_address_vendor() {
    return this.mac_address_vendor.toString()
  }

  get get_network_distance() {
    return this.network_distance.toString()
  }

  get get_trace() {
    return this.trace
  }

  // Setters
  set_fqdn(fqdn) {
    this.hostname = fqdn
  }

  add_fqdn(fqdn) {
    this.hostname.push(fqdn)
  }

  set_rdns_record(rdns_record) {
    this.rdns = rdns_record
  }

  set_os(os) {
    this.os = os
  }

  set_mac(mac_address, mac_address_vendor = undefined) {
    this.mac = mac_address
    this.mac_address_vendor = mac_address_vendor
  }

  set_network_distance(network_distance) {
    this.network_distance = network_distance
  }

  set_trace(trace) {
    this.trace = this.trace.concat(trace)
  }
}

class Port {
  constructor(
    number,
    protocol,
    service = undefined,
    version = undefined,
    script = undefined,
  ) {
    this.number = number
    this.protocol = protocol
    this.service = service
    this.version = version
    this.detail = script
  }

  get get_number() {
    return this.number
  }

  get get_protocol() {
    return this.protocol
  }

  get get_service() {
    return this.service
  }

  get get_version() {
    return this.version
  }

  get get_script() {
    return this.details.trim()
  }

  set_service(service) {
    this.service = service
  }

  set_version(version) {
    this.version = version
  }

  set_script(script) {
    this.detail = script
  }
}

/**
 * Split the raw line to a neat Host object
 * @param raw_string : the whole 'Host' line
 * @rtype : return an Host object
 */
const split_grepable_match = (raw_string) => {
  const splitted_fields = raw_string.split('\t')

  // Patterns
  const p_host = new RegExp(
    `Host:\\s(?<ip>${p_ip_elementary}${+')\\s+\\((?<fqdn>|.*)\\)'}`,
  )
  const p_ports = /Ports:\s+(?<ports>.*)\//
  const p_os = /OS:\s(?<os>.*)/

  // Extracted named-group matches
  const IP_str = extract_matching_pattern(p_host, 'ip', splitted_fields)
  const FQDN_str = extract_matching_pattern(p_host, 'fqdn', splitted_fields)
  const ports_str = extract_matching_pattern(p_ports, 'ports', splitted_fields)
  const OS_str = extract_matching_pattern(p_os, 'os', splitted_fields)

  const current_host = new Host(IP_str, FQDN_str)
  current_host.set_os(OS_str)

  // Let's split the raw port list
  const all_ports = ports_str.split(', ')

  // Keep only open ports
  const open_ports_list = all_ports.filter((p) => {
    return p.includes('/open/')
  })

  for (const idx in open_ports_list) {
    const open_port = open_ports_list[idx]
    // Extract each field from the format [port number / state / protocol / owner / service / rpc info / version info]
    // -- Thanks to http://www.unspecific.com/nmap-oG-output/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [number, _state, protocol, _owner, service, version] = open_port.split(
      '/',
      5,
    )

    // remove potential leading and trailing slashes on version
    const vers = version.strip('/')
    const new_port = new Port(number, protocol, service, vers)
    current_host.add_port(new_port)
  }
  return current_host
}

/**
 * Parse the data according to several regexes
 * @param fd : input file descriptor, could be a true file or stdin
 * @rtype : return a list of <Host> objects indexed from their numerical IP representation
 */
export const parseNmap = (lines) => {
  const IPs = {}
  let last_host
  let p_port = p_port_without_reason
  let in_script_line = false
  let script = ''

  for (const i in lines) {
    const line = lines[i].trim()
    // 1st case:     Nmap Normal Output
    // -- 1st action: Grab the IP
    const IP = line.match(p_ip)?.groups || null
    if (IP) {
      // Check out what patterns matched
      const IP_potential_match = [
        IP.ip_nmap5,
        IP.ip_only_nmap5,
        IP.ip_nmap6,
        IP.ip_only_nmap6,
      ]
      const IP_str = unique_match_from_list(IP_potential_match)
      const FQDN_potential_match = [IP.fqdn_nmap5, IP.fqdn_nmap6]
      const FQDN_str = unique_match_from_list(FQDN_potential_match)
      if (Object.keys(IPs).includes(IP_str)) {
        last_host = IPs[IP_str]
        last_host.add_fqdn(FQDN_str)
      }
      else {
        const new_host = new Host(IP_str, FQDN_str)
        IPs[new_host.get_ip_dotted_format] = new_host
        last_host = new_host
      }
    }
    // 1st case: Nmap Normal Output
    // -- 2nd action: Check if there is a rDNS record
    const rDNS = line.match(p_rdns)?.groups || null
    if (rDNS) {
      if (rDNS.ip && rDNS.rdns) {
        if (Object.keys(IPs).includes(rDNS.ip))
          IPs[rDNS.ip].set_rdns_record(rDNS.rdns)
      }
    }
    // 1st case:     Nmap Normal Output
    // -- 3rd action: Check the port header, to know if there is a reason column
    const port_header = line.match(p_port_header)?.groups || null
    if (port_header) {
      if (port_header.reason)
        p_port = p_port_with_reason
      else p_port = p_port_without_reason
    }
    // 1st case:     Nmap Normal Output
    // -- 4th action: Grab the script output
    const script_line = line.match(p_script)?.groups || null
    if (script_line) {
      in_script_line = true
      script = `${script + script_line.script}\n`
    }
    else {
      // We were in a script output section, now it's finished
      if (in_script_line) {
        const tmp = Object.keys(last_host.get_port_list)
        const last_port = last_host.get_port_list[tmp[tmp.length - 1]]
        if (last_port)
          last_port.set_script(script)

        // reseting trackers
        in_script_line = false
        script = ''
      }
    }

    // 1st case:     Nmap Normal Output
    // -- 5th action: Grab the port
    const port = line.match(p_port)?.groups || null
    if (port && last_host !== undefined) {
      const number = port.number
      const protocol = port.protocol
      const service = port.service
      const version = port.version
      const new_port = new Port(number, protocol, service, version)
      last_host.add_port(new_port)
    }
    // 1st case:     Nmap Normal Output
    // -- 6th action: Grab the MAC address
    const mac = line.match(p_mac)?.groups || null
    if (mac)
      last_host.set_mac(mac.mac_addr.toString(), mac.mac_vendor.toString())
    // 1st case:     Nmap Normal Output
    // -- 7th action: Grab the OS detection
    const os = line.match(p_os)?.groups || null
    if (os)
      last_host.set_os(os.os.toString())

    // 1st case:     Nmap Normal Output
    // -- 8th action: Grab the network distance
    const network_distance = line.match(p_network_dist)?.groups || null
    if (network_distance)
      last_host.set_network_distance(network_distance.hop_number.toString())

    // 1st case: Nmap Normal Output
    // -- 9th action: Grab traceroute
    const trace = line.match(t_reg)?.groups || null
    if (trace) {
      if (trace.ipv4_1 || trace.ipv4_2) {
        last_host.set_trace(trace?.ipv4_1 || trace.ipv4_2)
      }
      else if (trace.start) {
        const orig_trace = IPs[trace.orig].get_trace()
        let subSet
        if (trace.end) {
          subSet = orig_trace.slice(
            parseInt(trace.start) - 1,
            parseInt(trace.end),
          )
        }
        else { subSet = orig_trace[parseInt(trace.start)] }
        last_host.set_trace(subSet)
      }
    }

    // 2nd case:         Nmap Grepable Output
    // -- 1 sole action:  Grab the whole line for further splitting
    const grepable = line.match(p_grepable)?.groups || null
    if (grepable) {
      if (grepable.whole_line) {
        const new_host = split_grepable_match(grepable.whole_line)
        // Update the occurence found with 'Status: Up'
        IPs[new_host.get_ip_dotted_format] = new_host
        last_host = new_host
      }
    }
  }

  return JSON.parse(JSON.stringify(IPs))
}
