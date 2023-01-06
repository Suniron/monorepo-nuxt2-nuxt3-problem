import request from 'supertest'
import csv from 'csvtojson'
import { mockKnexWithFinalValue, mockVerifyToken } from '../../mocks'
import { generateUser } from '../../utils'
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
      const availableTransitions = projectStatusWorkflows.map((transition) => {
        return {
          from_status_id: transition.fk_from_status_id,
          from_status_name: projectStatuses.find(
            status => status.id === transition.fk_from_status_id,
          )?.name,
          project_status_workflow_id: transition.id,
          to_status_id: transition.fk_to_status_id,
          to_status_name: projectStatuses.find(
            status => status.id === transition.fk_to_status_id,
          )?.name,
          transition: transition.transition,
        }
      })

      mockKnexWithFinalValue(availableTransitions)
      mockVerifyToken(customUser)

      const response = await request(app)
        .get('/projects/available-transitions')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
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
          transition =>
            transition.fk_from_status_id.toString() === status.toString(),
        )

        .map((transition) => {
          return {
            from_status_id: transition.fk_from_status_id,
            from_status_name: projectStatuses.find(
              status => status.id === transition.fk_from_status_id,
            )?.name,
            project_status_workflow_id: transition.id,
            to_status_id: transition.fk_to_status_id,
            to_status_name: projectStatuses.find(
              status => status.id === transition.fk_to_status_id,
            )?.name,
            transition: transition.transition,
          }
        })

      mockKnexWithFinalValue(availableTransitions)
      mockVerifyToken(customUser)

      const response = await request(app)
        .get(`/projects/available-transitions/${status}`)
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      expect(response.status).toBe(200)
      expect(response.body).toEqual(availableTransitions)
    })
  })
})
