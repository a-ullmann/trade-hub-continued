import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirmation: '',
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
    <main>
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
          name='firstName'
          placeholder='First Name *'
          onChange={handleChange}
          value={formFields.firstName}
          required
        />
        <input
          type='text'
          name='lastName'
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
          name='passwordConfirmation'
          placeholder='Confirm Password *'
          onChange={handleChange}
          value={formFields.passwordConfirmation}
          required
        />
        <input
          type='number'
          step='0.01'
          name='wallet'
          placeholder='Enter your amount *'
          onChange={handleChange}
          value={formFields.wallet}

        />
        <button className='uni-btn-primary mt-5 mb-4'>Register</button>
      </form>
    </main>
  )


}
export default Register

// email: '',
// username: '',
// first_name: '',
// last_name: '',
// password: '',
// password_confirmation: '',
// wallet: '',