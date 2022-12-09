/* eslint-disable no-async-promise-executor */
// @ts-nocheck
import Knex from 'knex'
import { UNAUTHORIZED } from '../src/common/constants'
import * as knex from '../src/common/db'
import * as jwt from '../src/common/auth/jwt'
import { getAdminUser, getNonAdminUser } from './utils'

jest.mock('../src/common/auth/jwt')
jest.mock('knex')
jest.mock('../src/common/db')

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

export function mockKnexWithFinalValue(finalValue: any, shouldReject = false) {
  const knexMock = jest.fn(() => {
    return knexMock
  })

  knexFunctions.forEach((fct) => {
    function impl(this: any, param: any) {
      this.then = (resolve: any, reject: any) =>
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
  knex.mockReturnValue(mKnex)
  knex.knex = knexMock

  return knexMock
}

/**
 * Mock the knex query builder with the given final values.
 * The last value of the list will be repeated as the return value of all subsequent calls
 * @param {any[]} finalValues The final values to return for each call in order
 * @param {boolean} shouldReject If the query should be rejected
 */
export function mockKnexWithFinalValues(finalValues: any, shouldReject = false) {
  let returnCount = 0

  const knexMock = jest.fn(() => {
    return knexMock
  })

  knexFunctions.forEach((fct) => {
    function impl(this: any, param: any) {
      this.then = (resolve: any, reject: any) => {
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

export function mockVerifyToken(user: any) {
  jwt.verifyToken = jest.fn(() => {
    if (user)
      return { user }

    return { error: UNAUTHORIZED }
  })
  return jwt.verifyToken
}

/**
 * Mock admin user token
 *
 * @param {import('../src/types/user').OptionnalUserInfos?} userInfos
 */
export const mockAdminUser = (userInfos: any) => mockVerifyToken(getAdminUser(userInfos))

/**
 * Mock non admin user token
 *
 * @param {import('../src/types/user').OptionnalUserInfos?} userInfos
 */
export const mockNonAdminUser = (userInfos: any) => mockVerifyToken(getNonAdminUser(userInfos))
