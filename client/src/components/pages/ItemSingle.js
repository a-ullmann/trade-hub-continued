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
    category: '',
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
    <main className='single-page'>
      <Container>
        <Row>
          <Col xs={12} md={3}>
            <div className='item-name'>
              {item.name}<br />
            </div>
          </Col>
          <Col xs={12} md={3}>
            <div className='item-price'>
              ${item.price} <br />
            </div>
            <div className='item-duration'>
              {item.duration} <br /> {item.description}
            </div>
          </Col>
        </Row>
      </Container>
    </main >
  )
}

export default ItemSingle