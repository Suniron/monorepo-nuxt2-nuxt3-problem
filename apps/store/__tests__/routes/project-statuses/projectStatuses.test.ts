import request from 'supertest'
import csv from 'csvtojson'
import { mockKnexWithFinalValue } from '../../mocks'
import app from '../../utils/fakeApp'
import { mockLoggedAsFullyConnectedUser } from '../../utils/mockAuth'
import type { ProjectStatus, ProjectStatusWorkflow } from '../../../types/projectStatus'

let projectStatuses: ProjectStatus[] = []
let projectStatusWorkflows: ProjectStatusWorkflow[] = []

let token = ''

beforeAll(async () => {
  token = mockLoggedAsFullyConnectedUser().accessToken

  // Get data:
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

      const response = await request(app)
        .get('/projects/available-transitions')
        .set('Authorization', `Bearer ${token}`)
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

      const response = await request(app)
        .get(`/projects/available-transitions/${status}`)
        .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(availableTransitions)
    })
  })
})
