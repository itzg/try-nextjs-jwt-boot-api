import auth0 from '../../utils/auth0';

export default async function session(req, res) {
  try {
    const session = await auth0.getSession(req);
    const {user, idToken} = session;
    if (!user) {
      res.writeHead(302, {
        Location: '/api/login'
      });
      res.end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({user, idToken}));
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
