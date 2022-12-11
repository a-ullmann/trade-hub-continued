import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'



const ItemIndex = ({ searchedItems }) => {

  const [items, setItems] = useState([])
  const [error, setError] = useState(false)





  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/items/')
        console.log('data from homepage ==>', data)
        setItems(data)
      } catch (err) {
        console.log(err)
        setError(err)
      }
    }
    getData()
  }, [])





  return (
    <main className='home-page'>
      <Container className='items-container'>
        <Row className=' items-row' >
          {items.map(item => {
            const { name, price, id, duration } = item
            return (
              <Col key={id} sm='6' md='3' className='m-3 items-col'>
                <Link to={`${id}`}>
                  <Card border='primary' style={{ width: '18rem' }} className='items-card'>
                    <Card.Body>
                      <Card.Footer className='items-div'>
                        {name}, ${price} - Time Left: {duration}
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            )
          })}
        </Row>
      </Container>
    </main >
  )



}

export default ItemIndex