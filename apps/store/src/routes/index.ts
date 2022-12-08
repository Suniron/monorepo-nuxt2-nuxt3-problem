// @ts-check
import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/routes/assets' or its corres... Remove this comment to see the full error message
import assetsRoutes from '@/routes/assets'
// @ts-expect-error TS(2307): Cannot find module '@/routes/users' or its corresp... Remove this comment to see the full error message
import usersRoutes from '@/routes/users'
// @ts-expect-error TS(2307): Cannot find module '@/routes/blog' or its correspo... Remove this comment to see the full error message
import postsRoutes from '@/routes/blog'
// @ts-expect-error TS(2307): Cannot find module '@/routes/scans' or its corresp... Remove this comment to see the full error message
import scansRoutes from '@/routes/scans'
// @ts-expect-error TS(2307): Cannot find module '@/routes/tags' or its correspo... Remove this comment to see the full error message
import tagRoutes from '@/routes/tags'
// @ts-expect-error TS(2307): Cannot find module '@/routes/groups' or its corres... Remove this comment to see the full error message
import groupsRoutes from '@/routes/groups'
// @ts-expect-error TS(2307): Cannot find module '@/routes/probes' or its corres... Remove this comment to see the full error message
import probesRoutes from '@/routes/probes'
// @ts-expect-error TS(2307): Cannot find module '@/routes/relations' or its cor... Remove this comment to see the full error message
import relationsRoutes from '@/routes/relations'
// @ts-expect-error TS(2307): Cannot find module '@/routes/reports' or its corre... Remove this comment to see the full error message
import reportsRoutes from '@/routes/reports'
// @ts-expect-error TS(2307): Cannot find module '@/routes/vulnerabilities' or i... Remove this comment to see the full error message
import vulnerabilitiesRoutes from '@/routes/vulnerabilities'
// @ts-expect-error TS(2307): Cannot find module '@/routes/dashboard' or its cor... Remove this comment to see the full error message
import dashboardRoutes from '@/routes/dashboard'
// @ts-expect-error TS(2307): Cannot find module '@/routes/cartography' or its c... Remove this comment to see the full error message
import cartographiesRoutes from '@/routes/cartography'
// @ts-expect-error TS(2307): Cannot find module '@/routes/companies' or its cor... Remove this comment to see the full error message
import companiesRoutes from '@/routes/companies'
// @ts-expect-error TS(2307): Cannot find module '@/routes/auth' or its correspo... Remove this comment to see the full error message
import authRoutes from '@/routes/auth'
// @ts-expect-error TS(2307): Cannot find module '@/routes/file_upload' or its c... Remove this comment to see the full error message
import filesRoutes from '@/routes/file_upload'
// @ts-expect-error TS(2307): Cannot find module '@/routes/self-assessment' or i... Remove this comment to see the full error message
import complianceRoutes from '@/routes/self-assessment'
// @ts-expect-error TS(2307): Cannot find module '@/routes/missions_analysis' or... Remove this comment to see the full error message
import MissionAnalysisRoutes from '@/routes/missions_analysis'
// @ts-expect-error TS(2307): Cannot find module '@/routes/severities' or its co... Remove this comment to see the full error message
import SeveritiesAnalysisRoutes from '@/routes/severities'
// @ts-expect-error TS(2307): Cannot find module '@/routes/fearedEvents' or its ... Remove this comment to see the full error message
import FearedEventsRoutes from '@/routes/fearedEvents'
// @ts-expect-error TS(2307): Cannot find module '@/routes/ips' or its correspon... Remove this comment to see the full error message
import ips from '@/routes/ips'
// @ts-expect-error TS(2307): Cannot find module '@/routes/project-priorities' o... Remove this comment to see the full error message
import priorities from '@/routes/project-priorities'
// @ts-expect-error TS(2307): Cannot find module '@/routes/project-statuses' or ... Remove this comment to see the full error message
import projectStatuses from '@/routes/project-statuses'
// @ts-expect-error TS(2307): Cannot find module '@/routes/remediations' or its ... Remove this comment to see the full error message
import remediations from '@/routes/remediations'
// @ts-expect-error TS(2307): Cannot find module '@/routes/remediationProjects' ... Remove this comment to see the full error message
import remediationProjects from '@/routes/remediationProjects'
// @ts-expect-error TS(2307): Cannot find module '@/routes/phishing-scenarios-do... Remove this comment to see the full error message
import phishingScenarioDomains from '@/routes/phishing-scenarios-domains'

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
