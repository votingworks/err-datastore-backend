# ERR Datastore Backend

A simple datastore backend for election results reporting.

## Goals

- A store of election results
- permissioned writes
- public reads
- easily scalable

This is not a front-end, just a simple datastore backend.

## Architecture

This datastore if implemented on Cloudflare Workers, and Cloudflare
Workers KV for data storage. The flow of data is as follows:

- new data is provided by a POST to a secret endpoint
- new data can be incremental
- the backend process processes the update into a complete view of the results
- the backend process converts that to the limited view needed for front-end rendering.
- the limited view is available at a public GET endpoint
- the public GET endpoint for the limited view has CORS enabled so it can easily be embedded in a different origin.

## Incremental Data Updates

The data POSTed contains a hierarchical data structure, with one data
structure variability: the array of precinct results may be of any
length. The rules for incremental data updates:

- any field that is null in the payload is considered _not updated_
- any precinct that is missing is considered _not updated_

The datastore maintains an aggregate view of all the data.

## Transformation to Viewable Data

The data across precincts is aggregated into a single overall
count. That data is then available at the public endpoint.
