// @ts-expect-error TS(7016): Could not find a declaration file for module 'supe... Remove this comment to see the full error message
import request from 'supertest'
import scans, {
  generateScans,
  probe,
  createScanContent,
} from '../../example-values/scans.js'
import { prismaMock } from '../../mockPrisma'
import app from '../../utils/fakeApp'

describe('/scans', () => {
  describe('GET /', () => {
    it('GET / should return 401 if we fetch without token', () => {
      return request(app)
        .get('/scans')
        .then((response: any) => {
          expect(response.statusCode).toBe(401)
        });
    })

    it('GET / should return 200 if we fetch with token', () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.scan.findMany.mockResolvedValue(scans)

      return request(app)
        .get('/scans')
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        .expect(200)
        .expect('Content-Type', /json/);
    })

    it('GET / with pagination should return subset of values', async () => {
      const page = 1
      const pageSize = 5
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.scan.count.mockResolvedValue(pageSize)
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.scan.findMany.mockResolvedValue(generateScans(5))
      const result = await request(app)
        .get(`/scans?page=${page}&pageSize=${pageSize}`)
        .set('Authorization', `Bearer zdadzzddzaaaaaaaaaaaaa@dzazadzda`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(result.body.scans.length).toEqual(5)
      expect(result.body.total).toEqual(5)
      expect(result.body.scans[0]).toHaveProperty('assets')
      result.body.scans.forEach((scan: any) => {
        expect(
          isSortedAlphabetically(scan.assets.map((ast: any) => ast.name))
        ).toEqual(true)
      })
    })
  })
  describe('POST /', () => {
    it('should return a 200 with an array of one if we pass only one type', async () => {
      const numberOfScanTypePassed = 1
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.probe.findFirst.mockResolvedValue(probe)
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.scan.create.mockResolvedValue({ id: 66 })
      const response = await request(app)
        .post('/scans')
        .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
        .expect(200)
        .send(createScanContent(numberOfScanTypePassed))
      expect(response.body.id.length).toEqual(numberOfScanTypePassed)
    })
    it('should return an array with length of 2 if we passed two types', async () => {
      const numberOfScanTypePassed = 2
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.probe.findFirst.mockResolvedValue(probe)
      // @ts-expect-error TS(2339): Property 'mockResolvedValueOnce' does not exist on... Remove this comment to see the full error message
      prismaMock.scan.create.mockResolvedValueOnce({ id: 66 })
      // @ts-expect-error TS(2339): Property 'mockResolvedValueOnce' does not exist on... Remove this comment to see the full error message
      prismaMock.scan.create.mockResolvedValueOnce({ id: 67 })
      const response = await request(app)
        .post('/scans')
        .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
        .expect(200)
        .send(createScanContent(numberOfScanTypePassed))
      expect(response.body.id.length).toEqual(numberOfScanTypePassed)
    })
    it('should return a 400 if there is no content sent', async () => {
      await request(app)
        .post('/scans')
        .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
        .expect(400)
        .send()
    })
    it('should return a 400 if there is no content sent', async () => {
      await request(app)
        .post('/scans')
        .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
        .expect(400)
        .send({
          wrongDataSent: 'yesItIs',
        })
    })
  })
})

describe('/scans/assets', () => {
  describe('GET /', () => {
    it('GET / should return 401 if we fetch without token', () => {
      return request(app)
        .get('/scans/assets')
        .then((response: any) => {
          expect(response.statusCode).toBe(401)
        });
    })
    it('GET / should return 200', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.user_group.findMany.mockResolvedValue([4])
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      prismaMock.$transaction.mockResolvedValue([
        [
          {
            ip: [
              {
                asset_server_id: 1,
                address: '10.254.0.2',
              },
            ],
          },
        ],
        [
          {
            id: 2,
            url: 'https://www.x-rator.com',
          },
        ],
        [
          {
            id: 3,
            network: '12700.0.0.01<h1>test',
            netmask: '54564.564<h1>test',
          },
        ],
      ])
      const response = await request(app)
        .get('/scans/assets')
        .set('Authorization', `Bearer zdadzzddzzdazaaaaaaaaaaaaa@dzazadzda`)
        .expect(200)
      expect(response.body).toEqual({
        assets: [
          {
            id: 1,
            address: '10.254.0.2',
          },
          {
            id: 2,
            address: 'https://www.x-rator.com',
          },
          {
            id: 3,
            address: '12700.0.0.01<h1>test/54564.564<h1>test',
          },
        ],
      })
    })
  })
})

describe('test the isSortedAlphabetically function', () => {
  it('should return true', () => {
    let sortedArray: any = []
    expect(isSortedAlphabetically(sortedArray)).toBe(true)

    sortedArray = ['a', 'à', 'A']
    expect(isSortedAlphabetically(sortedArray)).toBe(true)

    sortedArray = ['110', '2', 'bob', 'boB', 'test']
    expect(isSortedAlphabetically(sortedArray)).toBe(true)

    sortedArray = [' ', '110', '2', 'bob', 'test']
    expect(isSortedAlphabetically(sortedArray)).toBe(true)
  })

  it('should return false', () => {
    let unsortedArray = ['Z', 'a']
    expect(isSortedAlphabetically(unsortedArray)).toBe(false)

    unsortedArray = ['a', 'b', 'c', '']
    expect(isSortedAlphabetically(unsortedArray)).toBe(false)

    unsortedArray = ['a', 'boob', 'bob']
    expect(isSortedAlphabetically(unsortedArray)).toBe(false)

    unsortedArray = ['a', 'b', 'c', '2']
    expect(isSortedAlphabetically(unsortedArray)).toBe(false)
  })
})

/**
 * Checks if an array of string is sorted in ascending alphabetical order
 * Considering that an empty array returns true
 *
 * @param {String[]} array
 * @returns True if array is correctly sorted, false if not
 */
function isSortedAlphabetically(array: any) {
  return array.reduce((prv: any, cur: any, idx: any) => {
    if (array.length <= 1) return true
    if (idx >= array.length - 1) {
      return (
        cur.localeCompare(prv, 'en', {
          sensitivity: 'base',
        }) >= 0
      )
    }
    if (
      idx === 0 ||
      cur.localeCompare(prv, 'en', {
        sensitivity: 'base',
      }) >= 0
    )
      return cur
    return false
  }, true);
}
