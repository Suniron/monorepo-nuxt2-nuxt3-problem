// @ts-check
/* eslint-disable no-import-assign */
/* eslint-disable no-async-promise-executor */
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { UNAUTHORIZED } from '@/common/constants'
import Knex from 'knex'
// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import * as knex from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/common/auth/jwt' or its corr... Remove this comment to see the full error message
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

export function mockKnexWithFinalValue(finalValue: any, shouldReject = false) {
  // @ts-expect-error TS(7022): 'knexMock' implicitly has type 'any' because it do... Remove this comment to see the full error message
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
  // @ts-expect-error TS(2339): Property 'mockReturnValue' does not exist on type ... Remove this comment to see the full error message
  Knex.mockReturnValue(mKnex)
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
  // @ts-expect-error TS(7022): 'knexMock' implicitly has type 'any' because it do... Remove this comment to see the full error message
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
  // @ts-expect-error TS(2339): Property 'mockReturnValue' does not exist on type ... Remove this comment to see the full error message
  Knex.mockReturnValue(mKnex)
  knex.knex = knexMock

  return knexMock
}

export function mockVerifyToken(user: any) {
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
export const mockAdminUser = (userInfos: any) => mockVerifyToken(getAdminUser(userInfos))

/**
 * Mock non admin user token
 *
 * @param {import('@/types/user').OptionnalUserInfos?} userInfos
 */
export const mockNonAdminUser = (userInfos: any) => mockVerifyToken(getNonAdminUser(userInfos))
