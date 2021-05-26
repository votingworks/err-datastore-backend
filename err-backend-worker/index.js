// top-level fields expected
const CORE_FIELDS = [
  'PreElectionData',
  'CumulativeAbsenteeCentralResults',
  'Entry',
]

// top-level fields that contain arrays of objects and the primary key in those objects
const ARRAY_FIELDS_AND_KEY = {
  ElectionNightPrecinctResults: 'PrecinctName',
}

// schema *un*-aware, just updates an object tree incrementally
function objectAccumulate(accumulatedField, newField) {
  if (newField === null) {
    return accumulatedField || null
  }

  if (typeof newField === 'object') {
    return Object.keys(newField).reduce(
      (result, key) => {
        result[key] = objectAccumulate(
          accumulatedField ? accumulatedField[key] : null,
          newField[key],
        )
        return result
      },
      { ...accumulatedField },
    )
  }

  if (typeof newField === 'array') {
    // shouldn't happen yet, we don't support it
    throw 'oy'
  }

  return newField
}

// this is aware of the cognito schema
function accumulate(accumulatedData, newData) {
  return Object.keys(newData).reduce(
    (result, key) => {
      if (CORE_FIELDS.includes(key)) {
        result[key] = objectAccumulate(accumulatedData[key], newData[key])
      }

      if (Object.keys(ARRAY_FIELDS_AND_KEY).includes(key)) {
        const primaryKeyFieldName = ARRAY_FIELDS_AND_KEY[key]
        if (result[key] === undefined) {
          result[key] = []
        }
        newData[key].forEach(newArrayElement => {
          const primaryKeyValue = newArrayElement[primaryKeyFieldName]
          if (primaryKeyValue === null) {
            return
          }
          const existingArrayElement = result[key].find(
            e => e[primaryKeyFieldName] === primaryKeyValue,
          )
          result[key] = [
            ...result[key].filter(e => e !== existingArrayElement),
            objectAccumulate(existingArrayElement, newArrayElement),
          ]
        })
      }

      return result
    },
    { ...accumulatedData },
  )
}

function convert(cognito_input) {
  const registeredVoterCount =
    cognito_input.PreElectionData.TotalVotersRegisteredInCity

  const isOfficial = cognito_input.PreElectionData.ResultsCertified
  const lastUpdatedDate = cognito_input.Entry.DateUpdated

  let totalBallotsCast = 0

  const precinctResults = {}

  // sum up all the results
  const combinedResults = {}

  const precinctsAndAbsentee = [
    ...cognito_input.ElectionNightPrecinctResults,
    cognito_input.CumulativeAbsenteeCentralResults,
  ]
  precinctsAndAbsentee.forEach(oneGroupResult => {
    totalBallotsCast += oneGroupResult.TotalBallotsCast || 0
    Object.keys(oneGroupResult).forEach(k => {
      if (
        k === 'Id' ||
        k === 'ItemNumber' ||
        k === 'PrecinctName' ||
        k.includes('TotalBallotsCast')
      ) {
        return
      }

      const contestName = k.replace('ContestID', '')

      if (combinedResults[contestName] === undefined) {
        combinedResults[contestName] = { candidates: {} }
      }

      Object.keys(oneGroupResult[k]).forEach(prk => {
        if (prk.includes('_IncrementBy')) {
          return
        }

        let new_prk
        if (prk.toLowerCase().includes('writein')) {
          new_prk = 'writeIn'
        } else {
          new_prk = prk.replace('ID', '')
        }

        // this is where we sum things up
        combinedResults[contestName].candidates[new_prk] =
          (combinedResults[contestName].candidates[new_prk] || 0) +
          oneGroupResult[k][prk]
      })
    })
  })

  return {
    registeredVoterCount,
    ballotsCounted: totalBallotsCast,
    contests: combinedResults,
    isOfficial,
    lastUpdatedDate,
  }
}

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

// module.exports = { convert, objectAccumulate, accumulate }
