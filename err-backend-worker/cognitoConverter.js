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
  const lastUpdatedDate = cognito_input.Entry
    ? cognito_input.Entry.DateUpdated
    : null

  const certificationDate = cognito_input.PreElectionData.CertificationDate

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
    certificationDate,
  }
}

module.exports = { convert, objectAccumulate, accumulate }
