import { knex } from '../../../src/common/db'

import { MODEL_ERROR } from '../../../src/common/constants'

/**
 *
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns
 */
export const generateModel = async () => {
  try {
    const query = knex
      .select({
        affected: knex.raw('coalesce(vast_agg.details, \'{}\')'),
        description: 'vuln.description',
        name: 'vuln.name',
        remediation: 'vuln.remediation',
      })
      .from({ vuln: 'vulnerability' })

    const vastSubquery = knex
      .select(
        'vulnerability_id',
        knex.raw(
          'array_agg(jsonb_build_object(\'status\', vast.status, \'details\', vast.details, \'astId\', ast.id, \'astName\', ast.name, \'ipId\', ip.id ,\'ip\', ip.address, \'portId\', port.id, \'port\', port.number, \'uriId\', uri.id, \'uri\', uri.uri, \'code\', cvss.code, \'score\', cvss.score)) as details',
        ),
      )
      .from({ vast: 'vulnerability_asset' })
      .innerJoin({ vuln: 'vulnerability' }, 'vuln.id', 'vast.vulnerability_id')
      .innerJoin({ ast: 'asset' }, 'ast.id', 'vast.asset_id')
      .leftJoin({ cvss: 'cvss' }, 'cvss.id', 'vast.cvss_id')
      .leftJoin({ ip: 'ip' }, 'ip.id', 'vast.ip_id')
      .leftJoin({ port: 'port' }, 'port.id', 'vast.port_id')
      .leftJoin({ uri: 'uri' }, 'uri.id', 'vast.uri_id')
      .orderBy('vulnerability_id')
      .groupBy('vulnerability_id')
      .as('vast_agg')
    query.innerJoin(vastSubquery, 'vast_agg.vulnerability_id', 'vuln.id')

    const vast = await query
    return { vast }
  }
  catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}