import routes from '../../src/routes'

export default async function loadRoutes(app: any) {
  app.use(routes)
}
