import { QUERIES } from "../../consts/query-consts"
import { useQuery } from "@tanstack/react-query"
import {  User, defaultUser } from "../../consts/users"
import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom'





export const PrivateRoute =  ( ) =>{


    

    

    const auth = useQuery([ QUERIES.auth ],()=>{
        return new Promise<User | null>((resolve, reject) =>{

            const timeout= setTimeout( ()=>{

                // console.log("Rejecting")
                // reject("Cause i want")
                resolve(null)
            } ,1000)


            return ()=>{  clearTimeout(timeout)}
        })

    })


       



    if( auth.isLoading){
        return(
                <Spin tip="Loading" size="large"/>
      )
    }

    if( auth.isError){

        return(
            <>
            
            something went wrong
               
            </>
        )
    }



        
        if(!auth.data){

            return (
                <Navigate to="/login" />
            )

        }


        return <><Outlet/></>
            
                
    }
