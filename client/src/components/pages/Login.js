import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../../helpers/auth'






const Login = () => {
  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState(false)


  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login/', formFields)
      console.log(data)
      setToken(data.token)
      navigate('/')
    } catch (err) {
      console.log('error', err.response.data.detail)
      setError(err.response.data.detail)
    }
  }


  return (
    <main className='auth-pages'>
      {/* <div className='auth-hero' style={{ backgroundImage: `url(${#})` }}></div> */}


      <div>
        <h1>LOGIN</h1>
        <p>Don&apos;t have an account? <span className='login-here' onClick={() => (navigate('/register'))}>Register here.</span></p>
        <div className='login'>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              name='username'
              placeholder='Username *'
              onChange={handleChange}
              value={formFields.username}
              required
            />
            <input
              type='password'
              name='password'
              placeholder='Password *'
              onChange={handleChange}
              value={formFields.password}
              required
            />
            {error && <small className='text-danger'>{error}</small>}
            <button>Log in</button>
          </form>
        </div>
      </div>
    </main >
  )

}

export default Login