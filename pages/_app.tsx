import { Fragment } from 'react'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import { SWRConfig, Fetcher } from 'swr'
import axios from 'axios'

import { Layout } from 'components'
import { AppProvider } from 'contexts'
// import { sleep } from 'utils'
////////////////////////////////////////////////////////////////////////////////
//
// https://styled-components.com/docs/api
// To prevent TypeScript errors on the css prop on arbitrary elements,
// install @types/styled-components and add the following import once in your project:
// import {} from 'styled-components/cssprop'
//
// But actually do this:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245#issuecomment-446011384
// https://stackoverflow.com/questions/60952710/styled-componentss-css-prop-with-typescript
//
////////////////////////////////////////////////////////////////////////////////
import type {} from 'styled-components/cssprop'

import 'react-toastify/dist/ReactToastify.css'
// https://stackoverflow.com/questions/66539699/fontawesome-icons-not-working-properly-in-react-next-app
// FontAwesome styles may need to be imported explicitly because
// of something called purgeCSS: "purgeCSS was purging the required FontAwesome styles."
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// https://blog.logrocket.com/handling-bootstrap-integration-next-js/
// import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.scss'
import type { AppProps } from 'next/app'

const fetcher: Fetcher<any, any> = async (url: string) => {
  // Use sleep() to test slow connections, optimistic udpates, etc.
  // if (process.env.NODE_ENV === 'development') {
  //   await sleep(3000)
  //   console.log('fetcher() called.')
  // }

  const res = await axios.get(url)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Initially, I was just returning res.data. However, this means that
  // the todos cache will be { data, message, success }. That gets way
  // too confusing when it comes to functions for optimistic updates, etc.
  // Doing this is cleaner. However, it means tha there must be an agreement
  // between the server and the client such that all response objects have a
  // data property on them. As for success and message, those two properties
  // are essentially being stripped out. Nonetheless, I still like to build
  // the responses like that.
  //
  ///////////////////////////////////////////////////////////////////////////
  return res?.data?.data
}

/* ========================================================================
                              App
======================================================================== */

export default function App({
  Component,
  pageProps: { ...pageProps }
}: AppProps) {
  return (
    <Fragment>
      {/* Gotcha: https://github.com/fkhadra/react-toastify/issues/858
      I ran into this issue when doing this from within /todos/[id].

        router.push('/')
        toast.success('The todo has been deleted!')

      The issue doesn't seem to be related to SWR. Rather, some weird race condition
      SOMETIMES occurs when quickly navigating to a page and toasting at approximately
      the same time. It's unclear why this would happen, but the issue probably has to
      to with <ToastContainer /> not being mounted when <Component {...pageProps} />
      is mounted. Solution: <ToastContainer /> placement matters! As a sibling to 
      <Component {...pageProps} /> it should come BEFORE. 

        <ToastContainer autoClose={3000} />
        <Component {...pageProps} />

      Better still, just place <ToastContainer /> first. */}
      <ToastContainer autoClose={3000} />

      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='An eCommerce Website' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        ></meta>
        <title>Demo</title>

        {/* You can import remote fonts globally doing this.
        If you try to do it from within the global css/scss file it won't work.
        That said, this approach will cause the UI to render with the fallback 
        font first, then the imported font. This will cause a layout shift.
        It may not be noticeable to you, but with slow internet speeds, it 
        will cause a bad effect. The correct approach is to always use font optimization. */}

        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          @import
          url('https://fonts.googleapis.com/css?family=Luckiest+Guy&display=swap');
        </style>
      </Head>

      <SWRConfig
        value={{
          // dedupe requests with the same key in this time span
          // in milliseconds 2000 is also already the default.
          dedupingInterval: 2000,
          fetcher: fetcher
        }}
      >
        <AppProvider>
          <Layout>
            <ToastContainer autoClose={3000} />
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </SWRConfig>
    </Fragment>
  )
}
