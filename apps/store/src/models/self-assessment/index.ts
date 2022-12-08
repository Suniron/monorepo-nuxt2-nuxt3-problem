// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/utils/compliance.utils' or i... Remove this comment to see the full error message
import { computeComplianceStatistics } from '@/utils/compliance.utils'
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { NOT_FOUND } from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/lib/logger' or its correspon... Remove this comment to see the full error message
import { log } from '@/lib/logger'

export const fetchCompliance = async (params: any, loggedUserInfo = {}) => {
  try {
    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId } = loggedUserInfo
    const { compliance = null } = params
    let compliances = []
    let statistics = []
    if (compliance === null)
      compliances = await knex
        .distinct('compliance')
        .select('compliance')
        .from('compliance')
        .orderBy('compliance')
    else {
      const query = knex
        .select(
          knex.raw(
            "cle.*, agg_docs.docs as docs, acle.asset_id, acle.name, acle.compliance_id, acle.status, acle.mitigation, acle.residual_risk, ARRAY[jsonb_build_object('text', 'Non Existant', 'value', non_existant_risk),jsonb_build_object('text', 'Inneffective', 'value', inneffective_risk),jsonb_build_object('text', 'Partially Effective', 'value', partially_effective_risk), jsonb_build_object('text', 'Effective', 'value', effective_risk)] as response"
          )
        )
        .from('compliance as cle')
        .leftJoin(
          knex('asset_compliance as ac')
            .select(
              'ac.compliance_id',
              'ast.id as asset_id',
              'ast.name',
              'ac.status',
              'ac.mitigation',
              'ac.residual_risk'
            )
            .join('asset as ast', 'ast.id', 'ac.id')
            .where('ast.company_id', companyId)
            .as('acle'),
          'cle.id',
          'acle.compliance_id'
        )
        .where({ 'cle.compliance': compliance })

      const relationSubquery = knex
        .select('to_asset_id', knex.raw('array_agg(from_asset_id) as docs'))
        .from('relation')
        .where('type', 'COMPLY_TO')
        .groupBy('to_asset_id')
        .as('agg_docs')
      query.leftJoin(relationSubquery, 'agg_docs.to_asset_id', 'acle.asset_id')
      compliances = await query

      if (!compliances.length) {
        return {
          error: NOT_FOUND,
        }
      }
      statistics = computeComplianceStatistics(compliances)
    }
    return {
      compliances: compliances,
      statistics: statistics.length ? statistics : undefined,
    }
  } catch (error) {
    log.withError(error).error('fetchCompliance')
  }
}

/*
const { q } = params
    await knex.transaction(async (tx) => {
        const toInsert = []
        for (let idx in q) {
            const compliance = "ISO 27001"
            const chapter = q[idx].header
            const chapter_small = q[idx].headerSmall
            for(let sidx in q[idx].contents) {
                const title = q[idx].contents[sidx].title
                const section = q[idx].contents[sidx].iso
                const description = q[idx].contents[sidx].desc
                let non_existant_risk = ''
                let inneffective_risk = ''
                let partially_effective_risk = ''
                let effective_risk = ''
                for (let ridx in q[idx].contents[sidx].response) {
                    if(q[idx].contents[sidx].response[ridx].text === 'Non existant')
                        non_existant_risk = q[idx].contents[sidx].response[ridx].value.risk
                    else if(q[idx].contents[sidx].response[ridx].text === 'Ineffective')
                        inneffective_risk = q[idx].contents[sidx].response[ridx].value.risk
                    else if(q[idx].contents[sidx].response[ridx].text === 'Partially Effective')
                        partially_effective_risk = q[idx].contents[sidx].response[ridx].value.risk
                    else
                        effective_risk = 'Ok'
                }
                await tx('compliance').insert({compliance, chapter, chapter_small, title, section, description, non_existant_risk, inneffective_risk, partially_effective_risk, effective_risk})
            }
        }
    })
*/
