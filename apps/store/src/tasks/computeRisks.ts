import type { company } from '@prisma/client'
import { riskScoreComputing } from '../utils/RiskScoreComputing'
import prismaClient from '../prismaClient'
import { log } from '../lib/logger'
import type { LightAsset, LightRelation } from '../../types/asset'

async function calculateCompanyRisk(companyId: company['id']) {
  const startDate = new Date()
  const today = new Date()

  // 1) Create a list with all unvisited asset, named listUnvisited
  const listAssetsQuery = prismaClient.asset.findMany({
    where: {
      company_id: companyId,
    },
  })

  const relationsQuery = prismaClient.relation.findMany()

  const inherentScoresQuery = prismaClient.v_asset_risk_scores.findMany({
    select: {
      asset_id: true,
      inherent_score: true,
    },
  })

  const [listUnvisited, relations, inherentScores] = await Promise.all([
    listAssetsQuery,
    relationsQuery,
    inherentScoresQuery,
  ])

  const queryTime = new Date().getTime() - startDate.getTime()

  // Ignoring TS error because there is not enum for the asset type and the string cannot match the values specified in the function's definition
  const inheritedRisks = riskScoreComputing(
    listUnvisited as LightAsset[],
    relations as LightRelation[],
    inherentScores.map(inherentScore => ({
      asset_id: inherentScore.asset_id,
      inherentRisk: inherentScore.inherent_score,
    })),
  )

  const computeTime = new Date().getTime() - startDate.getTime() - queryTime

  // 7) Update the inherited risk with the max(inheritedRisk) of all assets

  // It is possible to use prismaClient.$transaction() to do this in a single query, however it seem to degrade the performance by 20% of the overall script execution time
  // And since those are just upsert queries, it is not an issue if an error happens and the scores are only partially updated.
  await prismaClient.$transaction(
    Object.keys(inheritedRisks).flatMap((assetId: number) => {
      return [
        prismaClient.score_asset_history.upsert({
          create: {
            fk_asset_id: Number(assetId),
            log_date: today,
            score: inheritedRisks[assetId],
            type: 'RISK',
          },
          update: {
            score: inheritedRisks[assetId],
          },
          where: {
            fk_asset_id_type_log_date: {
              fk_asset_id: Number(assetId),
              log_date: today,
              type: 'RISK',
            },
          },
        }),
        prismaClient.score_asset.upsert({
          create: {
            fk_asset_id: Number(assetId),
            score: inheritedRisks[assetId],
            type: 'RISK',
          },
          update: {
            score: inheritedRisks[assetId],
          },
          where: {
            fk_asset_id_type: {
              fk_asset_id: Number(assetId),
              type: 'RISK',
            },
          },
        }),
      ]
    }),
  )

  const upsertTime
    = new Date().getTime() - startDate.getTime() - queryTime - computeTime

  return {
    computeTime,
    queryTime,
    upsertTime,
  }
}

export async function computeRiskForAllCompanies() {
  const date = new Date()
  const companies = await prismaClient.company.findMany()
  const results = await Promise.all(
    companies.map((company: any) => calculateCompanyRisk(company.id)),
  )
  log.info(`Fetched companies in ${new Date().getTime() - date.getTime()}ms`)
  results.forEach((timings, index) => {
    log.info(
      `Risk computed for company ${index + 1} in ${
        timings.queryTime + timings.computeTime + timings.upsertTime
      }ms, query: ${timings.queryTime}ms, compute: ${
        timings.computeTime
      }ms, upsert: ${timings.upsertTime}ms`,
    )
  })
}
