import { App as AntApp, Button, Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './components/auth/private-route';
import { Login } from './pages/login';
import "./index.css"
import "antd/dist/reset.css"
import { AppLayout } from './components/layout/app-layout';
import { AuthData } from './components/auth/auth-data';
import { NotFound } from './pages/not-found';
import { NotAuthorized } from './pages/not-authorized';
import { AuthorizationRoute } from './components/auth/authorization-route';
import { UserRoles } from './consts/users';
import { UsersPage } from './pages/users';
import { ProvidersPage } from './pages/providers';
import { Sales } from './pages/sales';
import { UnitsPage } from './pages/units';


function App() {


  




  return (
    
    <AntApp>
      <Routes >
          <Route path="" element={<AuthData/>} >
              <Route path="" element={<PrivateRoute />}>
                  <Route path="" element={<AppLayout/>}>
                        

                      <Route path='' element={
                          <AuthorizationRoute roles={[UserRoles.ADMIN]}/>
                        }>
                            
                            <Route path='/users'  >
                                <Route path="" element={<UsersPage/>}/>
                                <Route path='/users/:userId' element={<> user detail page </>} />
                            </Route>


                            <Route path='/sales' element={ <Sales/> }/>

                            <Route path="/providers">
                                <Route path="" element={ <ProvidersPage />}/>
                            </Route>


                            <Route path={"/products"}>

                                <Route path='/products/units' element={<UnitsPage/>} />

                            </Route>


                        </Route>




                      <Route path="/403" element={<NotAuthorized/>} />
                      <Route path='*'  element={<NotFound/>} />
                  </Route>
              </Route>

              <Route path='/login' element={<Login/>} />
          </Route>

      </Routes>
    </AntApp>
  )
}

export default App
