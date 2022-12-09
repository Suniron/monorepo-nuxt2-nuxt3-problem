
import express from 'express'

import assetsRoutes from '../routes/assets'

import usersRoutes from '../routes/users'

import postsRoutes from '../routes/blog'

import scansRoutes from '../routes/scans'

import tagRoutes from '../routes/tags'

import groupsRoutes from '../routes/groups'

import probesRoutes from '../routes/probes'

import relationsRoutes from '../routes/relations'

import reportsRoutes from '../routes/reports'

import vulnerabilitiesRoutes from '../routes/vulnerabilities'

import dashboardRoutes from '../routes/dashboard'

import cartographiesRoutes from '../routes/cartography'

import companiesRoutes from '../routes/companies'

import authRoutes from '../routes/auth'

import filesRoutes from '../routes/file_upload'

import complianceRoutes from '../routes/self-assessment'

import MissionAnalysisRoutes from '../routes/missions_analysis'

import SeveritiesAnalysisRoutes from '../routes/severities'

import FearedEventsRoutes from '../routes/fearedEvents'

import ips from '../routes/ips'

import priorities from '../routes/project-priorities'

import projectStatuses from '../routes/project-statuses'

import remediations from '../routes/remediations'

import remediationProjects from '../routes/remediationProjects'

import phishingScenarioDomains from '../routes/phishing-scenarios-domains'

const router = express.Router()

// Public routes
router.get('/', (_req, res) => {
  res.send('Xrator store is up!')
})

// Routes for authenticating and JWT middleware
router.use(authRoutes)

// Routes behind authentication
router.use(usersRoutes)
router.use(assetsRoutes)
router.use(postsRoutes)
router.use(scansRoutes)
router.use(tagRoutes)
router.use(groupsRoutes)
router.use(probesRoutes)
router.use(relationsRoutes)
router.use(reportsRoutes)
router.use(vulnerabilitiesRoutes)
router.use(dashboardRoutes)
router.use(cartographiesRoutes)
router.use(companiesRoutes)
router.use(filesRoutes)
router.use(complianceRoutes)
router.use(MissionAnalysisRoutes)
router.use(SeveritiesAnalysisRoutes)
router.use(FearedEventsRoutes)
router.use(ips)
router.use(priorities)
router.use(projectStatuses)
router.use(remediations)
router.use(remediationProjects)
router.use(phishingScenarioDomains)

export default router
