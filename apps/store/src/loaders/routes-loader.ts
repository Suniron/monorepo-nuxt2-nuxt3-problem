import routes from '@/routes'

export default async function loadRoutes(app) {
  app.use(routes)
}
