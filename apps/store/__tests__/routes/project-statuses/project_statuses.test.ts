// @ts-check
// @ts-expect-error TS(7016): Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest'
import csv from 'csvtojson'
import { mockKnexWithFinalValue, mockVerifyToken } from '../../mocks'
import { generateUser } from '../../utils/index.js'
import app from '../../utils/fakeApp'

/**
 * @type {import('@/types/projectStatus').ProjectStatus[]}
 */
let projectStatuses: any = []
/**
 * @type {import('@/types/projectStatus').ProjectStatusWorkflow[]}
 */
let projectStatusWorkflows: any = []

const customUser = generateUser({
  firstName: 'xrator-test',
  lastName: 'xrator-test',
})

beforeAll(async () => {
  // Get datas:
  projectStatuses = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/init_data/project_status.csv')

  projectStatusWorkflows = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/init_data/project_status_workflow.csv')
})

describe('/projects/available-transitions', () => {
  describe('GET / with the right auth token', () => {
    it('GET / should return 200 with correct data', async () => {
      // @ts-expect-error TS(7006): Parameter 'transition' implicitly has an 'any' typ... Remove this comment to see the full error message
      const availableTransitions = projectStatusWorkflows.map((transition) => {
        return {
          project_status_workflow_id: transition.id,
          transition: transition.transition,
          from_status_id: transition.fk_from_status_id,
          from_status_name: projectStatuses.find(
            // @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
            (status) => status.id === transition.fk_from_status_id
          )?.name,
          to_status_id: transition.fk_to_status_id,
          to_status_name: projectStatuses.find(
            // @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
            (status) => status.id === transition.fk_to_status_id
          )?.name,
        }
      })

      mockKnexWithFinalValue(availableTransitions)
      mockVerifyToken(customUser)

      const response = await request(app)
        .get('/projects/available-transitions')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(availableTransitions)
    })
  })
})

describe('/projects/available-transitions/:statusId', () => {
  describe('GET / with the right auth token', () => {
    it('GET / should return 200 with correct data', async () => {
      const status = 3
      const availableTransitions = projectStatusWorkflows
        .filter(
          // @ts-expect-error TS(7006): Parameter 'transition' implicitly has an 'any' typ... Remove this comment to see the full error message
          (transition) =>
            transition.fk_from_status_id.toString() === status.toString()
        )
        // @ts-expect-error TS(7006): Parameter 'transition' implicitly has an 'any' typ... Remove this comment to see the full error message
        .map((transition) => {
          return {
            project_status_workflow_id: transition.id,
            transition: transition.transition,
            from_status_id: transition.fk_from_status_id,
            from_status_name: projectStatuses.find(
              // @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
              (status) => status.id === transition.fk_from_status_id
            )?.name,
            to_status_id: transition.fk_to_status_id,
            to_status_name: projectStatuses.find(
              // @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
              (status) => status.id === transition.fk_to_status_id
            )?.name,
          }
        })

      mockKnexWithFinalValue(availableTransitions)
      mockVerifyToken(customUser)

      const response = await request(app)
        .get(`/projects/available-transitions/${status}`)
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(availableTransitions)
    })
  })
})
