import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "../../consts/query-consts"
import { UsersType } from "../../consts/users"
import { Outlet } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../consts/endpoints"
import { ServerResponse } from "../../consts/server-types"


export const AuthData = ()=>{


    
    
  const auth = useQuery([ QUERIES.auth ],async()=>{
    
    
    const response= await axios.get<ServerResponse<UsersType[]>>(API_URL+"users")
    return response.data.data[1]

})



    if(auth.isLoading){

        return <>
            Loading
        </>
    }


    if(auth.isError){

        return <>
            Error
        </>
    }


    

    return <>
        <Outlet/>
        </>


    
}