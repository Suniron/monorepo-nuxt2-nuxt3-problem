// @ts-check
import { prismaMock } from '../mockPrisma'
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { MODEL_ERROR, NOT_FOUND } from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/models/file' or its correspo... Remove this comment to see the full error message
import { downloadFile } from '@/models/file'

describe('downloadFile', () => {
  it('should return a model error if Prisma crash', async () => {
    // @ts-expect-error TS(2339): Property 'mockRejectedValue' does not exist on typ... Remove this comment to see the full error message
    prismaMock.store.findFirst.mockRejectedValue(new Error('Prisma error'))

    expect((await downloadFile(123, 'goodStoreId'))?.error).toBe(MODEL_ERROR)
  })

  it('should return not found error if file not exist for this file id + company id', async () => {
    // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
    prismaMock.store.findFirst.mockResolvedValue(fileInfo)

    expect((await downloadFile(123, 'goodStoreId'))?.data).toStrictEqual(
      fileInfo
    )
  })
})
