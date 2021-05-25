
const convert = require('./cognitoConverter').convert

test('basic Cognito transform', () => {
    const expectedOutput = {
	registeredVoterCount: 123456,
	ballotsReceived: 327,
	ballotsCounted: 87,
	contests: {
	    '775023387': {
		candidates: {
		    '775033907': 28,
		    '775036124': 47,
		    '775036125': 12,
		    'writeIn': 0,
		},
	    },
	    '775023385': {
		candidates: {
		    '775033203': 87,
		    'writeIn': 0,
		},
	    },
	    '775023386': {
		candidates: {
		    '775033204': 62,
		    '775036126': 25,
		    'writeIn': 0,
		},
	    },
	},
    }

    const input = {"Form":{"Id":"4","InternalName":"SampleERDataForm","Name":"Sample ER Data Form"},"$version":7,"$etag":"W/\"datetime'2021-05-24T20%3A09%3A43.5697926Z'\"","Entry":{"AdminLink":"https://www.cognitoforms.com/VotingWorks1/4/entries/2","CustomerCard":null,"DateCreated":"2021-05-24T20:09:43.398Z","DateSubmitted":"2021-05-24T20:09:43.351Z","DateUpdated":"2021-05-24T20:09:43.398Z","EditLink":"https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#1s9YfM4HUB8TA7YTxFGRVM0XWeMrklof39QtbaQIMN0$*","IsBeta":false,"LastPageViewed":null,"Number":2,"Order":null,"Origin":{"City":null,"CountryCode":null,"IpAddress":"68.41.2.216","IsImported":false,"Region":null,"Timezone":null,"UserAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"},"PaymentToken":null,"Status":"Submitted","Timestamp":"2021-05-24T20:09:43.351Z","Version":1,"ViewLink":"https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#n-zaZqTnOGz_9TIyrXylqpHc2FrpRannwNyuTqcO0rY$*"},"PreElectionData":{"TotalVotersRegisteredInCity":123456,"TotalVotersRegisteredInCity_IncrementBy":1},"ElectionNightPrecinctResults":[{"Id":"2JFs1a","PrecinctName":"King's Gym:575001082","Mayor":{"ID775033907":134,"ID775036124":4,"ID775036125":0,"MayorWriteIn":1,"ID775033907_IncrementBy":1,"ID775036124_IncrementBy":1,"ID775036125_IncrementBy":1,"MayorWriteIn_IncrementBy":1},"SouthWardAlderman2":{"ID775033204":5,"ID775036126":0,"SouthWardAldermanWritein":0,"ID775033204_IncrementBy":1,"ID775036126_IncrementBy":1,"SouthWardAldermanWritein_IncrementBy":1},"NorthWardAlderman":{"ID775033203":0,"NorthWardAldermanWritein":4,"ID775033203_IncrementBy":1,"NorthWardAldermanWritein_IncrementBy":1},"ItemNumber":1},{"Id":"32c3iV","PrecinctName":"American Legion:575001077","Mayor":{"ID775033907":0,"ID775036124":0,"ID775036125":0,"MayorWriteIn":0,"ID775033907_IncrementBy":1,"ID775036124_IncrementBy":1,"ID775036125_IncrementBy":1,"MayorWriteIn_IncrementBy":1},"SouthWardAlderman2":{"ID775033204":7,"ID775036126":3,"SouthWardAldermanWritein":0,"ID775033204_IncrementBy":1,"ID775036126_IncrementBy":1,"SouthWardAldermanWritein_IncrementBy":1},"NorthWardAlderman":{"ID775033203":23,"NorthWardAldermanWritein":2,"ID775033203_IncrementBy":1,"NorthWardAldermanWritein_IncrementBy":1},"ItemNumber":2}],"Id":"4-2"}
    
    expect(convert(input)).toEqual(expectedOutput)
})
