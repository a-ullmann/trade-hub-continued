import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirmation: '',
    wallet: '',
  })

  const [error, setError] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/auth/register/', formFields)
      navigate('/login')
    } catch (err) {
      setError(err.response.data.message)
    }
  }
  const handleChange = (e) => {
    const updatedFormFields = {
      ...formFields,
      [e.target.name]: e.target.value,
    }
    setFormFields(updatedFormFields)
    if (error) setError('')
  }




  return (
    <main className='auth-pages'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          name='email'
          placeholder='Email *'
          onChange={handleChange}
          value={formFields.email}
          required
        />
        <input
          type='text'
          name='username'
          placeholder='Username *'
          onChange={handleChange}
          value={formFields.username}
          required
        />
        <input
          type='text'
          name='first_name'
          placeholder='First Name *'
          onChange={handleChange}
          value={formFields.firstName}
          required
        />
        <input
          type='text'
          name='last_name'
          placeholder='Last Name *'
          onChange={handleChange}
          value={formFields.lastName}
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
        <input
          type='password'
          name='password_confirmation'
          placeholder='Confirm Password *'
          onChange={handleChange}
          value={formFields.passwordConfirmation}
          required
        />
        <input
          type='number'
          step='0.01'
          name='wallet'
          placeholder='Deposit Amount *'
          onChange={handleChange}
          value={formFields.wallet}
        />
        {error && <small className='text-danger'>{error}</small>}
        <button className='uni-btn mt-5 mb-4'>Register</button>
      </form>
    </main>
  )

}
export default Register