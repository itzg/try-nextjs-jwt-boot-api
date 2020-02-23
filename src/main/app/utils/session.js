import auth0 from "./auth0";
import fetch from "isomorphic-unfetch";
import Router from "next/router";

export default async function sessionFromContext({req, res}) {
  if (req) {
    console.log("Resolving session");
    const session = await auth0.getSession(req);
    if (!session) {
      res.writeHead(302, {
        Location: '/api/login'
      });
      res.end();
      return;
    }

    const {user, idToken} = session;
    return {user, idToken};
  } else {
    console.log("Fetching profile");
    const res = await fetch('/api/session');
    if (res.ok) {
      const session = await res.json();
      const {user, idToken} = session;
      return {user, idToken};
    } else {
      Router.push('/api/login');
    }
  }
}