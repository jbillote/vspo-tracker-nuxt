import { Elysia } from 'elysia'
import { StreamersRoutes } from './api/v1/streamers'
import { VideosRoutes } from './api/v1/videos'

export default () => new Elysia().use(StreamersRoutes).use(VideosRoutes)
