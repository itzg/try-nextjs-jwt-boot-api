import getConfig  from 'next/config';
import queryString from 'query-string';
import {
  generateLoginCookies,
  generateNonce,
  generateState
} from "../../utils/auth";

const {serverRuntimeConfig} = getConfig();

export default async (req, res) => {
  const nonce = generateNonce();
  const state = generateState();

  const query = queryString.stringify({
    response_type: 'id_token',
    client_id: serverRuntimeConfig.authClientId,
    redirect_uri: `${serverRuntimeConfig.baseUrl}/api/callback`,
    state,
    nonce
  });

  res.writeHead(302, {
    Location: `https://${serverRuntimeConfig.authDomain}/authorize?${query}`,
    'Set-Cookie': generateLoginCookies(nonce, state)
  });
  res.end();
}