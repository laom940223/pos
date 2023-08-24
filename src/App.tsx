import { App as AntApp } from 'antd';
import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './components/auth/private-route';
import { Login } from './pages/login';
import "./index.css"
import "antd/dist/reset.css"


function App() {


  return (
    
    <AntApp>
      <Routes >
          <Route path="" element={<PrivateRoute />}>

          </Route>

          <Route path='/login' element={<Login/>} />
      
      </Routes>
    </AntApp>
  )
}

export default App
