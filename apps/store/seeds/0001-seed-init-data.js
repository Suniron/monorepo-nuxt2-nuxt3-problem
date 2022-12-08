/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'csv'.
const csv = require('csvtojson')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require('path')

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'directory'... Remove this comment to see the full error message
const directory = './seeds/csv_seed_files/init_data/'

const init_data = [
  'company.csv',
  'user.csv',
  'compliance.csv',
  'dashboard_item.csv',
  'vulnerability.csv',
  'phishing_scenario_domain.csv',
  'phishing_scenario.csv',
  'business_impact.csv',
  'feared_event.csv',
  'severity.csv',
  'project_status.csv',
  'project_priority.csv',
  'project_status_workflow.csv',
]

exports.seed = async function (knex) {
  const files = fs.readdirSync(directory)
  for (const file of init_data) {
    if (files.includes(file)) {
      const jsonArray = await csv({ ignoreEmpty: true }).fromFile(
        path.join(directory, file)
      )
      const db = file.split('.')[0]

      // If the csv file is empty
      if (!jsonArray.length) {
        continue
      }
      const checkDB = await knex.select().from(db)
      if (checkDB.length > 0) {
        console.log(`DB ${db} is already filed, don't need to run seeder`)
      } else {
        // Deletes ALL existing entries
        await knex(db)
          .del()
          .then(() => {
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
      }
    } else {
      console.error(`File ${file} was not found in the directory`)
    }
  }
}
