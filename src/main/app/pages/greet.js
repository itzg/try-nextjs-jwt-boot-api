import Link from 'next/link'
import sessionFromContext from "../utils/session";

function Greet({user, greeting}) {
  return (
      <main>
        {greeting && <div>{greeting}</div>}
        <div>
          <Link href="/">
            <a>Go Home</a>
          </Link>
        </div>

        <style jsx global>{`
      html,
      body {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }
    `}</style>
      </main>

  );
}

Greet.getInitialProps = async (ctx) => {
  const session = await sessionFromContext(ctx);

  const {idToken} = session;
  try {
    const res = await fetch('http://localhost:8080/api/greeting', {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });
    if (res.ok) {
      const content = await res.json();

      return {...session, greeting: content.message};
    } else {
      console.error("api request failed", res.status, res.statusText);
      return session;
    }
  } catch (e) {
    console.error("failed to fetch greeting from api", e)
    return session;
  }

};

export default Greet;