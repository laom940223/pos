

import { QUERIES } from "../../consts/query-consts"
import { useQueryClient } from "@tanstack/react-query"

import { Navigate, Outlet } from 'react-router-dom'
import { User } from "../../consts/users"


export interface AuthorizationRouteProps {

    roles: string[]

}


export const AuthorizationRoute =  (  { roles   } :AuthorizationRouteProps ) =>{


        

        const queryClient = useQueryClient()
        const data = queryClient.getQueryData<User>([QUERIES.auth])


        if(!data) { 
            return <Navigate to="/login" />
        }

        
        

        const isAuthorized = roles.find(role =>  role ===  data.role)

        

        

        if(!isAuthorized) {
            return <Navigate to={"/403"}/>
        }
        
        

       return (

            <>
                <Outlet/>
            </>
       )
            
                
    }
