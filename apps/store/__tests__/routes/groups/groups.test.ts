/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-check
// @ts-expect-error TS(7016): Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest'
import csv from 'csvtojson'
import { mockAdminUser, mockNonAdminUser } from '../../mocks'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'

/**
 * @type {import('@prisma/client').group[]}
 */
let groups: any = []

beforeAll(async () => {
  // Get datas:
  groups = await csv({
    ignoreEmpty: true,
  }).fromFile('./seeds/csv_seed_files/demo/group.csv')
})

describe('/groups/', () => {
  describe('GET /', () => {
    // TODO: Get only groups where i am member, as non admin
    // TODO: Get all groups in company, as admin
    describe('as admin', () => {
      beforeAll(() => {
        mockAdminUser({ companyId: 1 })
      })

      describe('get all groups of my company', () => {
        it('should be all company groups count', async () => {
          const companyGroups = groups
            // @ts-expect-error TS(7006): Parameter 'g' implicitly has an 'any' type.
            .filter((g) => g.company_id == 1)
            // @ts-expect-error TS(7006): Parameter 'cg' implicitly has an 'any' type.
            .map((cg) => ({ ...cg, user_group: [] }))

          // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
          prismaMock.group.findMany.mockResolvedValue(companyGroups)

          const response = await request(app)
            .get('/groups/')
            .set('Authorization', `Bearer fake@token`)

          expect(response.status).toBe(200)
          expect(response.body.total).toBe(companyGroups.length)
        })
      })

      describe('as non admin', () => {
        beforeAll(() => {
          mockNonAdminUser({ companyId: 1 })
        })

        describe('get all available groups of my company', () => {
          it('should be company groups count', async () => {
            // TODO: need a filter by group member
            const companyGroups = groups
              // @ts-expect-error TS(7006): Parameter 'g' implicitly has an 'any' type.
              .filter((g) => g.company_id == 1)
              // @ts-expect-error TS(7006): Parameter 'cg' implicitly has an 'any' type.
              .map((cg) => ({ ...cg, user_group: [] }))

            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            prismaMock.group.findMany.mockResolvedValue(companyGroups)

            const response = await request(app)
              .get('/groups/')
              .set('Authorization', `Bearer fake@token`)

            expect(response.status).toBe(200)
            expect(response.body.total).toBe(companyGroups.length)
          })
        })
      })
    })
  })
  describe('PATCH /:id', () => {
    describe('as non admin', () => {
      beforeAll(() => {
        mockNonAdminUser({})
      })

      it('should be status 403', async () => {
        const response = await request(app)
          .patch('/groups/' + groups[0].id)
          .set('Authorization', `Bearer fake@token`)

        expect(response.status).toBe(403)
      })
    })

    describe('as admin', () => {
      beforeAll(() => {
        mockAdminUser({ companyId: 1 })
      })

      describe('rename group', () => {
        it('should be status 200', async () => {
          // @ts-expect-error TS(7006): Parameter 'g' implicitly has an 'any' type.
          const companyGroups = groups.filter((g) => g.company_id == 1)
          // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
          prismaMock.group.findMany.mockResolvedValue([
            {
              id: 123,
              name: 'I am a group',
              user_group: [
                {
                  user: {
                    id: 12345,
                    first_name: 'Etienne',
                    last_name: 'BLANC',
                    email: 'etienne@blanc.com',
                  },
                },
              ],
            },
          ])

          const response = await request(app)
            .patch('/groups/' + companyGroups[0].id)
            .set('Authorization', `Bearer fake@token`)

          expect(response.status).toBe(200)
        })
      })

      // TODO: test change users
    })
  })
})
