import { QUERIES } from "../../consts/query-consts"
import { useQueryClient } from "@tanstack/react-query"

import { Navigate, Outlet } from 'react-router-dom'





export const PrivateRoute =  ( ) =>{


        const queryClient = useQueryClient()
        const data = queryClient.getQueryData([QUERIES.auth])


        if(!data) { 
            return <Navigate to="/login" />
        }
        

       return (

            <>
                <Outlet/>
            </>
       )
            
                
    }
