import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Container } from 'react-bootstrap'
import { getToken, getPayload } from '../../helpers/auth'




const ItemSingle = () => {


  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [profile, setProfile] = useState()
  const [item, setItem] = useState([])
  const [error, setError] = useState(false)
  const [userId] = useState(() => {
    if (getToken()) return getPayload().sub
    return ''
  })

  const { itemId } = useParams()
  const navigate = useNavigate()






  useEffect(() => {
    const getItem = async () => {
      try {
        const { data } = await axios.get(`/api/items/listings/${itemId}/`)
        setItem(data)
      } catch (err) {
        setError(err)
      }
    }
    getItem()
  }, [itemId])

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
  }, [refresh])


  // button 






  const handleBuy = async () => {
    setShowConfirmation(true)
  }





  const handleYes = async () => {
    if (profile.wallet > item.price) {
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

        navigate(`/users/${userId}/`)
      } catch (err) {
        console.log(err)
        setError(err)
      }
    } else {
      setIsValid(false)
    }
  }

  const handleNo = async () => {
    setShowConfirmation(false)
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
            {showConfirmation && isValid ? <div className='confirmation'>Are you sure you want to purchase this item?
              <button onClick={handleYes}>Yes</button>
              <button onClick={handleNo}>No</button>
            </div>
              : null
            }
            {!isValid ? <div>Wallet balance too low</div> : null}
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default ItemSingle