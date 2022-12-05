import express from 'express'
import assetsRoutes from '@/routes/assets'
import usersRoutes from '@/routes/users'
import postsRoutes from '@/routes/blog'
import scanRoutes from '@/routes/scans'
import tagsRoutes from '@/routes/tags'
import groupsRoutes from '@/routes/groups'
import probesRoutes from '@/routes/probes'
import relationRoutes from '@/routes/relations'
import reportsRoutes from '@/routes/reports'
import vulnerabilitiesRoutes from '@/routes/vulnerabilities'
import dashboardRoutes from '@/routes/dashboard'
import cartographiesRoutes from '@/routes/cartography'
import companiesRoutes from '@/routes/companies'
import authRoutes from '@/routes/auth'
import filesRoutes from '@/routes/file_upload'
import complianceRoutes from '@/routes/self-assessment'
import missionAnalysis from '@/routes/missions_analysis'
import fearedEvents from '@/routes/fearedEvents'
import severities from '@/routes/severities'
import ips from '@/routes/ips'
import projectStatuses from '@/routes/project-statuses'
import remediationProjects from '@/routes/remediationProjects'
import priorities from '@/routes/project-priorities'
import remediations from '@/routes/remediations'
import phishingScenariosDomains from '@/routes/phishing-scenarios-domains'
const router = express.Router()
router.get('/', (_req, res) => {
  res.send('Xrator API is up!')
})

// JWT Auth parsing for easy access (not validation)
router.use(authRoutes)

router.use('/assets', assetsRoutes)
router.use(usersRoutes)
router.use(postsRoutes)
router.use(scanRoutes)
router.use(tagsRoutes)
router.use(groupsRoutes)
router.use(probesRoutes)
router.use(relationRoutes)
router.use(reportsRoutes)
router.use(vulnerabilitiesRoutes)
router.use(dashboardRoutes)
router.use(cartographiesRoutes)
router.use(companiesRoutes)
router.use(filesRoutes)
router.use(complianceRoutes)
router.use(missionAnalysis)
router.use(severities)
router.use(fearedEvents)
router.use(ips)
router.use(projectStatuses)
router.use(remediationProjects)
router.use(priorities)
router.use(remediations)
router.use(phishingScenariosDomains)

export default router
