module.exports = {
  serverRuntimeConfig: {
    authClientId: process.env.AUTH0_CLIENT_ID,
    authClientSecret: process.env.AUTH0_CLIENT_SECRET,
    authDomain: process.env.AUTH0_DOMAIN,
    baseUrl: "http://localhost:3000",
    jwksUrl: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }
};