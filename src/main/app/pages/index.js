import Head from 'next/head'
import Link from 'next/link'

function Home() {
  return (
      <div className="container">
        <Head>
          <title>Home Page</title>
        </Head>

        <main>
          <Link href="/greet">
            <a>Login via Auth0 and get a personalized greeting</a>
          </Link>
        </main>

        <style jsx global>{`
      html,
      body {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }
    `}</style>
      </div>
  )
}

export default Home
