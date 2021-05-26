const { convert, accumulate } = require('./cognitoConverter')

// the normal Cloudflare worker HTTP <--> event handler hook
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const LAST_DATA_KEY = 'lastData'
const ACCUMULATED_RAW_DATA_KEY = 'accumulatedRawData'
const ACCUMULATED_PROCESSED_DATA_KEY = 'accumulatedProcessedData'

// all HTTP requests go here
async function handleRequest(request) {
  const publicURLToken = await ERR.get('publicURLToken')
  const secretURLToken = await ERR.get('secretURLToken')

  const url = new URL(request.url)

  if (request.method === 'GET' && url.pathname === '/' + publicURLToken) {
    return new Response(await ERR.get(ACCUMULATED_PROCESSED_DATA_KEY), {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  if (request.method === 'POST' && url.pathname === '/' + secretURLToken) {
    // try to parse JSON body
    const json_body = await request.json()

    // if succeeds, store it
    if (json_body) {
      const currentAccumulatedData = JSON.parse(
        (await ERR.get(ACCUMULATED_RAW_DATA_KEY)) || '{}',
      )

      const newAccumulatedData = accumulate(currentAccumulatedData, json_body)
      const newProcessedData = convert(newAccumulatedData)

      await ERR.put(LAST_DATA_KEY, JSON.stringify(json_body))
      await ERR.put(
        ACCUMULATED_RAW_DATA_KEY,
        JSON.stringify(newAccumulatedData),
      )
      await ERR.put(
        ACCUMULATED_PROCESSED_DATA_KEY,
        JSON.stringify(newProcessedData),
      )
      return new Response('ok', {
        headers: { 'content-type': 'text/plain' },
      })
    } else {
      return new Response('no JSON content', {
        headers: { 'content-type': 'text/plain' },
      })
    }
  }

  return new Response('nothing here yet.')
}
