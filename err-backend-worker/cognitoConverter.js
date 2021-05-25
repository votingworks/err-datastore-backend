function convert(cognito_input) {
  const registeredVoterCount =
    cognito_input.PreElectionData.TotalVotersRegisteredInCity
  const precinctResults = {}

  // sum up all the results
  const combinedResults = {}

  cognito_input.ElectionNightPrecinctResults.forEach(pr => {
    const precinctId = pr.PrecinctName.split(':')[1]
    const onePrecinctResults = (precinctResults[precinctId] = { contests: {} })
    Object.keys(pr).forEach(k => {
      if (k === 'Id' || k === 'ItemNumber' || k === 'PrecinctName') {
        return
      }
      onePrecinctResults.contests[k] = { candidates: {} }

      if (combinedResults[k] === undefined) {
        combinedResults[k] = { candidates: {} }
      }

      Object.keys(pr[k]).forEach(prk => {
        if (prk.includes('_IncrementBy')) {
          return
        }

        let new_prk
        if (prk.includes('WriteIn')) {
          new_prk = 'writeIn'
        } else {
          new_prk = prk.replace('ID', '')
        }

        onePrecinctResults.contests[k].candidates[new_prk] = pr[k][prk]

        combinedResults[k].candidates[new_prk] =
          (combinedResults[k].candidates[new_prk] || 0) + pr[k][prk]
      })
    })
  })

  return {
    registeredVoterCount,
    precincts: precinctResults,
    contests: combinedResults,
  }
}

module.exports = { convert }
