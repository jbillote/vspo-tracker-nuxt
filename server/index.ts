import { Elysia } from 'elysia'
import streamersRoute from './api/v1/streamers'

export default () => new Elysia().use(streamersRoute)
