import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navibar from './components/common/Navibar'
import Home from './components/pages/Home'
import ItemSingle from './components/pages/ItemSingle'
import Login from './components/pages/Login'
import Profile from './components/pages/Profile'
import Register from './components/pages/Register'




const App = () => {


  return (
    <div className='wrapper'>
      <BrowserRouter>
        <Navibar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/:itemId' element={<ItemSingle />} />
          <Route path='/users/:userId' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
