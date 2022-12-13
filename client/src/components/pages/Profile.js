import axios from 'axios'
import { useEffect, useState } from 'react'
import { Tabs, Tab, Container } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getToken, isAuthenticated } from '../../helpers/auth'
import ItemForm from '../common/ItemForm'



const Profile = ({ itemFields, setItemFields, items }) => {

  const [profile, setProfile] = useState()
  const [error, setError] = useState(false)
  const navigate = useNavigate()


  const { userId } = useParams()


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



  // const handlesSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     await axios.post('/api/auth/register/', formFields)
  //     navigate('/login')
  //   } catch (err) {
  //     console.log(err.response.data.password_confirmation[0])
  //     setError(err.response.data.message)
  //   }
  // }



  const handleDeposit = (e) => {
    const updatedWallet = {
      ...profile,
      wallet: profile.wallet + 1000,
    }
    setProfile(updatedWallet)
    console.log('profile ==>', profile)
    console.log('wallet ==>', profile.wallet)
    if (error) setError('')
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
        <ItemForm
          itemFields={itemFields}
          setItemFields={setItemFields}
          items={items}
        />
      </Container>
    </main>
  )



}

export default Profile