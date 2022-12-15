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


  const handleChange = (e) => {
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
      navigate(`/${data.id}`)
    } catch (err) {
      console.log(err)
      console.log(err.message ? err.message : err.response.data.message)
      setError(err.message ? err.message : err.response.data.message)
    }
  }




  return (
    <div className='item-form'>
      <h1 className='create-listing'>Create Your Own Listing</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Name of Item:</label>
        <input
          type='text'
          name='name'
          onChange={handleChange}
          value={itemFields.name}
          placeholder='Item Name *'
          required
        />
        <label htmlFor='price'>Price:</label>
        <input
          type='number'
          name='price'
          step={0.01}
          onChange={handleChange}
          value={itemFields.price}
          placeholder='Price *'
          required
        />
        <label htmlFor='description'>Description:</label>
        <textarea
          type='text'
          name='description'
          onChange={handleChange}
          value={itemFields.description}
          placeholder='Item Description'
        />
        <label htmlFor='category'>Select the Category:</label>
        <select className='category-select' name='category' onChange={handleChange}>
          <option>Please select a category *</option>
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
        <button className='create-listing-btn'>Create Listing</button>
      </form>
    </div>
  )
}

export default ItemForm