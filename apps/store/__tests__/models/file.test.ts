// @ts-check
import { prismaMock } from '../mockPrisma'
import { MODEL_ERROR, NOT_FOUND } from '@/common/constants'
import { downloadFile } from '@/models/file'

describe('downloadFile', () => {
  it('should return a model error if Prisma crash', async () => {
    prismaMock.store.findFirst.mockRejectedValue(new Error('Prisma error'))

    expect((await downloadFile(123, 'goodStoreId'))?.error).toBe(MODEL_ERROR)
  })

  it('should return not found error if file not exist for this file id + company id', async () => {
    prismaMock.store.findFirst.mockResolvedValue(null)

    expect((await downloadFile(123, 'goodStoreId'))?.error).toBe(NOT_FOUND)
  })

  it('should return file info if file is found', async () => {
    const fileInfo = {
      id: 'c2ce9464-f545-4b8e-9077-114a90111c2e',
      name: 'Vendor Information Security_V.3.1.pdf',
      md5: '408e90d2769430817895d024f3418c8c',
      size: 244839,
      type: 'application/pdf',
    }

    // @ts-expect-error: not a real prisma object
    prismaMock.store.findFirst.mockResolvedValue(fileInfo)

    expect((await downloadFile(123, 'goodStoreId'))?.data).toStrictEqual(
      fileInfo
    )
  })
})
