import React, {useEffect, useState} from 'react';
import {customAlphabet} from "nanoid";
import cookie from "cookie";
import { parseCookies, setCookie, destroyCookie } from 'nookies';

const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';

export const generateNonce = customAlphabet(charset, 16);
export const generateState = customAlphabet(charset, 8);

export function generateLoginCookies(nonce, state) {
  return [
    cookie.serialize('nonce', nonce, {
      httpOnly: true,
      sameSite: true
    }),
    cookie.serialize('state', state, {
      httpOnly: true,
      sameSite: true
    })
  ];
}

export function generateCookieDeletions() {
  return [
    cookie.serialize('nonce', ''),
    cookie.serialize('state', '')
  ]
}

export function useIdToken() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const {token} = parseCookies();
    if (!token) {
      location.assign(``)
    }
  }, []);

  return token;
}