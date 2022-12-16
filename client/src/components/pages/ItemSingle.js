import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Row, Container } from 'react-bootstrap'
import { getToken, getPayload, isOwner } from '../../helpers/auth'




const ItemSingle = () => {


  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showDelConfirm, setShowDelConfirm] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [profile, setProfile] = useState()
  const [ownerProfile, setOwnerProfile] = useState()
  const [item, setItem] = useState([])
  const [error, setError] = useState(false)
  const [userId] = useState(() => {
    if (getToken()) return getPayload().sub
    return ''
  })

  const { itemId } = useParams()
  const navigate = useNavigate()
  const defaultImage = 'https://content.optimumnutrition.com/i/on/on-C100969_Image_01?locale=en-gb,*&layer0=$PDP_004$'




  // get single item
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
  }, [refresh])


  // get owner profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        console.log('owner profile??')
        const response = await axios.get(`/api/auth/users/${item.owner.id}/`)
        setOwnerProfile(response.data)
        console.log('get owner profile response ==>', response.data)
      } catch (err) {
        console.log(err.message)
        setError(err)
      }
    }
    getProfile()
  }, [])


  // delete item
  const handleDelete = async () => {
    setShowDelConfirm(true)
  }

  const deleteItem = async (e) => {
    try {
      e.preventDefault()
      await axios.delete(`/api/items/listings/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const handleKeep = () => {
    setShowDelConfirm(false)
  }




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
        const updateItem = {
          ...item,
          category: item.category.id,
          owner: item.owner.id,
          buyer: userId,
        }
        await axios.put(`/api/items/listings/${item.id}/`, updateItem)
        console.log('item after purchase 👄 ==>', updateItem)
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
      <Row>
        <Col className='col'>
          <div className='item-image' style={{ backgroundImage: ` url(${item.item_image ? item.item_image : defaultImage})` }}></div>
          <div className='buttons-div'>
            {item.owner && isOwner(item.owner.id) ?
              <>
                <div className='delete-div'>
                  <p>You own this item.</p>
                  <p
                    title='WATCH OUT! this deletes the item!'
                    className='item-delete-btn purchase-btn'
                    onClick={handleDelete}>
                    Delist this item.
                  </p>
                  {showDelConfirm &&
                    <>
                      <div>
                        <div className='purchase-btn' onClick={deleteItem}>Yes</div>
                        <div className='purchase-btn' onClick={handleKeep}>No</div>
                      </div>
                    </>
                  }
                </div>
              </>
              :
              <>
                <div className='purchase-div'>
                  <div className='purchase-btn buy-now' onClick={handleBuy}>BUY NOW</div>
                  <div>
                    {showConfirmation && isValid ?
                      <div className='confirmation'>
                        <p>Are you sure you want to purchase this item?</p>
                        <div className='confirmation-btns'>
                          <div className='purchase-btn' onClick={handleYes}>Yes</div>
                          <div className='purchase-btn' onClick={handleNo}>No</div>
                        </div>
                        <div className='calculation'>
                          <p>Your Balance after this purchase:</p>
                          <div>${profile.wallet.toLocaleString('en-EN', {
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            groupingSeperator: ' ',
                          })} - <span className='item-cost'>${item.price.toLocaleString('en-EN', {
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            groupingSeperator: ' ',
                          })}</span> = <span className='display-4'>${((profile.wallet) - (item.price)
                          ).toLocaleString('en-EN', {
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            groupingSeperator: ' ',
                          })}</span>
                          </div>
                        </div>
                      </div>
                      : null
                    }
                  </div>
                </div>
              </>
            }
            {!isValid ? <div>Wallet balance too low</div> : null}
          </div>
        </Col>
        <Col className='col info-col'>
          <div className='item-info'>
            <div className='item-name'>{item.name}</div>
            <div className='item-owner'>seller: <span>{profile && profile.username}</span></div>
            <div className='item-price'>${item.price}</div>
            <div className='item-description'>
              {item.description}
            </div>
          </div>
        </Col>
      </Row>
    </main>
  )
}

export default ItemSingle