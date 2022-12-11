import axios from 'axios'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getToken, isAuthenticated } from '../../helpers/auth'




const Profile = () => {

  const [profile, setProfile] = useState()
  const [error, setError] = useState(false)
  const navigate = useNavigate()


  const { userId } = useParams()


  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(`/api/auth/users/${userId}`)
        setProfile(response.data)
        console.log(response.data)
      } catch (err) {
        setError(err)
      }
    }
    getProfile()
  }, [])

  return (
    <main>
      <Container>
        <div>
          {profile &&
            profile.username}
        </div>
      </Container>
    </main>
  )



}

export default Profile