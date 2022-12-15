import { useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import Filter from '../common/Filter'


const ItemIndex = () => {

  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [error, setError] = useState(false)
  const defaultImage = 'https://content.optimumnutrition.com/i/on/on-C100969_Image_01?locale=en-gb,*&layer0=$PDP_004$'
  const navigate = useNavigate()




  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/items/listings/')
        setItems(data)
        setFilteredItems(data)
      } catch (err) {
        console.log(err)
        setError(err)
      }
    }
    getData()
  }, [])




  return (
    <main className='home-page'>
      <section className='hero-image'>
        <div className='hero-text'>
          <h1>T R A D E &nbsp; &nbsp; H U B</h1>
          <p>Your trusted Marketplace</p>
          <button onClick={() => navigate('/register')} className='hero-btn'>Join us</button>
        </div>
      </section>
      <Container className='items-container'>
        <Filter items={items}
          setFilteredItems={setFilteredItems} />
        {filteredItems.length ?
          <Row className='items-row' >
            {filteredItems.map(item => {
              const { name, price, id, owner } = item
              return (
                <Col key={id} xs={7} sm={6} md={5} lg={4} xl={3} className='items-col'>
                  <Card onClick={() => navigate(`/${id}`)} style={{ width: '18rem' }} className='mt-3 items-card'>
                    <Card.Body>
                      <div className='card-image' style={{ backgroundImage: ` url(${item.item_image ? item.item_image : defaultImage})` }}></div>
                      <Card.Footer className='items-div'>
                        <div className='card-name'>
                          <div>{name}</div>
                          <div className='item-price'>${price.toLocaleString('en-EN', {
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            groupingSeperator: ' ',
                          })}
                          </div>
                        </div>
                        <div className='owned-by'>
                          <p>seller: {owner.username}</p>
                        </div>
                      </Card.Footer>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
          :
          error ? <h2>Something is wrong, please try again later...</h2> : <p> loading...</p>
        }
      </Container>
    </main >
  )



}

export default ItemIndex