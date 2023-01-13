import request from 'supertest'
import csv from 'csvtojson'
import type { group } from '@prisma/client'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'
import { mockLoggedAsFullyConnectedAdmin, mockLoggedAsFullyConnectedUser } from '../../utils/mockAuth'

let groups: group[] = []

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
      let token = ''
      beforeAll(() => {
        token = mockLoggedAsFullyConnectedAdmin().token
      })

      describe('get all groups of my company', () => {
        it('should be all company groups count', async () => {
          const companyGroups = groups
            .filter(g => g.company_id === 1)
            .map(cg => ({ ...cg, user_group: [] }))

          prismaMock.group.findMany.mockResolvedValue(companyGroups)

          const response = await request(app)
            .get('/groups/')
            .set('Authorization', `Bearer ${token}`)

          expect(response.status).toBe(200)
          expect(response.body.total).toBe(companyGroups.length)
        })
      })
    })

    describe('as non admin', () => {
      let token = ''
      beforeAll(() => {
        token = mockLoggedAsFullyConnectedUser().token
      })

      describe('get all available groups of my company', () => {
        it('should be company groups count', async () => {
          // TODO: need a filter by group member
          const companyGroups = groups

            .filter(g => g.company_id === 1)

            .map(cg => ({ ...cg, user_group: [] }))

          prismaMock.group.findMany.mockResolvedValue(companyGroups)

          const response = await request(app)
            .get('/groups/')
            .set('Authorization', `Bearer ${token}`)

          expect(response.status).toBe(200)
          expect(response.body.total).toBe(companyGroups.length)
        })
      })
    })
  })

  describe('PATCH /:id', () => {
    describe('as non admin', () => {
      let token = ''
      beforeAll(() => {
        token = mockLoggedAsFullyConnectedUser().token
      })

      it('should be status 403', async () => {
        const response = await request(app)
          .patch(`/groups/${groups[0].id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(403)
      })
    })

    describe('as admin', () => {
      let token = ''
      beforeAll(() => {
        token = mockLoggedAsFullyConnectedAdmin().token
      })

      describe('rename group', () => {
        it('should be status 200', async () => {
          const companyGroups = groups.filter(g => g.company_id === 1)

          prismaMock.group.findMany.mockResolvedValue([
            {
              id: 123,
              name: 'I am a group',
              user_group: [
                {
                  user: {
                    email: 'etienne@blanc.com',
                    first_name: 'Etienne',
                    id: 12345,
                    last_name: 'BLANC',
                  },
                },
              ],
            },
          ])

          const response = await request(app)
            .patch(`/groups/${companyGroups[0]?.id}`)
            .set('Authorization', `Bearer ${token}`)

          expect(response.status).toBe(200)
        })
      })

      // TODO: test change users
    })
  })
})
