import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Collapse } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'


const ItemIndex = () => {

  const [items, setItems] = useState([])


  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/items/')
        console.log('data from homepage ==>', data)
        setItems(data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [])





  return (
    <main className='home-page'>
      <Container className='items-container'>
        <Row className='g-4 items-row' >
          {items.map(item => {
            const { name, price, id, duration } = item
            return (
              <Col key={id} sm='6' md='3' className='items-col'>
                <Link to={`${id}`}>
                  <Card className='items-card'>
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