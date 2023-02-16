// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'vpkhia9m46'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-ugskd5kg25m601si.us.auth0.com',            // Auth0 domain
  clientId: 'GskNEoC3wWNcaXHdSpuikxDd0ps1LqVb',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
