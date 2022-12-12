import axios from 'axios'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
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