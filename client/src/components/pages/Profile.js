import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, Tab, Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getToken, isAuthenticated } from '../../helpers/auth'
import ItemForm from '../common/ItemForm'



const Profile = ({ itemFields, setItemFields }) => {


  const [items, setItems] = useState([])
  const [listings, setListings] = useState([])
  const [purchases, setPurchases] = useState([])
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
        setItems(data)
      } catch (err) {
        console.log(err)
        setError(err)
      }
    }
    getData()
  }, [])


  // get listings
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/items/listed/user/${userId}/`)
        setListings(data)
      } catch (err) {
        setError(err)
      }
    }
    getData()
  }, [])

  // get purchases
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/items/purchased/user/${userId}/`)
        setPurchases(data)
      } catch (err) {
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
                  <h1>{profile.username}</h1>
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
          <Tab eventKey='purchased' title='Purchased' className='profile-tab'>
            <Col className='items-col'>
              {purchases && purchases
                .map(item => {
                  const { name, price, id, owner, buyer } = item
                  return (
                    <Row key={id} xs={7} sm={6} md={5} lg={4} xl={3}>
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
                              <p>seller: {owner.username}</p> <br />
                              <p>buyer: {buyer.username}</p>
                            </div>
                          </Card.Footer>
                        </Card.Body>
                      </Card>
                    </Row>
                  )
                })}
            </Col>
          </Tab>
          <Tab eventKey='listed' title='Listed' className='profile-tab'>
            <Col className='items-col'>
              {listings && listings
                .map(item => {
                  const { name, price, id, owner, buyer } = item
                  return (
                    <Row key={id} xs={7} sm={6} md={5} lg={4} xl={3}>
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
                    </Row>
                  )
                })}
            </Col>
          </Tab>
          <Tab eventKey='create-listing' title='Create Listing' className='profile-tab'>
            <ItemForm
              itemFields={itemFields}
              setItemFields={setItemFields}
              items={items}
            />
          </Tab>
          <Tab eventKey='wire-transfer' title='Deposit Cash' className='profile-tab'>
            <div className='deposit-div'>
              <h1>Deposit quick and easy with our wire-transfer!</h1>
              {!showDeposit &&
                <button className='wire-btn' onClick={handleDeposit}>Wire-transfer $$</button>
              }
              {showDeposit &&
                <>
                  <form className='deposit-form'>
                    <label htmlFor='amount'>Enter the amount you would like to deposit:</label>
                    <input name='amount' type='number' onChange={handleChange} value={depositAmount.amount}></input>
                    <button className='deposit-btn' onClick={handleAmount}>Deposit</button>
                    <button onClick={handleNoDeposit}>Back</button>
                  </form>
                </>
              }
            </div>
          </Tab>
        </Tabs>
      </Container>
    </main>
  )
}

export default Profile