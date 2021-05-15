
// the normal Cloudflare worker HTTP <--> event handler hook
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// all HTTP requests go here
async function handleRequest(request) {
  const publicURLToken = await ERR.get("publicURLToken")
  const secretURLToken = await ERR.get("secretURLToken")

  const url = new URL(request.url)

  if (request.method === "GET" && url.pathname === "/" + publicURLToken) {
    return new Response(await ERR.get("content"), {
      headers: { 'content-type': 'application/json' },
    })
  }

  if (request.method === "POST" && url.pathname === "/" + secretURLToken) {
    // try to parse JSON body
    const json_body = await request.json()

    // if succeeds, store it
    if (json_body) {
      await ERR.put("content", JSON.stringify(json_body))
      return new Response("ok", {
	headers: { 'content-type': 'text/plain' },
      })
    } else {
      return new Response("no JSON content", {
	headers: { 'content-type': 'text/plain' },
      })
    }
  }
  
  return new Response("nothing here yet.")
}
