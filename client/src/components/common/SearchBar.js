import { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'


const SearchBar = () => {

  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState(false)







  // const handleInput = (e) => {
  //   setSearchInput(e.target.value)
  // }

  // const handleSearch = (e) => {
  //   e.preventDefault()
  //   setSearch(`&search=${searchInput}`)
  // }

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const { data } = await axios.get(`/api/items?${search}`)
  //       setSearchResults(data)
  //     } catch (err) {
  //       setError(true)
  //     }
  //   }
  //   getData()
  // }, [search])




  return (
    <>
      <div className='search-function text-center'>
        <Form className='d-flex'>
          <Form.Control
            type='search'
            placeholder='Search'
            className='me-2'
            aria-label='Search'
            value={searchInput}
          />
          <Button variant='outline-success'>Search</Button>
        </Form>
      </div>
    </>
  )


}


export default SearchBar