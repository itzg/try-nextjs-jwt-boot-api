import {generateCookieDeletions} from "../../utils/auth";
import jwt from 'jsonwebtoken';
import jwksClientBuilder from 'jwks-rsa';
import getConfig  from 'next/config';
import cookie from "cookie";
import queryString from 'query-string';

const {serverRuntimeConfig} = getConfig();

const jwksClient = jwksClientBuilder({
  jwksUrl: serverRuntimeConfig.jwksUrl
});

export default async (req, res) => {
  const cookieDeletions = generateCookieDeletions();
  const headers = {
    'Set-Cookie': generateCookieDeletions()
  };

  const reqUrl = new URL(req.url);

  /*
  From remarks of https://auth0.com/docs/api/authentication?http#social, when
  requesting token or id_token the callback URL encodes token and state in location.hash
   */
  var query;
  if (reqUrl.hash) {
    query = queryString.parse(reqUrl.hash);
  } else {
    query = req.query;
  }

  const token = query.id_token;

  if (!query.state) {
    console.log('Missing state param');
    res.writeHead(401, {
      'Set-Cookie': generateCookieDeletions()
    });
  } else if (query.state !== req.cookies.state) {
    console.log('Incorrect state param');
    res.writeHead(401, {
      'Set-Cookie': generateCookieDeletions()
    });
  } else if (!token) {
    console.log('Missing id_token');
    res.writeHead(401, {
      'Set-Cookie': generateCookieDeletions()
    });
  } else {
    try {
      function jwksHandler(header, cb) {
        jwksClient.getSigningKey(header.kid, (err, key) => {
          if (err) {
            cb(err);
          } else {
            cb(nil, key.getPublicKey())
          }
        })
      }

      const verified = jwt.verify(token, jwksHandler, {
        nonce: req.cookies.nonce
      });

      const expires = new Date(verified.payload.exp * 1000);
      res.writeHead(302, {
        Location: '/',
        'Set-Cookie': [
          cookie.serialize('token', token, {expires}),
          ...generateCookieDeletions()
        ]
      })

    } catch (e) {
      console.log('Unable to verify token', e);
      res.writeHead(401, {
        'Set-Cookie': generateCookieDeletions()
      });
    }
  }

  res.end();
}
