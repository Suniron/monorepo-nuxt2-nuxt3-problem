// @ts-expect-error TS(2307): Cannot find module '@/routes' or its corresponding... Remove this comment to see the full error message
import routes from '@/routes'

export default async function loadRoutes(app: any) {
  app.use(routes)
}
