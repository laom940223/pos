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
import {  Checkout } from './pages/checkout';
import { UnitsPage } from './pages/units';
import { ProductsPage } from './pages/products';
import { ProductDetailPage } from './pages/product-detail';


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


                            <Route path='/checkout' element={ <Checkout/> }/>

                            <Route path="/providers">
                                  
                                <Route path="" element={ <ProvidersPage />}/>
                            </Route>


                            <Route path={"/products"}>

                                <Route path={""} element={<ProductsPage/>}/>
                                <Route path={"/products/:productId"}  element ={ <ProductDetailPage/> }/>
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
