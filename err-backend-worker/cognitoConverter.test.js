const { convert, objectAccumulate, accumulate } = require('./cognitoConverter')

test('accumulate objects', () => {
  expect(objectAccumulate({}, { foo: 'bar' })).toEqual({ foo: 'bar' })

  expect(objectAccumulate({ foo: 'bar' }, { bar: 'baz' })).toEqual({
    foo: 'bar',
    bar: 'baz',
  })

  expect(objectAccumulate({ foo: 'bar' }, { foo: null, bar: 'baz' })).toEqual({
    foo: 'bar',
    bar: 'baz',
  })

  expect(
    objectAccumulate(
      {
        parent1: {
          child11: {
            field111: 5,
            field112: 7,
          },
        },
        parent2: {
          child21: {
            field211: 4,
            field212: 8,
          },
        },
      },
      {
        parent1: {
          child11: {
            field112: 12,
          },
        },
        parent2: {
          child21: {
            field211: null,
          },
        },
        parent3: {
          child31: {
            field311: 6,
            field312: null,
          },
        },
      },
    ),
  ).toEqual({
    parent1: {
      child11: {
        field111: 5,
        field112: 12,
      },
    },
    parent2: {
      child21: {
        field211: 4,
        field212: 8,
      },
    },
    parent3: {
      child31: {
        field311: 6,
        field312: null,
      },
    },
  })
})

test('cognito accumulate', () => {
  expect(
    accumulate(
      {},
      {
        foo: 'bar',
      },
    ),
  ).toEqual({})

  expect(
    accumulate(
      {},
      {
        PreElectionData: {
          TotalVotersRegisteredInCity: 1000,
        },
      },
    ),
  ).toEqual({
    PreElectionData: {
      TotalVotersRegisteredInCity: 1000,
    },
  })

  expect(
    accumulate(
      {
        PreElectionData: {
          TotalVotersRegisteredInCity: 1000,
        },
      },
      {
        PreElectionData: {
          TotalVotersRegisteredInCity: 1001,
        },
      },
    ),
  ).toEqual({
    PreElectionData: {
      TotalVotersRegisteredInCity: 1001,
    },
  })

  expect(
    accumulate(
      {
        PreElectionData: {
          TotalVotersRegisteredInCity: 1000,
        },
      },
      {
        foo: 'bar',
      },
    ),
  ).toEqual({
    PreElectionData: {
      TotalVotersRegisteredInCity: 1000,
    },
  })

  expect(
    accumulate(
      {},
      {
        ElectionNightPrecinctResults: [
          {
            PrecinctName: 'foobar',
            randomFieldName: 5,
          },
        ],
      },
    ),
  ).toEqual({
    ElectionNightPrecinctResults: [
      {
        PrecinctName: 'foobar',
        randomFieldName: 5,
      },
    ],
  })

  expect(
    accumulate(
      {
        ElectionNightPrecinctResults: [
          {
            PrecinctName: 'foobar',
            randomFieldName: 5,
          },
        ],
      },
      {
        ElectionNightPrecinctResults: [
          {
            PrecinctName: 'foobar2',
            randomFieldName: 10,
          },
        ],
      },
    ),
  ).toEqual({
    ElectionNightPrecinctResults: [
      {
        PrecinctName: 'foobar',
        randomFieldName: 5,
      },
      {
        PrecinctName: 'foobar2',
        randomFieldName: 10,
      },
    ],
  })

  expect(
    accumulate(
      {},
      {
        Form: {
          Id: '4',
          InternalName: 'SampleERDataForm',
          Name: 'Sample ER Data Form',
        },
        $version: 7,
        $etag: 'W/"datetime\'2021-05-25T21%3A36%3A37.5192652Z\'"',
        Entry: {
          AdminLink: 'https://www.cognitoforms.com/VotingWorks1/4/entries/5',
          CustomerCard: null,
          DateCreated: '2021-05-25T21:36:37.404Z',
          DateSubmitted: '2021-05-25T21:36:37.373Z',
          DateUpdated: '2021-05-25T21:36:37.404Z',
          EditLink:
            'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#xPA1q0Y_lobKx8OZah3vQFbjCSGEGudUlz7ldwm1fNA$*',
          IsBeta: false,
          LastPageViewed: null,
          Number: 5,
          Order: null,
          Origin: {
            City: null,
            CountryCode: null,
            IpAddress: '73.202.37.228',
            IsImported: false,
            Region: null,
            Timezone: null,
            UserAgent:
              'Mozilla/5.0 (X11; CrOS x86_64 13816.82.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.218 Safari/537.36',
          },
          PaymentToken: null,
          Status: 'Submitted',
          Timestamp: '2021-05-25T21:36:37.373Z',
          Version: 1,
          ViewLink:
            'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#PN4-mU1chguJBItWduHweyMfRakkNH_PpTfjWYT4dEo$*',
        },
        PreElectionData: {
          TotalVotersRegisteredInCity: 1000,
          CerificationDate: null,
          ResultsCertified: false,
          TotalVotersRegisteredInCity_IncrementBy: 1,
        },
        ElectionNightPrecinctResults: [
          {
            Id: 'H3NUk',
            PrecinctName: null,
            ContestID775023387: {
              ID775033907: null,
              ID775036124: null,
              ID775036125: null,
              MayorWriteIn: null,
              ID775033907_IncrementBy: 1,
              ID775036124_IncrementBy: 1,
              ID775036125_IncrementBy: 1,
              MayorWriteIn_IncrementBy: 1,
            },
            ContestID775023386: {
              ID775033204: null,
              ID775036126: null,
              SouthWardAldermanWritein: null,
              ID775033204_IncrementBy: 1,
              ID775036126_IncrementBy: 1,
              SouthWardAldermanWritein_IncrementBy: 1,
            },
            ContestID775023385: {
              ID775033203: null,
              NorthWardAldermanWritein: null,
              ID775033203_IncrementBy: 1,
              NorthWardAldermanWritein_IncrementBy: 1,
            },
            TotalBallotsCast: null,
            ItemNumber: 1,
            TotalBallotsCast_IncrementBy: 1,
          },
        ],
        CumulativeAbsenteeCentralResults: {
          ContestID775023385: {
            ID775033203: null,
            NorthWardAldermanWritein: null,
            ID775033203_IncrementBy: 1,
            NorthWardAldermanWritein_IncrementBy: 1,
          },
          ContestID775023386: {
            ID775033204: null,
            ID775036126: null,
            SouthWardAldermanWritein: null,
            ID775033204_IncrementBy: 1,
            ID775036126_IncrementBy: 1,
            SouthWardAldermanWritein_IncrementBy: 1,
          },
          TotalBallotsCast: null,
          ContestID775023387: {
            ID775033907: null,
            ID775036124: null,
            ID775036125: null,
            MayorWriteIn: null,
            ID775033907_IncrementBy: 1,
            ID775036124_IncrementBy: 1,
            ID775036125_IncrementBy: 1,
            MayorWriteIn_IncrementBy: 1,
          },
          TotalBallotsCast_IncrementBy: 1,
        },
        Id: '4-5',
      },
    ),
  ).toEqual({
    Entry: {
      AdminLink: 'https://www.cognitoforms.com/VotingWorks1/4/entries/5',
      CustomerCard: null,
      DateCreated: '2021-05-25T21:36:37.404Z',
      DateSubmitted: '2021-05-25T21:36:37.373Z',
      DateUpdated: '2021-05-25T21:36:37.404Z',
      EditLink:
        'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#xPA1q0Y_lobKx8OZah3vQFbjCSGEGudUlz7ldwm1fNA$*',
      IsBeta: false,
      LastPageViewed: null,
      Number: 5,
      Order: null,
      Origin: {
        City: null,
        CountryCode: null,
        IpAddress: '73.202.37.228',
        IsImported: false,
        Region: null,
        Timezone: null,
        UserAgent:
          'Mozilla/5.0 (X11; CrOS x86_64 13816.82.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.218 Safari/537.36',
      },
      PaymentToken: null,
      Status: 'Submitted',
      Timestamp: '2021-05-25T21:36:37.373Z',
      Version: 1,
      ViewLink:
        'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#PN4-mU1chguJBItWduHweyMfRakkNH_PpTfjWYT4dEo$*',
    },
    PreElectionData: {
      TotalVotersRegisteredInCity: 1000,
      CerificationDate: null,
      ResultsCertified: false,
      TotalVotersRegisteredInCity_IncrementBy: 1,
    },
    ElectionNightPrecinctResults: [],
    CumulativeAbsenteeCentralResults: {
      ContestID775023385: {
        ID775033203: null,
        NorthWardAldermanWritein: null,
        ID775033203_IncrementBy: 1,
        NorthWardAldermanWritein_IncrementBy: 1,
      },
      ContestID775023386: {
        ID775033204: null,
        ID775036126: null,
        SouthWardAldermanWritein: null,
        ID775033204_IncrementBy: 1,
        ID775036126_IncrementBy: 1,
        SouthWardAldermanWritein_IncrementBy: 1,
      },
      TotalBallotsCast: null,
      ContestID775023387: {
        ID775033907: null,
        ID775036124: null,
        ID775036125: null,
        MayorWriteIn: null,
        ID775033907_IncrementBy: 1,
        ID775036124_IncrementBy: 1,
        ID775036125_IncrementBy: 1,
        MayorWriteIn_IncrementBy: 1,
      },
      TotalBallotsCast_IncrementBy: 1,
    },
  })

  expect(
    accumulate(
      {
        PreElectionData: {
          TotalVotersRegisteredInCity: 1000,
          CerificationDate: null,
          ResultsCertified: false,
          TotalVotersRegisteredInCity_IncrementBy: 1,
        },
        ElectionNightPrecinctResults: [],
        CumulativeAbsenteeCentralResults: {
          ContestID775023385: {
            ID775033203: null,
            NorthWardAldermanWritein: null,
            ID775033203_IncrementBy: 1,
            NorthWardAldermanWritein_IncrementBy: 1,
          },
          ContestID775023386: {
            ID775033204: null,
            ID775036126: null,
            SouthWardAldermanWritein: null,
            ID775033204_IncrementBy: 1,
            ID775036126_IncrementBy: 1,
            SouthWardAldermanWritein_IncrementBy: 1,
          },
          TotalBallotsCast: null,
          ContestID775023387: {
            ID775033907: null,
            ID775036124: null,
            ID775036125: null,
            MayorWriteIn: null,
            ID775033907_IncrementBy: 1,
            ID775036124_IncrementBy: 1,
            ID775036125_IncrementBy: 1,
            MayorWriteIn_IncrementBy: 1,
          },
          TotalBallotsCast_IncrementBy: 1,
        },
      },
      {
        Form: {
          Id: '4',
          InternalName: 'SampleERDataForm',
          Name: 'Sample ER Data Form',
        },
        $version: 7,
        $etag: 'W/"datetime\'2021-05-25T23%3A20%3A19.7647105Z\'"',
        Entry: {
          AdminLink: 'https://www.cognitoforms.com/VotingWorks1/4/entries/6',
          CustomerCard: null,
          DateCreated: '2021-05-25T23:20:19.680Z',
          DateSubmitted: '2021-05-25T23:20:19.649Z',
          DateUpdated: '2021-05-25T23:20:19.680Z',
          EditLink:
            'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#TmxwTREcXaSC6whm28y_aPho2QQAAPHQR_Ta72681_Y$*',
          IsBeta: false,
          LastPageViewed: null,
          Number: 6,
          Order: null,
          Origin: {
            City: null,
            CountryCode: null,
            IpAddress: '73.202.37.228',
            IsImported: false,
            Region: null,
            Timezone: null,
            UserAgent:
              'Mozilla/5.0 (X11; CrOS x86_64 13816.82.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.218 Safari/537.36',
          },
          PaymentToken: null,
          Status: 'Submitted',
          Timestamp: '2021-05-25T23:20:19.649Z',
          Version: 1,
          ViewLink:
            'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#SES-_0vp-YlrnWXD6GE7x5sMWdIPyPFXGjUz_wAaVw0$*',
        },
        PreElectionData: {
          TotalVotersRegisteredInCity: null,
          CerificationDate: '2021-05-27',
          ResultsCertified: false,
          TotalVotersRegisteredInCity_IncrementBy: 1,
        },
        ElectionNightPrecinctResults: [
          {
            Id: '4v97fq',
            PrecinctName: "King's Gym:575001082",
            ContestID775023387: {
              ID775033907: 34,
              ID775036124: null,
              ID775036125: null,
              MayorWriteIn: null,
              ID775033907_IncrementBy: 1,
              ID775036124_IncrementBy: 1,
              ID775036125_IncrementBy: 1,
              MayorWriteIn_IncrementBy: 1,
            },
            ContestID775023386: {
              ID775033204: null,
              ID775036126: null,
              SouthWardAldermanWritein: null,
              ID775033204_IncrementBy: 1,
              ID775036126_IncrementBy: 1,
              SouthWardAldermanWritein_IncrementBy: 1,
            },
            ContestID775023385: {
              ID775033203: null,
              NorthWardAldermanWritein: null,
              ID775033203_IncrementBy: 1,
              NorthWardAldermanWritein_IncrementBy: 1,
            },
            TotalBallotsCast: 500,
            ItemNumber: 1,
            TotalBallotsCast_IncrementBy: 1,
          },
        ],
        CumulativeAbsenteeCentralResults: {
          ContestID775023385: {
            ID775033203: null,
            NorthWardAldermanWritein: null,
            ID775033203_IncrementBy: 1,
            NorthWardAldermanWritein_IncrementBy: 1,
          },
          ContestID775023386: {
            ID775033204: null,
            ID775036126: null,
            SouthWardAldermanWritein: null,
            ID775033204_IncrementBy: 1,
            ID775036126_IncrementBy: 1,
            SouthWardAldermanWritein_IncrementBy: 1,
          },
          TotalBallotsCast: null,
          ContestID775023387: {
            ID775033907: null,
            ID775036124: null,
            ID775036125: null,
            MayorWriteIn: null,
            ID775033907_IncrementBy: 1,
            ID775036124_IncrementBy: 1,
            ID775036125_IncrementBy: 1,
            MayorWriteIn_IncrementBy: 1,
          },
          TotalBallotsCast_IncrementBy: 1,
        },
        Id: '4-6',
      },
    ),
  ).toEqual({
    Entry: {
      AdminLink: 'https://www.cognitoforms.com/VotingWorks1/4/entries/6',
      CustomerCard: null,
      DateCreated: '2021-05-25T23:20:19.680Z',
      DateSubmitted: '2021-05-25T23:20:19.649Z',
      DateUpdated: '2021-05-25T23:20:19.680Z',
      EditLink:
        'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#TmxwTREcXaSC6whm28y_aPho2QQAAPHQR_Ta72681_Y$*',
      IsBeta: false,
      LastPageViewed: null,
      Number: 6,
      Order: null,
      Origin: {
        City: null,
        CountryCode: null,
        IpAddress: '73.202.37.228',
        IsImported: false,
        Region: null,
        Timezone: null,
        UserAgent:
          'Mozilla/5.0 (X11; CrOS x86_64 13816.82.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.218 Safari/537.36',
      },
      PaymentToken: null,
      Status: 'Submitted',
      Timestamp: '2021-05-25T23:20:19.649Z',
      Version: 1,
      ViewLink:
        'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#SES-_0vp-YlrnWXD6GE7x5sMWdIPyPFXGjUz_wAaVw0$*',
    },
    PreElectionData: {
      TotalVotersRegisteredInCity: 1000,
      CerificationDate: '2021-05-27',
      ResultsCertified: false,
      TotalVotersRegisteredInCity_IncrementBy: 1,
    },
    ElectionNightPrecinctResults: [
      {
        Id: '4v97fq',
        PrecinctName: "King's Gym:575001082",
        ContestID775023387: {
          ID775033907: 34,
          ID775036124: null,
          ID775036125: null,
          MayorWriteIn: null,
          ID775033907_IncrementBy: 1,
          ID775036124_IncrementBy: 1,
          ID775036125_IncrementBy: 1,
          MayorWriteIn_IncrementBy: 1,
        },
        ContestID775023386: {
          ID775033204: null,
          ID775036126: null,
          SouthWardAldermanWritein: null,
          ID775033204_IncrementBy: 1,
          ID775036126_IncrementBy: 1,
          SouthWardAldermanWritein_IncrementBy: 1,
        },
        ContestID775023385: {
          ID775033203: null,
          NorthWardAldermanWritein: null,
          ID775033203_IncrementBy: 1,
          NorthWardAldermanWritein_IncrementBy: 1,
        },
        TotalBallotsCast: 500,
        ItemNumber: 1,
        TotalBallotsCast_IncrementBy: 1,
      },
    ],
    CumulativeAbsenteeCentralResults: {
      ContestID775023385: {
        ID775033203: null,
        NorthWardAldermanWritein: null,
        ID775033203_IncrementBy: 1,
        NorthWardAldermanWritein_IncrementBy: 1,
      },
      ContestID775023386: {
        ID775033204: null,
        ID775036126: null,
        SouthWardAldermanWritein: null,
        ID775033204_IncrementBy: 1,
        ID775036126_IncrementBy: 1,
        SouthWardAldermanWritein_IncrementBy: 1,
      },
      TotalBallotsCast: null,
      ContestID775023387: {
        ID775033907: null,
        ID775036124: null,
        ID775036125: null,
        MayorWriteIn: null,
        ID775033907_IncrementBy: 1,
        ID775036124_IncrementBy: 1,
        ID775036125_IncrementBy: 1,
        MayorWriteIn_IncrementBy: 1,
      },
      TotalBallotsCast_IncrementBy: 1,
    },
  })

  expect(
    accumulate(
      {
        PreElectionData: {
          TotalVotersRegisteredInCity: 1000,
          CerificationDate: '2021-05-27',
          ResultsCertified: false,
          TotalVotersRegisteredInCity_IncrementBy: 1,
        },
        ElectionNightPrecinctResults: [
          {
            Id: '4v97fq',
            PrecinctName: "King's Gym:575001082",
            ContestID775023387: {
              ID775033907: 34,
              ID775036124: null,
              ID775036125: null,
              MayorWriteIn: null,
              ID775033907_IncrementBy: 1,
              ID775036124_IncrementBy: 1,
              ID775036125_IncrementBy: 1,
              MayorWriteIn_IncrementBy: 1,
            },
            ContestID775023386: {
              ID775033204: null,
              ID775036126: null,
              SouthWardAldermanWritein: null,
              ID775033204_IncrementBy: 1,
              ID775036126_IncrementBy: 1,
              SouthWardAldermanWritein_IncrementBy: 1,
            },
            ContestID775023385: {
              ID775033203: null,
              NorthWardAldermanWritein: null,
              ID775033203_IncrementBy: 1,
              NorthWardAldermanWritein_IncrementBy: 1,
            },
            TotalBallotsCast: 500,
            ItemNumber: 1,
            TotalBallotsCast_IncrementBy: 1,
          },
        ],
        CumulativeAbsenteeCentralResults: {
          ContestID775023385: {
            ID775033203: null,
            NorthWardAldermanWritein: null,
            ID775033203_IncrementBy: 1,
            NorthWardAldermanWritein_IncrementBy: 1,
          },
          ContestID775023386: {
            ID775033204: null,
            ID775036126: null,
            SouthWardAldermanWritein: null,
            ID775033204_IncrementBy: 1,
            ID775036126_IncrementBy: 1,
            SouthWardAldermanWritein_IncrementBy: 1,
          },
          TotalBallotsCast: null,
          ContestID775023387: {
            ID775033907: null,
            ID775036124: null,
            ID775036125: null,
            MayorWriteIn: null,
            ID775033907_IncrementBy: 1,
            ID775036124_IncrementBy: 1,
            ID775036125_IncrementBy: 1,
            MayorWriteIn_IncrementBy: 1,
          },
          TotalBallotsCast_IncrementBy: 1,
        },
      },
      {
        Form: {
          Id: '4',
          InternalName: 'SampleERDataForm',
          Name: 'Sample ER Data Form',
        },
        $version: 7,
        $etag: 'W/"datetime\'2021-05-25T23%3A25%3A47.2228084Z\'"',
        Entry: {
          AdminLink: 'https://www.cognitoforms.com/VotingWorks1/4/entries/7',
          CustomerCard: null,
          DateCreated: '2021-05-25T23:25:47.134Z',
          DateSubmitted: '2021-05-25T23:25:47.102Z',
          DateUpdated: '2021-05-25T23:25:47.134Z',
          EditLink:
            'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#3CbyHWbId-88xPfE7habBDNDZVh-ZE4cxEGpmZAVfpY$*',
          IsBeta: false,
          LastPageViewed: null,
          Number: 7,
          Order: null,
          Origin: {
            City: null,
            CountryCode: null,
            IpAddress: '73.202.37.228',
            IsImported: false,
            Region: null,
            Timezone: null,
            UserAgent:
              'Mozilla/5.0 (X11; CrOS x86_64 13816.82.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.218 Safari/537.36',
          },
          PaymentToken: null,
          Status: 'Submitted',
          Timestamp: '2021-05-25T23:25:47.102Z',
          Version: 1,
          ViewLink:
            'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#IKFluHtDph30CH1dWExqBdkUWD_tBipILS7g6_92ZG8$*',
        },
        PreElectionData: {
          TotalVotersRegisteredInCity: null,
          CerificationDate: null,
          ResultsCertified: false,
          TotalVotersRegisteredInCity_IncrementBy: 1,
        },
        ElectionNightPrecinctResults: [
          {
            Id: '31Op68',
            PrecinctName: null,
            ContestID775023387: {
              ID775033907: null,
              ID775036124: null,
              ID775036125: null,
              MayorWriteIn: null,
              ID775033907_IncrementBy: 1,
              ID775036124_IncrementBy: 1,
              ID775036125_IncrementBy: 1,
              MayorWriteIn_IncrementBy: 1,
            },
            ContestID775023386: {
              ID775033204: null,
              ID775036126: null,
              SouthWardAldermanWritein: null,
              ID775033204_IncrementBy: 1,
              ID775036126_IncrementBy: 1,
              SouthWardAldermanWritein_IncrementBy: 1,
            },
            ContestID775023385: {
              ID775033203: null,
              NorthWardAldermanWritein: null,
              ID775033203_IncrementBy: 1,
              NorthWardAldermanWritein_IncrementBy: 1,
            },
            TotalBallotsCast: null,
            ItemNumber: 1,
            TotalBallotsCast_IncrementBy: 1,
          },
        ],
        CumulativeAbsenteeCentralResults: {
          ContestID775023385: {
            ID775033203: 200,
            NorthWardAldermanWritein: 10,
            ID775033203_IncrementBy: 1,
            NorthWardAldermanWritein_IncrementBy: 1,
          },
          ContestID775023386: {
            ID775033204: 50,
            ID775036126: null,
            SouthWardAldermanWritein: null,
            ID775033204_IncrementBy: 1,
            ID775036126_IncrementBy: 1,
            SouthWardAldermanWritein_IncrementBy: 1,
          },
          TotalBallotsCast: null,
          ContestID775023387: {
            ID775033907: null,
            ID775036124: null,
            ID775036125: null,
            MayorWriteIn: null,
            ID775033907_IncrementBy: 1,
            ID775036124_IncrementBy: 1,
            ID775036125_IncrementBy: 1,
            MayorWriteIn_IncrementBy: 1,
          },
          TotalBallotsCast_IncrementBy: 1,
        },
        Id: '4-7',
      },
    ),
  ).toEqual({
    Entry: {
      AdminLink: 'https://www.cognitoforms.com/VotingWorks1/4/entries/7',
      CustomerCard: null,
      DateCreated: '2021-05-25T23:25:47.134Z',
      DateSubmitted: '2021-05-25T23:25:47.102Z',
      DateUpdated: '2021-05-25T23:25:47.134Z',
      EditLink:
        'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#3CbyHWbId-88xPfE7habBDNDZVh-ZE4cxEGpmZAVfpY$*',
      IsBeta: false,
      LastPageViewed: null,
      Number: 7,
      Order: null,
      Origin: {
        City: null,
        CountryCode: null,
        IpAddress: '73.202.37.228',
        IsImported: false,
        Region: null,
        Timezone: null,
        UserAgent:
          'Mozilla/5.0 (X11; CrOS x86_64 13816.82.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.218 Safari/537.36',
      },
      PaymentToken: null,
      Status: 'Submitted',
      Timestamp: '2021-05-25T23:25:47.102Z',
      Version: 1,
      ViewLink:
        'https://www.cognitoforms.com/VotingWorks1/SampleERDataForm#IKFluHtDph30CH1dWExqBdkUWD_tBipILS7g6_92ZG8$*',
    },
    PreElectionData: {
      TotalVotersRegisteredInCity: 1000,
      CerificationDate: '2021-05-27',
      ResultsCertified: false,
      TotalVotersRegisteredInCity_IncrementBy: 1,
    },
    ElectionNightPrecinctResults: [
      {
        Id: '4v97fq',
        PrecinctName: "King's Gym:575001082",
        ContestID775023387: {
          ID775033907: 34,
          ID775036124: null,
          ID775036125: null,
          MayorWriteIn: null,
          ID775033907_IncrementBy: 1,
          ID775036124_IncrementBy: 1,
          ID775036125_IncrementBy: 1,
          MayorWriteIn_IncrementBy: 1,
        },
        ContestID775023386: {
          ID775033204: null,
          ID775036126: null,
          SouthWardAldermanWritein: null,
          ID775033204_IncrementBy: 1,
          ID775036126_IncrementBy: 1,
          SouthWardAldermanWritein_IncrementBy: 1,
        },
        ContestID775023385: {
          ID775033203: null,
          NorthWardAldermanWritein: null,
          ID775033203_IncrementBy: 1,
          NorthWardAldermanWritein_IncrementBy: 1,
        },
        TotalBallotsCast: 500,
        ItemNumber: 1,
        TotalBallotsCast_IncrementBy: 1,
      },
    ],
    CumulativeAbsenteeCentralResults: {
      ContestID775023385: {
        ID775033203: 200,
        NorthWardAldermanWritein: 10,
        ID775033203_IncrementBy: 1,
        NorthWardAldermanWritein_IncrementBy: 1,
      },
      ContestID775023386: {
        ID775033204: 50,
        ID775036126: null,
        SouthWardAldermanWritein: null,
        ID775033204_IncrementBy: 1,
        ID775036126_IncrementBy: 1,
        SouthWardAldermanWritein_IncrementBy: 1,
      },
      TotalBallotsCast: null,
      ContestID775023387: {
        ID775033907: null,
        ID775036124: null,
        ID775036125: null,
        MayorWriteIn: null,
        ID775033907_IncrementBy: 1,
        ID775036124_IncrementBy: 1,
        ID775036125_IncrementBy: 1,
        MayorWriteIn_IncrementBy: 1,
      },
      TotalBallotsCast_IncrementBy: 1,
    },
  })
})

test('basic Cognito transform', () => {
  const expectedOutput = {
    registeredVoterCount: 1000,
    ballotsCounted: 87,
    contests: {
      '775023387': {
        candidates: {
          '775033907': 28,
          '775036124': 47,
          '775036125': 12,
          writeIn: 0,
        },
      },
      '775023385': {
        candidates: {
          '775033203': 87,
          writeIn: 10,
        },
      },
      '775023386': {
        candidates: {
          '775033204': 62,
          '775036126': 25,
          writeIn: 0,
        },
      },
    },
    isOfficial: false,
    lastUpdatedDate: null,
    certificationDate: '2021-05-27',
  }

  const input = {
    PreElectionData: {
      TotalVotersRegisteredInCity: 1000,
      CertificationDate: '2021-05-27',
      ResultsCertified: false,
      TotalVotersRegisteredInCity_IncrementBy: 1,
    },
    ElectionNightPrecinctResults: [
      {
        Id: '4v97fq',
        PrecinctName: "King's Gym:575001082",
        ContestID775023387: {
          ID775033907: 28,
          ID775036124: 47,
          ID775036125: 12,
          MayorWriteIn: null,
          ID775033907_IncrementBy: 1,
          ID775036124_IncrementBy: 1,
          ID775036125_IncrementBy: 1,
          MayorWriteIn_IncrementBy: 1,
        },
        ContestID775023386: {
          ID775033204: 12,
          ID775036126: 10,
          SouthWardAldermanWritein: null,
          ID775033204_IncrementBy: 1,
          ID775036126_IncrementBy: 1,
          SouthWardAldermanWritein_IncrementBy: 1,
        },
        ContestID775023385: {
          ID775033203: 40,
          NorthWardAldermanWritein: null,
          ID775033203_IncrementBy: 1,
          NorthWardAldermanWritein_IncrementBy: 1,
        },
        TotalBallotsCast: 70,
        ItemNumber: 1,
        TotalBallotsCast_IncrementBy: 1,
      },
    ],
    CumulativeAbsenteeCentralResults: {
      ContestID775023385: {
        ID775033203: 47,
        NorthWardAldermanWritein: 10,
        ID775033203_IncrementBy: 1,
        NorthWardAldermanWritein_IncrementBy: 1,
      },
      ContestID775023386: {
        ID775033204: 50,
        ID775036126: 15,
        SouthWardAldermanWritein: null,
        ID775033204_IncrementBy: 1,
        ID775036126_IncrementBy: 1,
        SouthWardAldermanWritein_IncrementBy: 1,
      },
      TotalBallotsCast: 17,
      ContestID775023387: {
        ID775033907: null,
        ID775036124: null,
        ID775036125: null,
        MayorWriteIn: null,
        ID775033907_IncrementBy: 1,
        ID775036124_IncrementBy: 1,
        ID775036125_IncrementBy: 1,
        MayorWriteIn_IncrementBy: 1,
      },
      TotalBallotsCast_IncrementBy: 1,
    },
  }

  expect(convert(input)).toEqual(expectedOutput)
})
