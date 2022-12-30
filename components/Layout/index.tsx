import { ErrorBoundary } from 'react-error-boundary'
import ErrorPage from './ErrorPage'
import { NavBar } from './NavBar'
import { NavBarContainer } from './NavBarContainer'

interface ILayout {
  children: React.ReactNode
}

const containerMaxWidth = 1400

/* ========================================================================
                                Layout
======================================================================== */

const Layout = ({ children }: ILayout) => {
  // Prevents smooth scrolling when using browsers back/forward buttons.
  // That said, I've just opted out of smooth scrolling in the global CSS.
  // https://github.com/vercel/next.js/issues/20951
  // router.beforePopState((state) => {
  //   const html = document.querySelector('html')!
  //   html.style.scrollBehavior = 'auto'

  //   setTimeout(() => {
  //     html.style.scrollBehavior = ''
  //   }, 1000)

  //   state.options.scroll = false
  //   return true
  // })

  /* ======================
        handleError()
  ====================== */

  const handleError = (_error: any, _errorInfo: any) => {
    // This is where you'd call your logging service.
    // console.log('Error: ', error)
    // console.log('Error Info: ', errorInfo)
  }

  /* ======================
        handleReset()
  ====================== */

  const handleReset = () => {
    // console.log('handleReset() was called.')
  }

  /* ======================
          return 
  ====================== */

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative'
        // paddingTop is set programmatically by NavBarContainer component.
      }}
    >
      <NavBarContainer>
        <NavBar containerMaxWidth={containerMaxWidth} />
      </NavBarContainer>

      <div
        // Don't put padding here, just in case a particular page wants to use a different
        // background-color, etc. Instead, let each page define its own padding on the
        // .main class, or create a <Page> component.
        style={{
          alignSelf: 'center',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          position: 'relative',
          // This is a good place to globally set the maxWidth for content.
          // Otherwise, you'd have to do it in each page's respective styles.
          // This number should match the maxWidth set for the NavBar's inner container.
          maxWidth: containerMaxWidth,
          width: '100%'
        }}
      >
        <ErrorBoundary
          FallbackComponent={ErrorPage}
          onError={handleError}
          onReset={handleReset}
        >
          {children}
        </ErrorBoundary>
      </div>
    </div>
  )
}

export { Layout }
