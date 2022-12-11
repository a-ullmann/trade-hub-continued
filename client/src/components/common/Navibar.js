import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { isAuthenticated, handleLogout, getToken, getPayload } from '../../helpers/auth'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import SearchBar from './SearchBar'
import axios from 'axios'

const Navibar = () => {
  const navigate = useNavigate()
  const [userId] = useState(() => {
    if (getToken()) return getPayload().sub
    return ''
  })
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])



  // useEffect(() => {
  //   getData()
  // }, [search])

  // const getData = async () => {
  //   try {
  //     const { data } = await axios.get(`/api/items?name=${search}`)
  //     console.log(data)
  //     setSearchResults(data)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.get(`/api/items/search?name=${search}`)
      setSearchResults(data)
    } catch (err) {
      console.log(err)
    }
  }







  return (
    <Navbar bg='dark' variant='dark' className='navbar'>
      <Container>
        <Navbar.Brand as={Link} to='/'>TRADE</Navbar.Brand>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type='text'
              placeholder='Search'
              value={search}
              onChange={handleChange}
            />
          </div>
        </form>
        {searchResults.length > 0 && (
          <div>
            <h2>search results:</h2>
            <ul>
              {searchResults.map((result) => (
                <Link key={result.id} to={`${result.id}`}>{result.name}</Link>
              ))}
            </ul>
          </div>
        )}
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
      </Container>
    </Navbar >
  )
}

export default Navibar