import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, Tab, Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getToken, isAuthenticated } from '../../helpers/auth'
import ItemForm from '../common/ItemForm'



const Profile = ({ itemFields, setItemFields }) => {


  const [items, setItems] = useState([])
  const [profile, setProfile] = useState()
  const [showDeposit, setShowDeposit] = useState(false)
  const [depositAmount, setDepositAmount] = useState({
    amount: '',
  })
  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const navigate = useNavigate()

  const defaultImage = 'https://betarill.com/media/images/products/default_product.png'
  const { userId } = useParams()


  // get profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(`/api/auth/users/${userId}/`)
        setProfile(response.data)
        console.log('get profile response ==>', response.data)
      } catch (err) {
        console.log(err.message)
        setError(err)
      }
    }
    getProfile()
  }, [])

  // get all items
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/items/listings/')
        console.log('dataaaaa', data)
        console.log('👁', items.buyer ? items.buyer.id : 'nope')
        setItems(data)
      } catch (err) {
        console.log(err)
        setError(err)
      }
    }
    getData()
  }, [])


  // handle deposit
  const handleDeposit = () => {
    setShowDeposit(true)
  }

  const handleNoDeposit = () => {
    setShowDeposit(false)
  }

  const handleChange = (e) => {
    setDepositAmount({ amount: parseFloat(e.target.value) })
  }

  const handleAmount = async () => {
    try {
      const updatedWallet = {
        ...profile,
        wallet: profile.wallet + depositAmount.amount,
      }
      await axios.put(`/api/auth/users/${userId}/`, updatedWallet, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setRefresh(true)
    } catch (err) {
      if (error) setError('')
    }
  }









  return (
    <main className='user-profile'>
      <Container>
        <section className='profile-hero-image'>
          <div className='profile-hero-text'>
            <div>
              {profile &&
                <>
                  <h2>{profile.username}</h2>
                  <div>$ {profile.wallet.toLocaleString('en-EN', {
                    useGrouping: true,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    groupingSeperator: ' ',
                  })}
                  </div>
                </>
              }
            </div>
          </div>
        </section>
        <Tabs className='profile-tabs' defaultActiveKey='purchased' id='user-profile-tabs'>
          <Tab eventKey='purchased' title='Purchased'>
            {items && items
              // .filter(item => {
              //   return item.buyer.username === profile.username
              // })
              // buyer name === profile name
              .map(item => {
                const { name, price, id, owner, buyer } = item
                return (
                  <Row key={id}>
                    <Col sm={6} md={4} lg={3} xl={3} className='m-3 items-col'>
                      <Card onClick={() => navigate(`/${id}`)} style={{ width: '18rem' }} className='items-card'>
                        <Card.Body>
                          <div className='card-image' style={{ backgroundImage: ` url(${item.item_image ? item.item_image : defaultImage})` }}></div>
                          <Card.Footer className='items-div'>
                            <div className='card-name'>
                              <div>{name}</div>
                              {/* <div>{buyer}</div> */}
                              <div className='item-price'>${price.toLocaleString('en-EN', {
                                useGrouping: true,
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                groupingSeperator: ' ',
                              })}
                              </div>
                            </div>
                            <div className='owned-by'>
                              <p>owned by: {owner.username}</p>
                            </div>
                          </Card.Footer>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )
              })}
          </Tab>
          <Tab eventKey='listed' title='Listed'>
            {items && items
              // .filter(item => {
              //   return buyer.username === profile.username
              // })
              // owner name === profile name && (buyer === no buyer)
              .map(item => {
                const { name, price, id, owner, buyer } = item
                return (
                  <Row key={id}>
                    <Col sm={6} md={4} lg={3} xl={3} className='m-3 items-col'>
                      <Card onClick={() => navigate(`/${id}`)} style={{ width: '18rem' }} className='items-card'>
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
                              <p>owned by: {owner.username}</p>
                            </div>
                          </Card.Footer>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )
              })}
          </Tab>
          <Tab eventKey='create-listing' title='Create Listing'>
            <ItemForm
              itemFields={itemFields}
              setItemFields={setItemFields}
              items={items}
            />
          </Tab>
          <Tab eventKey='wire-transfer' title='Wire Transfer'>
            <button onClick={handleDeposit}>Wire-transfer $$</button>
            {showDeposit &&
              <>
                <form>
                  <label htmlFor='amount'>Enter the amount you would like to deposit:</label>
                  <input name='amount' type='number' onChange={handleChange} value={depositAmount.amount}></input>
                  <button onClick={handleAmount}>Deposit</button>
                  <button onClick={handleNoDeposit}>Back</button>
                </form>
              </>
            }
          </Tab>
        </Tabs>
      </Container>
    </main>
  )
}

export default Profile