// @ts-check
// @ts-expect-error TS(7016): Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest'
import csv from 'csvtojson'
import {
  mockKnexWithFinalValue,
  mockKnexWithFinalValues,
  mockVerifyToken,
} from '../../mocks'
import { generateUser } from '../../utils/index.js'
// @ts-expect-error TS(2732): Cannot find module '../../example-values/project-p... Remove this comment to see the full error message
import priorities from '../../example-values/project-priorities.json'
// @ts-expect-error TS(2732): Cannot find module '../../example-values/remediati... Remove this comment to see the full error message
import remediationProjectData from '../../example-values/remediation-projects.json'
// @ts-expect-error TS(2732): Cannot find module '../../example-values/comments-... Remove this comment to see the full error message
import commentsRemediationProjectData from '../../example-values/comments-remediation-projects.json'
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { SUCCESS, UNAUTHORIZED } from '@/common/constants'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'

/**
 * @typedef {{
 *   id: number,
 *   fk_company_id: number,
 *   name: string,
 *   description: string,
 *   fk_owner: string,
 *   fk_priority_id: number,
 *   start_date: string,
 *   creation_date: string,
 *   due_date: number,
 * }} RemediationProjectItem
 */

/**
 * @type {RemediationProjectItem[]}
 */
let remediationProjects: any = []

/**
 * @type {import('@/types/remediationProject').RemediationProjectScope[]}
 */
let remediationProjectScopeTable: any = []

/**
 * @type {import('@/types/projectStatus').ProjectStatus[]}
 */
let projectStatus: any = []

/**
 * @type {import('@/types/projectStatusHistory').ProjectStatusHistory[]}
 */
let projectStatusHistory: any = []

/**
 * @type {import('@/types/projectPriority').ProjectPriority[]}
 */
let projectPriorities: any = []

/**
 * @type {import('@/types/remediationProject').RemediationProjectAssignee[]}
 */
let remediationProjectAssignees: any = []
/**
 * @type {import('@/types/user').User[]}
 */
let users: any = []
/**
 * @type {import('@/types/vulnerability').VulnerabilityAssets[]}
 */
let vulnerabilityAssets: any = []
/**
 * @type {import('@/types/vulnerability').Vulnerability[]}
 */
let vulnerabilities: any = []
/**
 * @type {import('@/types/asset').Asset[]}
 */
let assets: any = []

const newProjectData = {
  name: 'New Project',
  description: 'New project description',
  owner: '',
  priority: 1,
  due_date: new Date().toISOString(),
  assignees: [''],
  project_scope: [1],
}

const customUser = generateUser({
  firstName: 'xrator-test',
  lastName: 'xrator-test',
  id: 'xrator_test_id',
})

beforeAll(async () => {
  // Get datas:
  remediationProjects = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/remediation_project.csv')

  remediationProjectScopeTable = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/remediation_project_scope.csv')

  projectStatus = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/init_data/project_status.csv')

  projectStatusHistory = await csv({
    ignoreEmpty: true,
  }).fromFile(
    './seeds/csv_seed_files/demo/remediation_project_status_history.csv'
  )

  projectPriorities = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/init_data/project_priority.csv')

  remediationProjectAssignees = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/remediation_project_assignee.csv')

  users = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/user.csv')

  vulnerabilityAssets = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/vulnerability_asset.csv')

  vulnerabilities = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/init_data/vulnerability.csv')

  assets = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/asset.csv')

  newProjectData.owner = users[0].id
  newProjectData.assignees = [users[0].id]
})

describe('/remediation-projects/summary', () => {
  describe('GET /', () => {
    describe('with the right auth token and same company id', () => {
      it('should return 200 with correct data', async () => {
        // @ts-expect-error TS(7006): Parameter 'project' implicitly has an 'any' type.
        const remediationProjectList = remediationProjects.map((project) => {
          return {
            project_id: project.id,
            project_name: project.name,
            owner_id: project.fk_owner,
            // @ts-expect-error TS(7006): Parameter 'user' implicitly has an 'any' type.
            owner_name: users.find((user) => user.id === project.fk_owner)
              ?.username,
            priority: projectPriorities.find(
              // @ts-expect-error TS(7006): Parameter 'priority' implicitly has an 'any' type.
              (priority) => priority.id === project.fk_priority_id
            )?.name,
            priority_weight: projectPriorities.find(
              // @ts-expect-error TS(7006): Parameter 'priority' implicitly has an 'any' type.
              (priority) => priority.id === project.fk_priority_id
            )?.weight,
            status: projectStatus.find(
              // @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
              (status) =>
                status.id ===
                projectStatusHistory.find(
                  // @ts-expect-error TS(7006): Parameter 'statusHistory' implicitly has an 'any' ... Remove this comment to see the full error message
                  (statusHistory) =>
                    statusHistory.fk_project_id === project.id &&
                    statusHistory.end_date === null
                )?.fk_status_id
            )?.name,
            status_weight: projectStatus.find(
              // @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
              (status) =>
                status.id ===
                projectStatusHistory.find(
                  // @ts-expect-error TS(7006): Parameter 'statusHistory' implicitly has an 'any' ... Remove this comment to see the full error message
                  (statusHistory) =>
                    statusHistory.fk_project_id === project.id &&
                    statusHistory.end_date === null
                )?.fk_status_id
            )?.weight,
            due_date: project.due_date,
            is_overdue: Date.now() > Number(new Date(project.due_date)),
          }
        })

        mockKnexWithFinalValue(remediationProjectList)
        mockVerifyToken(customUser)

        const response = await request(app)
          .get('/remediation-projects/summary')
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(200)
        expect(response.body?.remediationProjects).toEqual(
          remediationProjectList
        )
        expect(response.body?.total).toEqual(remediationProjectList.length)
      })
    })
  })
})

describe('/remediation-projects', () => {
  describe('POST /', () => {
    it('when creating a project', async () => {
      const PROJECT_ID = 1
      const Knex = mockKnexWithFinalValue([{ id: PROJECT_ID }])

      const response = await request(app)
        .post('/remediation-projects')
        .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
        .expect(200)
        .send(newProjectData)

      expect(Knex.into).toHaveBeenNthCalledWith(1, 'remediation_project')

      expect(Knex.into).toHaveBeenCalledWith('remediation_project_assignee')

      expect(Knex.into).toHaveBeenCalledWith('remediation_project_scope')

      expect(Knex.into).toHaveBeenCalledWith(
        'remediation_project_status_history'
      )

      expect(response.body).toEqual({ id: PROJECT_ID })
    })
  })
})

describe('/remediation-projects/:id', () => {
  describe('GET /', () => {
    describe('with the right auth token but bad company id', () => {
      it('should return 404', async () => {
        mockKnexWithFinalValues([
          // Mock bad company_id
          [],
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .get('/remediation-projects/1')
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(404)
      })
    })
    describe('with the right auth token', () => {
      it('should return 200 with correct data', async () => {
        let projectId = 2
        const [remediationProjectDetails] = remediationProjects
          // @ts-expect-error TS(7006): Parameter 'project' implicitly has an 'any' type.
          .filter((project) => project.id.toString() === projectId.toString())
          // @ts-expect-error TS(7006): Parameter 'project' implicitly has an 'any' type.
          .map((project) => {
            return {
              project_id: project.id,
              project_name: project.name,
              project_description: project.description,
              owner_id: project.fk_owner,
              // @ts-expect-error TS(7006): Parameter 'user' implicitly has an 'any' type.
              owner_name: users.find((user) => user.id === project.fk_owner)
                ?.username,
              assignees: remediationProjectAssignees
                // @ts-expect-error TS(7006): Parameter 'assignee' implicitly has an 'any' type.
                .filter((assignee) => assignee.fk_project_id === project.id)
                // @ts-expect-error TS(7006): Parameter 'assignee' implicitly has an 'any' type.
                .map((assignee) => {
                  return {
                    user_id: assignee.fk_user_id,
                    username: users.find(
                      // @ts-expect-error TS(7006): Parameter 'user' implicitly has an 'any' type.
                      (user) => user.id === assignee.fk_user_id
                    )?.username,
                  }
                }),
              priority: projectPriorities.find(
                // @ts-expect-error TS(7006): Parameter 'priority' implicitly has an 'any' type.
                (priority) => priority.id === project.fk_priority_id
              )?.name,
              status: projectStatus.find(
                // @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
                (status) =>
                  status.id ===
                  projectStatusHistory.find(
                    // @ts-expect-error TS(7006): Parameter 'statusHistory' implicitly has an 'any' ... Remove this comment to see the full error message
                    (statusHistory) =>
                      statusHistory.fk_project_id === project.id &&
                      statusHistory.end_date === undefined
                  )?.fk_status_id
              )?.name,
              status_id: projectStatus.find(
                // @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
                (status) =>
                  status.id ===
                  projectStatusHistory.find(
                    // @ts-expect-error TS(7006): Parameter 'statusHistory' implicitly has an 'any' ... Remove this comment to see the full error message
                    (statusHistory) =>
                      statusHistory.fk_project_id === project.id &&
                      statusHistory.end_date === undefined
                  )?.fk_status_id
              )?.id,
              status_weight: projectStatus.find(
                // @ts-expect-error TS(7006): Parameter 'status' implicitly has an 'any' type.
                (status) =>
                  status.id ===
                  projectStatusHistory.find(
                    // @ts-expect-error TS(7006): Parameter 'statusHistory' implicitly has an 'any' ... Remove this comment to see the full error message
                    (statusHistory) =>
                      statusHistory.fk_project_id === project.id &&
                      statusHistory.end_date === undefined
                  )?.fk_status_id
              )?.weight,
              creation_date: project.creation_date,
              due_date: project.due_date,
              is_overdue: Date.now() > Number(new Date(project.due_date)),
            }
          })

        mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [
            Number(
              remediationProjects.find(
                // @ts-expect-error TS(7006): Parameter 'project' implicitly has an 'any' type.
                (project) => project.id.toString() === projectId.toString()
              )?.fk_company_id
            ),
          ],
          // Mock return remediation project details
          remediationProjectDetails,
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .get(`/remediation-projects/${projectId}`)
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(200)
        expect(response.body).toEqual(remediationProjectDetails)
      })
    })
  })

  describe('PATCH /', () => {
    describe('with the right auth token but bad company id', () => {
      it('should return 404', async () => {
        mockKnexWithFinalValues([
          // Mock bad company_id
          [],
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .patch('/remediation-projects/1')
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(404)
      })
    })
    describe('as the owner of a project', () => {
      beforeAll(() => {
        const projectOwner = generateUser({
          username: 'owner',
          id: '3107ad82-cc71-4a7e-9f4c-1585716c0191',
        })
        mockVerifyToken(projectOwner)
      })
      it('when updating 4 properties of a remediation project', async () => {
        const Knex = mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          // Mock right owner and assignee
          ['3107ad82-cc71-4a7e-9f4c-1585716c0191'],
          ['3107ad82-cc71-4a7e-9f4c-1585716c0191'],
        ])

        const patchData = {
          project_name: 'New Project Name',
          project_description: 'New Project Description',
          due_date: '2020-01-01',
          priority_id: 2,
        }

        let response = await request(app)
          .patch('/remediation-projects/1')
          .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
          .expect(200)
          .send(patchData)

        expect(response.body).toEqual({
          status: SUCCESS,
          data: {
            status_history_id: null,
          },
        })

        expect(Knex.update).toHaveBeenCalledTimes(4)
        expect(Knex.update).toHaveBeenCalledWith('name', patchData.project_name)
        expect(Knex.update).toHaveBeenCalledWith(
          'description',
          patchData.project_description
        )
        expect(Knex.update).toHaveBeenCalledWith('due_date', patchData.due_date)
        expect(Knex.update).toHaveBeenCalledWith(
          'fk_priority_id',
          patchData.priority_id
        )
      })

      it('when updating the status of a remediation project', async () => {
        const Knex = mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          ['3107ad82-cc71-4a7e-9f4c-1585716c0191'],
          ['3107ad82-cc71-4a7e-9f4c-1585716c0191'],
          { transitionName: 'accept' },
          [{ id: 26 }],
        ])

        const statusId = 4

        let response = await request(app)
          .patch('/remediation-projects/1')
          .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
          .expect(200)
          .send({
            status_id: statusId,
          })

        expect(response.body).toEqual({
          status: SUCCESS,
          data: {
            status_history_id: 26,
          },
        })

        expect(Knex.update).toHaveBeenCalledTimes(1)
        expect(Knex.insert).toHaveBeenCalledTimes(1)
      })
    })

    describe('As an assignee of a project', () => {
      beforeAll(() => {
        const projectAssignee = generateUser({
          username: 'assignee',
          id: '3107ad82-cc71-4a7e-9f4c-1585716c0191',
        })
        mockVerifyToken(projectAssignee)
      })
      it('when updating 4 properties of a remediation project', async () => {
        const Knex = mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          ['randomId'],
          ['randomId', '3107ad82-cc71-4a7e-9f4c-1585716c0191'],
        ])

        const patchData = {
          project_name: 'New Project Name',
          project_description: 'New Project Description',
          due_date: '2020-01-01',
          priority: 2,
        }

        let response = await request(app)
          .patch('/remediation-projects/1')
          .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
          .expect(200)
          .send(patchData)

        expect(response.body).toEqual({ status: UNAUTHORIZED })

        expect(Knex.update).toHaveBeenCalledTimes(0)
      })

      it('when updating the status of a remediation project from open to in_progress', async () => {
        const Knex = mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          ['randomId'],
          ['randomId', '3107ad82-cc71-4a7e-9f4c-1585716c0191'],
          { transitionName: 'start' },
          [{ id: 26 }],
        ])

        const statusId = 2

        let response = await request(app)
          .patch('/remediation-projects/1')
          .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
          .expect(200)
          .send({
            status_id: statusId,
          })

        expect(response.body).toEqual({
          status: SUCCESS,
          data: {
            status_history_id: 26,
          },
        })

        expect(Knex.update).toHaveBeenCalledTimes(1)
        expect(Knex.insert).toHaveBeenCalledTimes(1)
      })

      it('when updating the status of a remediation project from in_progress to canceled', async () => {
        const Knex = mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          ['randomId'],
          ['randomId', '3107ad82-cc71-4a7e-9f4c-1585716c0191'],
          { transitionName: 'cancel' },
        ])

        const statusId = 5

        let response = await request(app)
          .patch('/remediation-projects/1')
          .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
          .expect(200)
          .send({
            status_id: statusId,
          })

        expect(response.body).toEqual({ status: UNAUTHORIZED })

        expect(Knex.update).toHaveBeenCalledTimes(0)
      })
    })

    describe('As a viewer of a project', () => {
      beforeAll(() => {
        const projectViewer = generateUser({
          username: 'viewer',
          id: '3107ad82-cc71-4a7e-9f4c-1585716c0191',
        })
        mockVerifyToken(projectViewer)
      })
      it('when updating 4 properties of a remediation project', async () => {
        const Knex = mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          ['randomId'],
          ['randomId'],
        ])

        const patchData = {
          project_name: 'New Project Name',
          project_description: 'New Project Description',
          due_date: '2020-01-01',
          priority: 2,
        }

        let response = await request(app)
          .patch('/remediation-projects/1')
          .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
          .expect(200)
          .send(patchData)

        expect(response.body).toEqual({ status: UNAUTHORIZED })

        expect(Knex.update).toHaveBeenCalledTimes(0)
      })

      it('when updating the status of a remediation project from open to in_progress', async () => {
        const Knex = mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          ['randomId'],
          ['randomId'],
        ])

        const statusId = 2

        let response = await request(app)
          .patch('/remediation-projects/1')
          .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
          .expect(200)
          .send({
            status_id: statusId,
          })

        expect(response.body).toEqual({ status: UNAUTHORIZED })

        expect(Knex.update).toHaveBeenCalledTimes(0)
      })
    })
  })
})

describe('/remediation-projects/:id/scope', () => {
  describe('GET /', () => {
    describe('with the right auth token but bad company id', () => {
      it('should return 404', async () => {
        mockKnexWithFinalValues([
          // Mock bad company_id
          [],
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .get('/remediation-projects/1/scope')
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(404)
      })
    })
    describe('with the right auth token', () => {
      it('should return 200 with correct data', async () => {
        let projectId = 4

        const remediationProjectScope = remediationProjectScopeTable
          .filter(
            // @ts-expect-error TS(7006): Parameter 'scope' implicitly has an 'any' type.
            (scope) => scope.fk_project_id.toString() === projectId.toString()
          )
          // @ts-expect-error TS(7006): Parameter 'scope' implicitly has an 'any' type.
          .map((scope) => {
            return {
              project_id: scope.fk_project_id,
              project_scope_id: scope.id,
              vulnerability_asset_id: scope.fk_vulnerability_asset_id,
              asset_id: vulnerabilityAssets.find(
                // @ts-expect-error TS(7006): Parameter 'vast' implicitly has an 'any' type.
                (vast) => vast.id === scope.fk_vulnerability_asset_id
              )?.asset_id,
              asset_type: assets.find(
                // @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
                (asset) =>
                  asset.id ===
                  vulnerabilityAssets.find(
                    // @ts-expect-error TS(7006): Parameter 'vast' implicitly has an 'any' type.
                    (vast) => vast.id === scope.fk_vulnerability_asset_id
                  )?.asset_id
              )?.type,
              asset_name: assets.find(
                // @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
                (asset) =>
                  asset.id ===
                  vulnerabilityAssets.find(
                    // @ts-expect-error TS(7006): Parameter 'vast' implicitly has an 'any' type.
                    (vast) => vast.id === scope.fk_vulnerability_asset_id
                  )?.asset_id
              )?.name,
              vulnerability_id: vulnerabilityAssets.find(
                // @ts-expect-error TS(7006): Parameter 'vast' implicitly has an 'any' type.
                (vast) => vast.id === scope.fk_vulnerability_asset_id
              )?.vulnerability_id,
              vulnerability_name: vulnerabilities.find(
                // @ts-expect-error TS(7006): Parameter 'vulnerability' implicitly has an 'any' ... Remove this comment to see the full error message
                (vulnerability) =>
                  vulnerability.id ===
                  vulnerabilityAssets.find(
                    // @ts-expect-error TS(7006): Parameter 'vast' implicitly has an 'any' type.
                    (vast) => vast.id === scope.fk_vulnerability_asset_id
                  )?.vulnerability_id
              )?.name,
              severity: vulnerabilityAssets.find(
                // @ts-expect-error TS(7006): Parameter 'vast' implicitly has an 'any' type.
                (vast) => vast.id === scope.fk_vulnerability_asset_id
              )?.severity,
              remediation: vulnerabilities.find(
                // @ts-expect-error TS(7006): Parameter 'vulnerability' implicitly has an 'any' ... Remove this comment to see the full error message
                (vulnerability) =>
                  vulnerability.id ===
                  vulnerabilityAssets.find(
                    // @ts-expect-error TS(7006): Parameter 'vast' implicitly has an 'any' type.
                    (vast) => vast.id === scope.fk_vulnerability_asset_id
                  )?.vulnerability_id
              )?.remediation,
              is_done: scope.is_done,
            }
          })

        mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          remediationProjectScope,
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .get(`/remediation-projects/${projectId}/scope`)
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(remediationProjectScope)
      })
    })
  })

  describe('PATCH /', () => {
    describe('without request body', () => {
      it('should return 400', async () => {
        const response = await request(app)
          .patch(
            '/remediation-projects/' + remediationProjects[0].id + '/scope'
          )
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(400)
      })
    })

    describe('with bad remediation project id format (string instead of number)', () => {
      it('should return 400', async () => {
        const response = await request(app)
          .patch(
            '/remediation-projects/' + 'bad_remediation_project_id' + '/scope'
          )
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(400)
      })
    })

    describe('with bad company id', () => {
      it('should return 404', async () => {
        mockKnexWithFinalValues([
          // Mock bad company_id
          [],
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .patch(
            '/remediation-projects/' + remediationProjects[0].id + '/scope'
          )
          .send({
            project_scope: [],
          })
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(404)
      })
    })

    describe('as non-owner', () => {
      it('should return 401', async () => {
        mockVerifyToken(customUser)

        mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          // Mock no project owner match:
          [],
        ])

        const response = await request(app)
          .patch(`/remediation-projects/${remediationProjects[0].id}/scope`)
          .send({
            project_scope: [],
          })
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(401)
      })
    })

    describe('as owner', () => {
      describe('Update scope with 4 deleted rows and no new rows', () => {
        it('should return 201', async () => {
          mockVerifyToken(customUser)
          mockKnexWithFinalValues([
            // Mock the same company_id as the user
            [1],
            // Mock same project owner id:
            [{ ...remediationProjects[0], fk_owner: 'i_am_owner_id' }],
            // Simulate returning deleted rows of project scope:
            [{ id: 100 }, { id: 101 }, { id: 102 }, { id: 103 }],
            // Simulate existing rows of project scope:
            [104, 105, 106, 107],
          ])

          const response = await request(app)
            .patch(`/remediation-projects/${remediationProjects[0].id}/scope`)
            .send({
              project_scope: [104, 105, 106, 107],
            })
            .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

          expect(response.status).toBe(201)
          expect(response.body).toHaveProperty('data')
          expect(response.body.data).toHaveProperty('deleted')
          expect(response.body.data).toHaveProperty('inserted')
          expect(response.body.data.deleted).toEqual(4)
          expect(response.body.data.inserted).toEqual(0)
        })
      })

      describe('Update scope with 6 new rows and no deleted', () => {
        it('should return 201', async () => {
          mockVerifyToken(customUser)
          mockKnexWithFinalValues([
            // Mock the same company_id as the user
            [1],
            // Mock same project owner id:
            [{ ...remediationProjects[0], fk_owner: 'i_am_owner_id' }],
            // Simulate returning deleted rows of project scope:
            [],
            // Simulate existing rows of project scope:
            [104, 105, 106, 107],
            // Simulate returning inserted rows of project scope :
            [
              { id: 108 },
              { id: 109 },
              { id: 110 },
              { id: 111 },
              { id: 112 },
              { id: 113 },
            ],
          ])

          const response = await request(app)
            .patch(`/remediation-projects/${1}/scope`)
            .send({
              project_scope: [104, 105, 106, 107, 108, 109, 110, 111, 112, 113],
            })
            .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

          expect(response.status).toBe(201)
          expect(response.body).toHaveProperty('data')
          expect(response.body.data).toHaveProperty('deleted')
          expect(response.body.data).toHaveProperty('inserted')
          expect(response.body.data.deleted).toEqual(0)
          expect(response.body.data.inserted).toEqual(6)
        })
      })
    })
  })
})

describe('/remediation-projects/:id/scope/:scope_id', () => {
  describe('PATCH /', () => {
    describe('without auth token', () => {
      it('should return 401', async () => {
        const response = await request(app).patch(
          '/remediation-projects/' + remediationProjects[0].id + '/scope/1'
        )

        expect(response.status).toBe(401)
      })
    })

    describe('without request body', () => {
      it('should return 400', async () => {
        const response = await request(app)
          .patch(`/remediation-projects/${remediationProjects[0].id}/scope/1`)
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(400)
      })
    })

    describe('with bad remediation project id format (string instead of number)', () => {
      it('should return 400', async () => {
        const response = await request(app)
          .patch('/remediation-projects/bad_remediation_project_id/scope/1')
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(400)
      })
    })

    describe('with bad scope id format (string instead of number)', () => {
      it('should return 400', async () => {
        const response = await request(app)
          .patch(
            `/remediation-projects/${remediationProjects[0].id}/scope/bad_scope_id`
          )
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(400)
      })
    })

    describe('with bad company id', () => {
      it('should return 404', async () => {
        mockKnexWithFinalValues([
          // Mock bad company_id
          [],
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .patch(`/remediation-projects/${remediationProjects[0].id}/scope/1`)
          .send({ is_done: true })
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(404)
      })
    })

    describe('as non-owner AND non-assignee', () => {
      it('should return 401', async () => {
        // Generate and mock connected user id
        const notOwnerOrAsigneeUser = generateUser({
          firstName: 'xrator-test',
          lastName: 'xrator-test',
          id: 'i_am_not_owner_or_assignee_id',
        })
        mockVerifyToken(notOwnerOrAsigneeUser)

        mockKnexWithFinalValues([
          // Mock the same company_id as the user
          [1],
          // Mock no project owner match:
          [],
          // Mock bad assignees ids:
          [
            { fk_user_id: 'i_am_a_different_user_id_1' },
            { fk_user_id: 'i_am_a_different_user_id_2' },
            { fk_user_id: 'i_am_a_different_user_id_3' },
            { fk_user_id: 'i_am_a_different_user_id_4' },
            { fk_user_id: 'i_am_a_different_user_id_5' },
          ],
        ])

        const response = await request(app)
          .patch(`/remediation-projects/${remediationProjects[0].id}/scope/1`)
          .send({ is_done: true })
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(401)
      })
    })

    describe('as owner', () => {
      beforeAll(() => {
        // Generate and mock connected user id
        const ownerUser = generateUser({
          firstName: 'xrator-test',
          lastName: 'xrator-test',
          id: 'i_am_owner_id',
        })

        mockVerifyToken(ownerUser)
      })

      describe('Change is_done of scope of a bad project (not a part of it)', () => {
        it('should return 400', async () => {
          mockKnexWithFinalValues([
            // Mock the same company_id as the user
            [1],
            // Mock same project owner id:
            [{ ...remediationProjects[0], fk_owner: 'i_am_owner_id' }],
            // Simulate scope is not in remediation project:
            [],
          ])

          const response = await request(app)
            .patch(
              `/remediation-projects/${1}/scope/${
                remediationProjectScopeTable[0].id
              }`
            )
            .send({
              is_done: true,
            })
            .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

          expect(response.status).toBe(400)
        })
      })

      describe('Change is_done of scope of a good project', () => {
        it('should return 204', async () => {
          mockKnexWithFinalValues([
            // Mock the same company_id as the user
            [1],
            // Mock project owner match:
            [{ ...remediationProjects[0], fk_owner: 'i_am_owner_id' }],
            // Simulate an object for this scope in this remediation project:
            [{}],
            // Simulate updated row:
            1,
          ])
          // Find the first scope which corresponds to the first remediation project:
          const goodScope = remediationProjectScopeTable.find(
            // @ts-expect-error TS(7006): Parameter 'rps' implicitly has an 'any' type.
            (rps) => rps.fk_project_id === remediationProjects[0].id
          )

          const response = await request(app)
            .patch(
              `/remediation-projects/${remediationProjects[0].id}/scope/${goodScope?.id}`
            )
            .send({
              is_done: !goodScope?.is_done,
            })
            .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

          expect(response.status).toBe(204)
        })
      })
    })

    describe('as non-owner but assignee', () => {
      beforeAll(() => {
        // Generate and mock connected user id
        const ownerUser = generateUser({
          firstName: 'xrator-test',
          lastName: 'xrator-test',
          id: 'i_am_assignee_id',
        })

        mockVerifyToken(ownerUser)
      })

      describe('Change is_done of scope of a good project', () => {
        it('should return 204', async () => {
          mockKnexWithFinalValues([
            // Mock the same company_id as the user
            [1],
            // Mock no owner found:
            [],
            // Mock list of assignees witch includes the tested assignee:
            [
              // @ts-expect-error TS(7006): Parameter 'rpa' implicitly has an 'any' type.
              ...remediationProjectAssignees.map((rpa) => ({
                fk_user_id: rpa.fk_user_id,
              })),
              { fk_user_id: 'i_am_assignee_id' },
            ],
            // Mock existing scope in this remediation project:
            [remediationProjectScopeTable[0]],
            // Simulate updated row:
            1,
          ])
          // Find the first scope which corresponds to the first remediation project:
          const goodScope = remediationProjectScopeTable.find(
            // @ts-expect-error TS(7006): Parameter 'rps' implicitly has an 'any' type.
            (rps) => rps.fk_project_id === remediationProjects[0].id
          )

          const response = await request(app)
            .patch(
              `/remediation-projects/${remediationProjects[0].id}/scope/${goodScope?.id}`
            )
            .send({
              is_done: !goodScope?.is_done,
            })
            .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

          expect(response.status).toBe(204)
        })
      })
    })
  })
})

describe('/remediation-projects/:id/status-history', () => {
  describe('GET /', () => {
    const data = remediationProjectData.remediationProjectStatusChanges
    describe('without auth token', () => {
      it('should return 401', async () => {
        await request(app)
          .get(`/remediation-projects/${data[0].project_id}/status-history`)
          .expect(401)
      })
    })

    describe('with bad company id', () => {
      it('should return 404', async () => {
        mockKnexWithFinalValues([
          // Mock bad company_id
          [],
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .get(`/remediation-projects/${data[0].project_id}/status-history`)
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(404)
      })
    })

    describe("getting a project's status history", () => {
      beforeAll(() => {
        mockVerifyToken(generateUser())
      })

      it("should return the project's history", async () => {
        mockKnexWithFinalValues([
          // Mock same company_id as the user
          [1],
          data,
        ])

        const response = await request(app)
          .get(`/remediation-projects/${data[0].project_id}/status-history`)
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
          .expect(200)

        expect(response.body).toEqual(data)
      })
    })
  })
})

describe('/projects/priorities', () => {
  describe('GET /', () => {
    it('should return status 200 and list of priorities', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.project_priority.findMany.mockResolvedValue(priorities)

      const result = await request(app)
        .get('/projects/priorities')
        .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(result.body).toEqual({ data: priorities })
    })
  })

  describe('GET /:id', () => {
    it('should return status 200 and list of priorities', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.project_priority.findUnique.mockResolvedValue(priorities[0])

      const result = await request(app)
        .get('/projects/priorities/' + priorities[0].id)
        .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(result.body).toEqual({ data: priorities[0] })
    })
  })
})

describe('/posts/remediation-project/:id', () => {
  describe('GET /', () => {
    const commentsData =
      commentsRemediationProjectData.remediationProjectComments
    describe('without auth token', () => {
      it('should return 401 ', async () => {
        const response = await request(app).get(
          `/posts/remediation-project/${commentsData[0].project_id}`
        )

        expect(response.status).toBe(401)
      })
    })

    describe('with bad company id', () => {
      it('should return 404', async () => {
        mockKnexWithFinalValues([
          // Mock bad company_id
          [],
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .get(`/posts/remediation-project/${commentsData[0].project_id}`)
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(404)
      })
    })

    describe('with the right auth token', () => {
      it('should return 200', async () => {
        mockKnexWithFinalValues([
          // Mock same company_id as the user
          [1],
          commentsData,
        ])
        const response = await request(app)
          .get(`/posts/remediation-project/${commentsData[0].project_id}`)
          .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
          .expect(200)
          .expect('Content-Type', /json/)
        expect(response.body).toEqual(commentsData)
      })
    })
  })

  describe('POST /', () => {
    describe('with bad company id', () => {
      it('should return 404', async () => {
        mockKnexWithFinalValues([
          // Mock bad company_id
          [],
        ])
        mockVerifyToken(customUser)

        const response = await request(app)
          .post('/posts/remediation-project/1')
          .send({
            comment: 'A comment that will not be saved',
          })
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        expect(response.status).toBe(404)
      })
    })

    describe('as non project owner or assignee of the project on which to post the comment', () => {
      it('should return 400', async () => {
        mockKnexWithFinalValues([
          // Mock same company_id as the user
          [1],
          // Mock no owner found:
          [],
          // Mock no assignees found:
          [],
        ])
        await request(app)
          .post('/posts/remediation-project/1')
          .send({
            comment: 'A comment that will not be saved',
          })
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
          .expect(401)
      })
    })
    describe('as project owner of the project on which to post the comment', () => {
      it('comment without status_history_id should return 200', async () => {
        const returningId = [{ id: 1 }]
        mockVerifyToken(customUser)
        mockKnexWithFinalValues([
          // Mock same company_id as the user
          [1],
          // Mock project owner is the test user:
          [{ fk_user_id: 'xrator_test_id' }],
          // Mock returning insert row id
          returningId,
        ])
        const response = await request(app)
          .post('/posts/remediation-project/1')
          .send({
            comment: 'A comment that will be saved',
          })
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(201)
        expect(response.body.id).toEqual(1)
      })

      it('comment with bad status_history_id should return 400', async () => {
        mockVerifyToken(customUser)
        mockKnexWithFinalValues([
          // Mock same company_id as the user
          [1],
          // Mock project owner is the test user:
          [{ fk_user_id: 'xrator_test_id' }],
          // Mock no assignee found:
          [],
          // Mock status_history_id doesn't match the right remediation project
          [],
        ])
        const response = await request(app)
          .post('/posts/remediation-project/1')
          .send({
            comment: 'A comment that will not be saved',
            remediation_project_status_history_id: 1,
          })
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(400)
      })

      it('comment with right status_history_id should return 201', async () => {
        const returningId = [{ id: 1 }]
        const projectId = 3
        const projectStatusHistoryId = 3
        mockVerifyToken(customUser)
        mockKnexWithFinalValues([
          // Mock same company_id as the user
          [1],
          // Mock project owner is the test user:
          [{ fk_user_id: 'xrator_test_id' }],
          // Mock status_history_id doesn't match the right remediation project
          projectStatusHistory.filter(
            // @ts-expect-error TS(7006): Parameter 'psh' implicitly has an 'any' type.
            (psh) =>
              psh.fk_project_id.toString() === projectId.toString() &&
              psh.id.toString() === projectStatusHistoryId.toString()
          ),
          // Mock returning insert row id
          returningId,
        ])
        const response = await request(app)
          .post(`/posts/remediation-project/${projectId}`)
          .send({
            comment: 'A comment that will be saved',
            remediation_project_status_history_id: projectStatusHistoryId,
          })
          .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)

        expect(response.status).toBe(201)
        expect(response.body.id).toEqual(1)
      })
    })
  })
})
