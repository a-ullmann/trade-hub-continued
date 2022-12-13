import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Container } from 'react-bootstrap'
import { getToken, getPayload } from '../../helpers/auth'



const ItemSingle = () => {

  const [profile, setProfile] = useState()
  const [refresh, setRefresh] = useState(false)
  const [item, setItem] = useState([])
  const [error, setError] = useState(false)
  const [userId] = useState(() => {
    if (getToken()) return getPayload().sub
    return ''
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
  }, [itemId, refresh])

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


  // button 

  const handleBuy = async () => {
    try {
      const updateProfile = {
        ...profile,
        wallet: profile.wallet - item.price,
      }
      console.log('profile ==>', profile)
      console.log('wallet ==>', profile.wallet)
      await axios.put(`/api/auth/users/${userId}/`, updateProfile, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setRefresh(true)
    } catch (err) {
      setError(err)
    }
  }



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
            <button onClick={handleBuy}>BUY NOW</button>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default ItemSingle