import axios from 'axios'
import { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../../helpers/auth'
import ImageUpload from './ImageUpload'

const ItemForm = () => {

  const navigate = useNavigate()

  const [seconds, setSeconds] = useState(0)
  const [hours, setHours] = useState(0)
  const [days, setDays] = useState(0)
  const [error, setError] = useState(false)
  const [itemFields, setItemFields] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    item_image: '',
    category: '',
  })
  const [categories, setCategories] = useState([])







  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/category')
        console.log('categories 👍🏼 ==>', categories)
        setCategories(data)
      } catch (err) {
        console.log(err)
        setError(err)
      }
    }
    getData()
  }, [])






  // const handleDays = (e) => {
  //   setDays(e.target.value)
  // }

  // const startCountdown = (e) => {
  //   const secondsInDay = 86400
  //   const secondsInHour = 3600
  //   const totalSeconds = days * secondsInDay + hours * secondsInHour
  //   setSeconds(totalSeconds)

  //   setInterval(() => {
  //     setSeconds(seconds => seconds - 1)
  //   }, 1000)
  //   console.log('countdown started')
  // }


  const handleChange = (e) => {
    console.log('e value =====>', e.target.value)
    console.log('e name =====>', e.target.name)
    setItemFields({ ...itemFields, [e.target.name]: e.target.value })
    if (error) setError(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!getToken()) throw new Error('Please log in to create a listing.')
      const { data } = await axios.post('/api/items/listings/', itemFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setItemFields({ name: '', price: '', duration: '', description: '', profile_image: '', category: '' })
      // startCountdown()
      navigate(`/${data.id}`)
    } catch (err) {
      console.log(err)
      console.log(err.message ? err.message : err.response.data.message)
      setError(err.message ? err.message : err.response.data.message)
    }
  }




  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          onChange={handleChange}
          value={itemFields.name}
          placeholder='Item Name *'
          required
        />
        <input
          type='number'
          name='price'
          step={0.01}
          onChange={handleChange}
          value={itemFields.price}
          placeholder='Price *'
          required
        />
        <input
          type='number'
          name='duration'
          onChange={handleChange}
          value={itemFields.duration}
          placeholder='Duration *'
          required
        />
        <input
          type='text'
          name='description'
          onChange={handleChange}
          value={itemFields.description}
          placeholder='Item Description'
        />
        <select name='category' onChange={handleChange}>
          {categories.map(category => {
            const { name, id } = category
            return (
              <option key={id} value={id}>{name}</option>
            )
          })}
        </select>
        <ImageUpload
          itemFields={itemFields}
          setItemFields={setItemFields}
          item_image={itemFields.item_image}
        />
        <button className='u'>Create Listing</button>
      </form>
    </Card>
  )
}

export default ItemForm