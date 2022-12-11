import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Container } from 'react-bootstrap'



const ItemSingle = () => {

  const [item, setItem] = useState([])
  const [error, setError] = useState(false)
  const [itemField, setItemField] = useState({
    name: '',
    price: '',
    duration: '',
    categories: '',
    description: '',
  })


  const { itemId } = useParams()

  useEffect(() => {
    const getItem = async () => {
      try {
        const { data } = await axios.get(`/api/items/${itemId}/`)
        setItem(data)
      } catch (err) {
        setError(err)
      }
    }
    getItem()
  }, [itemId])



  return (
    <main>
      <Container>
        <div>
          {item.name}<br /> ${item.price} <br /> {item.duration} <br /> {item.description}
        </div>
      </Container>
    </main>
  )
}

export default ItemSingle