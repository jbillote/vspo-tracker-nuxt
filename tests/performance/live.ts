import autocannon from 'autocannon'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const instance = autocannon(
  {
    url: `${BASE_URL}/api/v1/videos/live`,
    connections: 10,
    duration: 30,
    warmupRequests: 5,
  },
  (err, result) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`\nResults for: ${BASE_URL}/api/v1/videos/live`)
    console.log(`Requests/sec: ${result.requests.average}`)
    console.log(`Latency p50:  ${result.latency.p50}ms`)
    console.log(`Latency p95:  ${result.latency.p95}ms`)
    console.log(`Latency p99:  ${result.latency.p99}ms`)
    console.log(`Errors:       ${result.errors}`)
  },
)

autocannon.track(instance)
