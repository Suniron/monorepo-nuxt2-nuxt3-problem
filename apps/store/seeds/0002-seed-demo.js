/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const csv = require('csvtojson')
const path = require('path')

const demo = [
  'alembic_version.csv',
  'company.csv',
  'user.csv',
  'group.csv',
  'asset.csv',
  'asset_building.csv',
  'asset_compliance.csv',
  'asset_document.csv',
  'asset_mission.csv',
  'asset_network.csv',
  'asset_server.csv',
  'asset_user.csv',
  'asset_web.csv',
  'relation.csv',
  'business_mission_unit_has_feared_event.csv',
  'business_mission_unit_feared_event_has_business_impact.csv',
  'cartography.csv',
  'cartography_element.csv',
  'ip.csv',
  'port.csv',
  'cipher_suite.csv',
  'cpe.csv',
  'cvss.csv',
  'store.csv',
  'revision.csv',
  'uri.csv',
  'vulnerability_asset.csv',
  'comment.csv',
  'comment_watch.csv',
  'cpe_asset.csv',
  'probe.csv',
  'scan.csv',
  'dashboard_user.csv',
  'group_asset.csv',
  'request.csv',
  //'response.csv',
  //'header.csv',
  'latest_scan_summary.csv',
  'mitre.csv',
  'reference.csv',
  'result.csv',
  'scan_asset.csv',
  'status_update.csv',
  'tag.csv',
  'tag_asset.csv',
  'user_group.csv',
  'remediation_project.csv',
  'remediation_project_assignee.csv',
  'remediation_project_status_history.csv',
  'comment_remediation_project.csv',
  'remediation_project_scope.csv',
]

const directory = './seeds/csv_seed_files/demo/'

exports.seed = async function (knex) {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  const files = fs.readdirSync(directory)

  for (const file of demo) {
    if (files.includes(file)) {
      // Convert CSV to Json
      const jsonArray = await csv({
        ignoreEmpty: true,
      }).fromFile(path.join(directory, file))
      const db = file.split('.')[0]

      // If the csv file is empty
      if (!jsonArray.length) {
        continue
      }
      // Insert data in the table
      await knex(db).then(() => {
        return knex(db).insert(jsonArray)
      })
      // Checks if there is a sequence on the id of the table
      const sequenceId = await knex
        .select('sequence_name')
        .from('information_schema.sequences')
        .where({ sequence_name: db + '_id_seq' })
      // If true : increments the sequence by the number of rows inserted
      if (sequenceId.length) {
        await knex.raw(
          `SELECT setval('${db}_id_seq', (SELECT Max(id) FROM "${db}"));`
        )
      }
    } else {
      console.error(`File ${file} was not found in the directory`)
    }
  }
}
