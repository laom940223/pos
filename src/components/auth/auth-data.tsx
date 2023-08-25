import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "../../consts/query-consts"
import { User, defaultUser } from "../../consts/users"
import { Outlet } from "react-router-dom"


export const AuthData = ()=>{


    
    
  const auth = useQuery([ QUERIES.auth ],()=>{
    return new Promise<User | null>((resolve, reject) =>{

        const timeout= setTimeout( ()=>{

            // console.log("Rejecting")
            // reject("Cause i want")
            resolve(defaultUser)
        } ,1000)


        return ()=>{  clearTimeout(timeout)}
    })

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