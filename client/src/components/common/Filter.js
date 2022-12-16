import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ items, setFilteredItems }) => {

  const [filter, setFilter] = useState({
    category: 0,
  })

  const [categories, setCategories] = useState([])
  const [error, setError] = useState(false)



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

  useEffect(() => {
    const filteredArray = items.filter(item => {
      return (item.category.id === filter.category || filter.category === 0)
    })
    setFilteredItems(filteredArray)
  }, [filter])


  const handleChange = (e) => {
    setFilter({ category: parseInt(e.target.value) })
    console.log('this is from filer ==>=>', filter)
  }

  return (
    <>
      <div className='filter-div'>
        {items.length ?
          <select onChange={handleChange} name='category' id='filter' value={filter.category}>
            <option value='0'>All Categories</option>
            {categories.map(category => {
              const { name, id } = category
              return (
                <option key={id} value={id}>{name}</option>
              )
            })}
          </select>
          :
          error ? <h2>Something is wrong, please try again later...</h2> : <p> loading... </p>
        }
      </div>
    </>
  )


}

export default Filter