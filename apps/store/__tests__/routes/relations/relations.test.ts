import request from 'supertest'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'

eslint - disable - next - line

describe('/relations/bulk', () => {
  describe('POST /', () => {
    it('with bad asset id format that is not a number should return an error 400', async () => {
      const response = await request(app)
        .post('/relations/bulk')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send([
          {
            fromAssetId: 'bad_id_format',
            relationType: 'BELONGS_TO',
            toAssetId: 'bad_id_format',
          },
        ])
      expect(response.status).toBe(400)
    })

    it('with a not existing relation type should return 404', async () => {
      prismaMock.relation.findMany.mockResolvedValue([])
      const response = await request(app)
        .post('/relations/bulk')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send([
          {
            fromAssetId: 100,
            relationType: 'BAD_TYPE',
            toAssetId: 101,
          },
        ])
      expect(response.status).toBe(400)
    })

    it('with a relationship of an asset couple that is not valid should not return a new relation', async () => {
      prismaMock.asset.findMany.mockResolvedValue([{ id: 100 }])
      const response = await request(app)
        .post('/relations/bulk')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send([
          {
            fromAssetId: 100,
            relationType: 'BELONGS_TO',
            toAssetId: 100,
          },
        ])
      expect(response.body).toEqual([])
    })

    it('with a relationship of at least an asset not in the company not return a new relation', async () => {
      prismaMock.asset.findMany.mockResolvedValue([{ id: 10 }])
      const response = await request(app)
        .post('/relations/bulk')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send([
          {
            fromAssetId: 10,
            relationType: 'BELONGS_TO',
            toAssetId: 11,
          },
        ])
      expect(response.body).toEqual([])
    })

    it('with valid relationship data should return the created or existing ID', async () => {
      prismaMock.asset.findMany.mockResolvedValue([{ id: 10 }, { id: 11 }])

      prismaMock.$transaction.mockResolvedValue([
        {
          id: 3,
        },
      ])
      const response = await request(app)
        .post('/relations/bulk')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send([
          {
            fromAssetId: 10,
            relationType: 'BELONGS_TO',
            toAssetId: 11,
          },
        ])
      expect(response.status).toBe(201)
      expect(response.body).toEqual([{ id: 3 }])
    })

    it('with multiple valid relationship data should return the created or existing IDs', async () => {
      prismaMock.asset.findMany.mockResolvedValue([
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
      ])

      prismaMock.$transaction.mockResolvedValue([
        {
          id: 3,
        },
        {
          id: 4,
        },
      ])
      const response = await request(app)
        .post('/relations/bulk')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send([
          {
            fromAssetId: 10,
            relationType: 'BELONGS_TO',
            toAssetId: 11,
          },
          {
            fromAssetId: 12,
            relationType: null,
            toAssetId: 13,
          },
        ])
      expect(response.status).toBe(201)
      expect(response.body).toEqual([{ id: 3 }, { id: 4 }])
    })

    it('with a single valid relationship data should return only the created or existing ID', async () => {
      prismaMock.asset.findMany.mockResolvedValue([{ id: 10 }, { id: 11 }])

      prismaMock.$transaction.mockResolvedValue([
        {
          id: 3,
        },
      ])
      const response = await request(app)
        .post('/relations/bulk')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
        .send([
          {
            fromAssetId: 10,
            relationType: 'BELONGS_TO',
            toAssetId: 11,
          },
          {
            fromAssetId: 12,
            relationType: null,
            toAssetId: 13,
          },
        ])
      expect(response.status).toBe(201)
      expect(response.body).toEqual([{ id: 3 }])
    })
  })
})

describe('/relations/:fromAssetId/:relationType/:toAssetId', () => {
  describe('DELETE /', () => {
    it('with bad asset id format that is not a number should return an error 400', async () => {
      const response = await request(app)
        .delete('/relations/bad_id_format/BELONGS_TO/bad_id_format')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      expect(response.status).toBe(400)
    })
    it('with a not existing relation type should return 404', async () => {
      prismaMock.relation.deleteMany.mockResolvedValue({
        count: 0,
      })
      const response = await request(app)
        .delete('/relations/100/BAD_TYPE/101')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      expect(response.status).toBe(404)
    })
    it('with a relationship of an asset couple that does not exist should return 404', async () => {
      prismaMock.relation.deleteMany.mockResolvedValue({
        count: 0,
      })
      const response = await request(app)
        .delete('/relations/100/BELONGS_TO/100')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      expect(response.status).toBe(404)
    })
    it('with existing assets relation should return status 200 with count 1', async () => {
      prismaMock.relation.deleteMany.mockResolvedValue({
        count: 1,
      })
      const response = await request(app)
        .delete('/relations/100/BELONGS_TO/101')
        .set('Authorization', 'Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('count')
      expect(response.body.count).toEqual(1)
    })
  })
})
