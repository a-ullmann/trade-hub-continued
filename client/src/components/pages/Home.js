import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ItemForm from '../common/ItemForm'


const ItemIndex = ({ itemFields, setItemFields }) => {

  const [items, setItems] = useState([])
  const [error, setError] = useState(false)





  useEffect(() => {
    const getData = async () => {
      try {
        console.log('executed')
        const { data } = await axios.get('/api/items/listings/')
        console.log('data from homepage ==>', data)
        setItems(data)
      } catch (err) {
        console.log(err)
        setError(err)
      }
    }
    getData()
  }, [])

  const defaultImage = ''



  return (
    <main className='home-page'>
      <Container className='items-container'>
        <Row className='items-row ' >
          {items.map(item => {
            const { name, price, id, duration } = item
            return (
              <Col key={id} sm={6} md={4} lg={3} xl={3} className='m-3 items-col'>
                <Link to={`${id}`}>
                  <Card border='primary' style={{ width: '18rem' }} className='items-card'>
                    <Card.Body>
                      <div className='card-image' style={{ backgroundImage: ` url(${item.item_image ? item.item_image : defaultImage})` }}></div>
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
        <ItemForm
          itemFields={itemFields}
          setItemFields={setItemFields}
          items={items} />
      </Container>
    </main >
  )



}

export default ItemIndex