// Third-party imports
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'

// Custom imports
import { CustomToggle } from './CustomToggle'

interface INavBar {
  containerMaxWidth: number
}

/* =============================================================================
                                  NavBar
============================================================================= */

export const NavBar = ({ containerMaxWidth }: INavBar) => {
  // const {} = useAppContext()
  const router = useRouter()
  const [show, setShow] = useState(false)

  /* ======================
      toggleCollapse()
  ====================== */

  const toggleCollapse = () => {
    setShow((v) => !v)
  }

  /* ======================
       renderNav()
  ====================== */

  const renderNav = () => {
    return (
      <Nav className='ms-auto'>
        {/* <Link
          className={`nav-link py-lg-0${
            router.pathname === '/about' ? ' active' : ''
          }`}
          href='/about'
          onClick={() => {
            setShow(false)
          }}
          style={{ fontSize: 16 }}
        >
          <FontAwesomeIcon icon={faInfo} style={{ marginRight: 5 }} />
          About
        </Link> */}
      </Nav>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Navbar
      // bg='primary'
      expand='lg'
      expanded={show}
      style={{
        backgroundColor: '#409',
        backgroundImage: 'linear-gradient(-90deg, #00affa, #3b128d)',
        boxShadow: 'inset 0px -1px 0px rgba(0, 0, 0, 0.25)'
        // paddingTop: 8,
        // paddingBottom: 8
      }}
      variant='dark'
    >
      <div
        className='container-fluid'
        style={{
          // Should match whatever the maxWidth is in the content layout.
          maxWidth: containerMaxWidth
          // Setting minHeight here is to prevent the shift that occurs when the
          // CustomToggle is present. This div switches from 24 to 30px. Here
          // we can make it always 30px with: minHeight: 30
          // However, instead of doing this, I've done this inside of CustomToggle:
          // style={{ position: 'absolute', top: 5, right: 5 }}
          // This prevents the hamburger from pushing out on this .container-fluid
        }}
      >
        <Link
          id='brand'
          className='navbar-brand p-0'
          href='/'
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: 10
            // lineHeight: 1, fontSize: 30
          }}
        >
          {/* <Image
            src={logo}
            alt='logo'
            style={{
              display: 'block',
              width: 'auto',
              maxHeight: 30
            }}
          /> */}

          <span
            className='outline-strong outline-secondary outline-width-dot-5 outline-shadow'
            style={{
              fontWeight: 800
            }}
          >
            Demo
          </span>
        </Link>

        <CustomToggle show={show} toggleCollapse={toggleCollapse} />

        <Navbar.Collapse>{renderNav()}</Navbar.Collapse>
      </div>
    </Navbar>
  )
}
