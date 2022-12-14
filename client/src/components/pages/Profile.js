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
  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const navigate = useNavigate()

  const defaultImage = ''
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


  // handle deposit
  const handleDeposit = async () => {
    try {
      const updatedWallet = {
        ...profile,
        wallet: profile.wallet + 1000,
      }
      await axios.put(`/api/auth/users/${userId}/`, updatedWallet, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('profile ==>', profile)
      console.log('wallet ==>', profile.wallet)
      setRefresh(true)
      // setProfile(updatedWallet)
    } catch (err) {
      if (error) setError('')
    }
  }








  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.patch(`/api/profile/${userId}/`, profile, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }









  return (
    <main>
      <Container>
        <h2>USER PROFILE</h2>
        <div>
          {profile &&
            <>
              <h2>{profile.username}</h2>
              <div>$ {profile.wallet}</div>
            </>
          }
        </div>
        <button onClick={handleDeposit}>DEPOSIT $$</button>
        <Tabs defaultActiveKey='purchased' id='user-profile-tabs'>
          <Tab eventKey='purchased' title='Purchased'>
            {items.map(item => {
              const { name, price, id, duration, owner, buyer } = item
              return (
                <Col key={id} sm={6} md={4} lg={3} xl={3} className='m-3 items-col'>
                  <Link to={`/${id}`}>
                    <Card border='primary' style={{ width: '18rem' }} className='items-card'>
                      <Card.Body>
                        <div className='card-image' style={{ backgroundImage: ` url(${item.item_image ? item.item_image : defaultImage})` }}></div>
                        <Card.Footer className='items-div'>
                          {name}, ${price} <br /> owner: {owner.username}, buyer: {buyer}
                        </Card.Footer>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              )
            })}
          </Tab>
          <Tab eventKey='listed' title='Listed'>

          </Tab>
          <Tab eventKey='create-listing' title='Create Listing'>

            <ItemForm
              itemFields={itemFields}
              setItemFields={setItemFields}
              items={items}
            />
          </Tab>
        </Tabs>
      </Container>
    </main>
  )



}

export default Profile