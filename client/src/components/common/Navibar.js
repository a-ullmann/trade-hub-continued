import { Link, useNavigate, useParams } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { useState } from 'react'
import { isAuthenticated, handleLogout, getToken, getPayload } from '../../helpers/auth'


const Navibar = () => {
  const navigate = useNavigate()
  const [userId, setUserId] = useState(() => {
    if (getToken()) return getPayload().sub
    return ''
  })




  return (
    <Navbar>
      <Nav.Link as={Link} to='/'>Home</Nav.Link>
      {isAuthenticated() ?
        <>
          <Nav.Link as={Link} to={`/profile/${userId}`}>Profile</Nav.Link >
          <span onClick={() => handleLogout(navigate)}>Logout</span>
        </>
        :
        <>
          <Nav.Link as={Link} to='/login'>Login</Nav.Link>
          <Nav.Link as={Link} to='/register'>Register</Nav.Link>
        </>
      }
    </Navbar >
  )
}

export default Navibar