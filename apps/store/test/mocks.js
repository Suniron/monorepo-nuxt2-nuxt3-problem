/* eslint-disable no-import-assign */
/* eslint-disable no-async-promise-executor */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { UNAUTHORIZED } from '@/common/constants'
import Knex from 'knex'
import * as knex from '@/common/db'
import * as jwt from '@/common/auth/jwt'
import { getAdminUser, getNonAdminUser } from './utils'

jest.mock('@/common/auth/jwt')
jest.mock('knex')
jest.mock('@/common/db')

const knexFunctions = [
  'with',
  'withRecursive',
  'select',
  'as',
  'columns',
  'column',
  'from',
  'fromJS',
  'into',
  'withSchema',
  'table',
  'distinct',
  'join',
  'joinRaw',
  'innerJoin',
  'leftJoin',
  'leftOuterJoin',
  'rightJoin',
  'rightOuterJoin',
  'outerJoin',
  'fullOuterJoin',
  'crossJoin',
  'where',
  'andWhere',
  'orWhere',
  'whereNot',
  'orWhereNot',
  'whereRaw',
  'whereWrapped',
  'havingWrapped',
  'orWhereRaw',
  'whereExists',
  'orWhereExists',
  'whereNotExists',
  'orWhereNotExists',
  'whereIn',
  'orWhereIn',
  'whereNotIn',
  'orWhereNotIn',
  'whereNull',
  'orWhereNull',
  'whereNotNull',
  'orWhereNotNull',
  'whereBetween',
  'whereNotBetween',
  'andWhereBetween',
  'andWhereNotBetween',
  'orWhereBetween',
  'orWhereNotBetween',
  'groupBy',
  'groupByRaw',
  'orderBy',
  'orderByRaw',
  'union',
  'unionAll',
  'intersect',
  'having',
  'havingRaw',
  'orHaving',
  'orHavingRaw',
  'offset',
  'limit',
  'count',
  'countDistinct',
  'min',
  'max',
  'sum',
  'sumDistinct',
  'avg',
  'avgDistinct',
  'increment',
  'decrement',
  'first',
  'debug',
  'pluck',
  'clearSelect',
  'clearWhere',
  'clearGroup',
  'clearOrder',
  'clearHaving',
  'insert',
  'update',
  'returning',
  'toNative',
  'del',
  'raw',
  'transaction',
  'delete',
  'truncate',
  'transacting',
  'connection',
  'toSQL',
]

export function mockKnexWithFinalValue(finalValue, shouldReject = false) {
  const knexMock = jest.fn(() => {
    return knexMock
  })

  knexFunctions.forEach((fct) => {
    function impl(param) {
      this.then = (resolve, reject) =>
        shouldReject ? reject(finalValue) : resolve(finalValue)

      if (typeof param === 'function') {
        if (param.toString().trim().startsWith('async')) {
          return new Promise(async (resolve) => {
            await param.call(knexMock, knexMock)
            resolve(knexMock)
          })
        }
        param.call(knexMock, knexMock)
      }

      return knexMock
    }

    knexMock[fct] = jest.fn().mockImplementation(impl)
  })

  const mKnex = jest.fn().mockReturnValue(knexMock)
  Knex.mockReturnValue(mKnex)
  // eslint-disable-next-line no-import-assign
  knex.knex = knexMock

  return knexMock
}

/**
 * Mock the knex query builder with the given final values.
 * The last value of the list will be repeated as the return value of all subsequent calls
 * @param {any[]} finalValue The final values to return for each call in order
 * @param {boolean} shouldReject If the query should be rejected
 */
export function mockKnexWithFinalValues(finalValues, shouldReject = false) {
  let returnCount = 0
  const knexMock = jest.fn(() => {
    return knexMock
  })

  knexFunctions.forEach((fct) => {
    function impl(param) {
      this.then = (resolve, reject) => {
        const returnValue = shouldReject
          ? reject(finalValues[returnCount])
          : resolve(finalValues[returnCount])

        returnCount = Math.min(returnCount + 1, finalValues.length - 1)
        return returnValue
      }

      if (typeof param === 'function') {
        if (param.toString().trim().startsWith('async')) {
          return new Promise(async (resolve) => {
            await param.call(knexMock, knexMock)
            resolve(knexMock)
          })
        }
        param.call(knexMock, knexMock)
      }

      return knexMock
    }

    knexMock[fct] = jest.fn().mockImplementation(impl)
  })

  const mKnex = jest.fn().mockReturnValue(knexMock)
  Knex.mockReturnValue(mKnex)
  knex.knex = knexMock

  return knexMock
}

export function mockVerifyToken(user) {
  jwt.verifyToken = jest.fn(() => {
    if (user) {
      return { user }
    }
    return { error: UNAUTHORIZED }
  })
  return jwt.verifyToken
}

/**
 * Mock admin user token
 *
 * @param {import('@/types/user').OptionnalUserInfos?} userInfos
 */
export const mockAdminUser = (userInfos) =>
  mockVerifyToken(getAdminUser(userInfos))

/**
 * Mock non admin user token
 *
 * @param {import('@/types/user').OptionnalUserInfos?} userInfos
 */
export const mockNonAdminUser = (userInfos) =>
  mockVerifyToken(getNonAdminUser(userInfos))
