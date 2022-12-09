import { prismaMock } from '../mockPrisma'

import { MODEL_ERROR } from '../../src/common/constants'

import { fetchDashboard } from '../../src/models/dashboard'

describe('fetchDashboard', () => {
  const mockFetchedBreakpoints = [
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
    },
  ]
  const mockFetchedDashboardItems = [
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'severitiesSummary',
      dashboard_user: [],
      height: 3,
      id: 19,
      name: 'severity-summary',
      prop: 'severitiesSummary',
      width: 6,
      x: 0,
      y: 0,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'riskPerAsset',
      dashboard_user: [
        {
          dashboard_item_id: 20,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 6,
          y: 3,
        },
      ],
      height: 3,
      id: 20,
      name: 'asset-risk',
      prop: 'riskPerAsset',
      width: 6,
      x: 6,
      y: 0,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'global',
      dashboard_user: [],
      height: 3,
      id: 21,
      name: 'global-rating',
      prop: 'global',
      width: 6,
      x: 0,
      y: 3,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'scanHistory',
      dashboard_user: [
        {
          dashboard_item_id: 22,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 6,
          y: 6,
        },
      ],
      height: 3,
      id: 22,
      name: 'vulnerability-history',
      prop: 'scanHistory',
      width: 6,
      x: 6,
      y: 3,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'likelihoods',
      dashboard_user: [],
      height: 3,
      id: 23,
      name: 'vulnerabilities-heat-map',
      prop: 'likelihoods',
      width: 6,
      x: 0,
      y: 6,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'probe-status',
      dashboard_user: [
        {
          dashboard_item_id: 24,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 6,
          y: 9,
        },
      ],
      height: 3,
      id: 24,
      name: 'probe-status',
      prop: null,
      width: 6,
      x: 6,
      y: 6,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'topVulnerabilities',
      dashboard_user: [],
      height: 3,
      id: 25,
      name: 'top-vulnerabilities',
      prop: 'topVulnerabilities',
      width: 6,
      x: 0,
      y: 9,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'assignement',
      dashboard_user: [
        {
          dashboard_item_id: 26,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 6,
          y: 12,
        },
      ],
      height: 3,
      id: 26,
      name: 'project-assignment',
      prop: 'assignement',
      width: 6,
      x: 6,
      y: 9,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'locationSites',
      dashboard_user: [
        {
          dashboard_item_id: 27,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 15,
        },
      ],
      height: 4,
      id: 27,
      name: 'location-sites',
      prop: 'locationSites',
      width: 12,
      x: 0,
      y: 12,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'severitiesSummary',
      dashboard_user: [],
      height: 8,
      id: 28,
      name: 'severity-summary',
      prop: 'severitiesSummary',
      width: 12,
      x: 0,
      y: 0,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'riskPerAsset',
      dashboard_user: [
        {
          dashboard_item_id: 29,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 16,
        },
      ],
      height: 8,
      id: 29,
      name: 'asset-risk',
      prop: 'riskPerAsset',
      width: 12,
      x: 0,
      y: 8,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'global',
      dashboard_user: [
        {
          dashboard_item_id: 30,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 24,
        },
      ],
      height: 8,
      id: 30,
      name: 'global-rating',
      prop: 'global',
      width: 12,
      x: 0,
      y: 16,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'scanHistory',
      dashboard_user: [
        {
          dashboard_item_id: 31,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 32,
        },
      ],
      height: 8,
      id: 31,
      name: 'vulnerability-history',
      prop: 'scanHistory',
      width: 12,
      x: 0,
      y: 24,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'likelihoods',
      dashboard_user: [
        {
          dashboard_item_id: 32,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 40,
        },
      ],
      height: 8,
      id: 32,
      name: 'vulnerabilities-heat-map',
      prop: 'likelihoods',
      width: 12,
      x: 0,
      y: 32,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'probe-status',
      dashboard_user: [
        {
          dashboard_item_id: 33,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 48,
        },
      ],
      height: 8,
      id: 33,
      name: 'probe-status',
      prop: null,
      width: 12,
      x: 0,
      y: 40,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'topVulnerabilities',
      dashboard_user: [
        {
          dashboard_item_id: 34,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 56,
        },
      ],
      height: 8,
      id: 34,
      name: 'top-vulnerabilities',
      prop: 'topVulnerabilities',
      width: 12,
      x: 0,
      y: 48,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'assignement',
      dashboard_user: [
        {
          dashboard_item_id: 35,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 64,
        },
      ],
      height: 8,
      id: 35,
      name: 'project-assignment',
      prop: 'assignement',
      width: 12,
      x: 0,
      y: 56,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'locationSites',
      dashboard_user: [
        {
          dashboard_item_id: 36,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: false,
          width: null,
          x: null,
          y: null,
        },
      ],
      height: 6,
      id: 36,
      name: 'location-sites',
      prop: 'locationSites',
      width: 12,
      x: 0,
      y: 64,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'severitiesSummary',
      dashboard_user: [],
      height: 3,
      id: 10,
      name: 'severity-summary',
      prop: 'severitiesSummary',
      width: 5,
      x: 0,
      y: 0,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'global',
      dashboard_user: [],
      height: 3,
      id: 11,
      name: 'global-rating',
      prop: 'global',
      width: 2,
      x: 10,
      y: 0,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'riskPerAsset',
      dashboard_user: [],
      height: 3,
      id: 12,
      name: 'asset-risk',
      prop: 'riskPerAsset',
      width: 5,
      x: 5,
      y: 0,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'scanHistory',
      dashboard_user: [
        {
          dashboard_item_id: 13,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 5,
        },
      ],
      height: 3,
      id: 13,
      name: 'vulnerability-history',
      prop: 'scanHistory',
      width: 6,
      x: 0,
      y: 3,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'likelihoods',
      dashboard_user: [],
      height: 2,
      id: 14,
      name: 'vulnerabilities-heat-map',
      prop: 'likelihoods',
      width: 4,
      x: 8,
      y: 3,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'probe-status',
      dashboard_user: [],
      height: 2,
      id: 15,
      name: 'probe-status',
      prop: null,
      width: 6,
      x: 6,
      y: 5,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'topVulnerabilities',
      dashboard_user: [
        {
          dashboard_item_id: 16,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 8,
        },
      ],
      height: 3,
      id: 16,
      name: 'top-vulnerabilities',
      prop: 'topVulnerabilities',
      width: 6,
      x: 0,
      y: 6,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'assignement',
      dashboard_user: [],
      height: 3,
      id: 17,
      name: 'project-assignment',
      prop: 'assignement',
      width: 6,
      x: 6,
      y: 7,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'locationSites',
      dashboard_user: [
        {
          dashboard_item_id: 18,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 11,
        },
      ],
      height: 4,
      id: 18,
      name: 'location-sites',
      prop: 'locationSites',
      width: 12,
      x: 0,
      y: 10,
    },
    {
      breakpoint: 'md',
      breakpointwidth: 996,
      ckey: 'assets-count',
      dashboard_user: [],
      height: 3,
      id: 37,
      name: 'assets-count',
      prop: null,
      width: 6,
      x: 6,
      y: 0,
    },
    {
      breakpoint: 'sm',
      breakpointwidth: 168,
      ckey: 'assets-count',
      dashboard_user: [],
      height: 8,
      id: 38,
      name: 'assets-count',
      prop: null,
      width: 12,
      x: 0,
      y: 8,
    },
    {
      breakpoint: 'lg',
      breakpointwidth: 1200,
      ckey: 'assets-count',
      dashboard_user: [
        {
          dashboard_item_id: 39,
          height: null,
          user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
          visible: true,
          width: null,
          x: 0,
          y: 3,
        },
      ],
      height: 2,
      id: 39,
      name: 'assets-count',
      prop: null,
      width: 2,
      x: 6,
      y: 3,
    },
  ]

  it('should return error if Prisma crash on fetching dashboard items', async () => {
    prismaMock.dashboard_item.groupBy.mockResolvedValue(mockFetchedBreakpoints)

    prismaMock.dashboard_item.findMany.mockRejectedValue(
      new Error('Prisma error'),
    )

    expect((await fetchDashboard('goodUserId'))?.error).toBe(MODEL_ERROR)
  })

  it('should return error if Prisma crash on fetching dashboard breakpoints', async () => {
    prismaMock.dashboard_item.groupBy.mockRejectedValue(
      new Error('Prisma error'),
    )

    expect((await fetchDashboard('goodUserId'))?.error).toBe(MODEL_ERROR)
  })

  it('should return dashboard items by breakpoints if everything is ok', async () => {
    prismaMock.dashboard_item.groupBy.mockResolvedValue(mockFetchedBreakpoints)

    prismaMock.dashboard_item.findMany.mockResolvedValue(
      mockFetchedDashboardItems,
    )

    expect((await fetchDashboard('goodUserId'))?.dashboard).toEqual([
      {
        breakpoint: 'lg',
        breakpointwidth: 1200,
        items: [
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'severitiesSummary',
            defaultHeight: 3,
            defaultWidth: 5,
            defaultX: 0,
            defaultY: 0,
            id: 10,
            name: 'severity-summary',
            prop: 'severitiesSummary',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'global',
            defaultHeight: 3,
            defaultWidth: 2,
            defaultX: 10,
            defaultY: 0,
            id: 11,
            name: 'global-rating',
            prop: 'global',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'riskPerAsset',
            defaultHeight: 3,
            defaultWidth: 5,
            defaultX: 5,
            defaultY: 0,
            id: 12,
            name: 'asset-risk',
            prop: 'riskPerAsset',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'scanHistory',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 0,
            defaultY: 3,
            id: 13,
            name: 'vulnerability-history',
            prop: 'scanHistory',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 5,
            visible: true,
          },
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'likelihoods',
            defaultHeight: 2,
            defaultWidth: 4,
            defaultX: 8,
            defaultY: 3,
            id: 14,
            name: 'vulnerabilities-heat-map',
            prop: 'likelihoods',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'probe-status',
            defaultHeight: 2,
            defaultWidth: 6,
            defaultX: 6,
            defaultY: 5,
            id: 15,
            name: 'probe-status',
            prop: null,
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'topVulnerabilities',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 0,
            defaultY: 6,
            id: 16,
            name: 'top-vulnerabilities',
            prop: 'topVulnerabilities',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 8,
            visible: true,
          },
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'assignement',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 6,
            defaultY: 7,
            id: 17,
            name: 'project-assignment',
            prop: 'assignement',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'locationSites',
            defaultHeight: 4,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 10,
            id: 18,
            name: 'location-sites',
            prop: 'locationSites',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 11,
            visible: true,
          },
          {
            breakpoint: 'lg',
            breakpointWidth: 1200,
            ckey: 'assets-count',
            defaultHeight: 2,
            defaultWidth: 2,
            defaultX: 6,
            defaultY: 3,
            id: 39,
            name: 'assets-count',
            prop: null,
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 3,
            visible: true,
          },
        ],
      },
      {
        breakpoint: 'md',
        breakpointwidth: 996,
        items: [
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'severitiesSummary',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 0,
            defaultY: 0,
            id: 19,
            name: 'severity-summary',
            prop: 'severitiesSummary',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'riskPerAsset',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 6,
            defaultY: 0,
            id: 20,
            name: 'asset-risk',
            prop: 'riskPerAsset',
            userHeight: null,
            userWidth: null,
            userX: 6,
            userY: 3,
            visible: true,
          },
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'global',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 0,
            defaultY: 3,
            id: 21,
            name: 'global-rating',
            prop: 'global',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'scanHistory',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 6,
            defaultY: 3,
            id: 22,
            name: 'vulnerability-history',
            prop: 'scanHistory',
            userHeight: null,
            userWidth: null,
            userX: 6,
            userY: 6,
            visible: true,
          },
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'likelihoods',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 0,
            defaultY: 6,
            id: 23,
            name: 'vulnerabilities-heat-map',
            prop: 'likelihoods',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'probe-status',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 6,
            defaultY: 6,
            id: 24,
            name: 'probe-status',
            prop: null,
            userHeight: null,
            userWidth: null,
            userX: 6,
            userY: 9,
            visible: true,
          },
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'topVulnerabilities',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 0,
            defaultY: 9,
            id: 25,
            name: 'top-vulnerabilities',
            prop: 'topVulnerabilities',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'assignement',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 6,
            defaultY: 9,
            id: 26,
            name: 'project-assignment',
            prop: 'assignement',
            userHeight: null,
            userWidth: null,
            userX: 6,
            userY: 12,
            visible: true,
          },
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'locationSites',
            defaultHeight: 4,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 12,
            id: 27,
            name: 'location-sites',
            prop: 'locationSites',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 15,
            visible: true,
          },
          {
            breakpoint: 'md',
            breakpointWidth: 996,
            ckey: 'assets-count',
            defaultHeight: 3,
            defaultWidth: 6,
            defaultX: 6,
            defaultY: 0,
            id: 37,
            name: 'assets-count',
            prop: null,
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
        ],
      },
      {
        breakpoint: 'sm',
        breakpointwidth: 168,
        items: [
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'severitiesSummary',
            defaultHeight: 8,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 0,
            id: 28,
            name: 'severity-summary',
            prop: 'severitiesSummary',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'riskPerAsset',
            defaultHeight: 8,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 8,
            id: 29,
            name: 'asset-risk',
            prop: 'riskPerAsset',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 16,
            visible: true,
          },
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'global',
            defaultHeight: 8,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 16,
            id: 30,
            name: 'global-rating',
            prop: 'global',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 24,
            visible: true,
          },
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'scanHistory',
            defaultHeight: 8,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 24,
            id: 31,
            name: 'vulnerability-history',
            prop: 'scanHistory',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 32,
            visible: true,
          },
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'likelihoods',
            defaultHeight: 8,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 32,
            id: 32,
            name: 'vulnerabilities-heat-map',
            prop: 'likelihoods',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 40,
            visible: true,
          },
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'probe-status',
            defaultHeight: 8,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 40,
            id: 33,
            name: 'probe-status',
            prop: null,
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 48,
            visible: true,
          },
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'topVulnerabilities',
            defaultHeight: 8,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 48,
            id: 34,
            name: 'top-vulnerabilities',
            prop: 'topVulnerabilities',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 56,
            visible: true,
          },
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'assignement',
            defaultHeight: 8,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 56,
            id: 35,
            name: 'project-assignment',
            prop: 'assignement',
            userHeight: null,
            userWidth: null,
            userX: 0,
            userY: 64,
            visible: true,
          },
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'locationSites',
            defaultHeight: 6,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 64,
            id: 36,
            name: 'location-sites',
            prop: 'locationSites',
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: false,
          },
          {
            breakpoint: 'sm',
            breakpointWidth: 168,
            ckey: 'assets-count',
            defaultHeight: 8,
            defaultWidth: 12,
            defaultX: 0,
            defaultY: 8,
            id: 38,
            name: 'assets-count',
            prop: null,
            userHeight: null,
            userWidth: null,
            userX: null,
            userY: null,
            visible: null,
          },
        ],
      },
    ])
  })
})
