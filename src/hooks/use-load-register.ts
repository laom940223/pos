import { useEffect, useState } from "react"

import { OperationState, useOperationStore } from "../slices/operation-store"



export const REGISTER_KEY="REGISTER"

export const  useLoadRegister = ()=>{

    const registerStore = useOperationStore((state:OperationState)=> state.registerStore)

    

    useEffect(()=>{
        const localRegister = localStorage.getItem(REGISTER_KEY)
        if(localRegister)   {

            registerStore.setRegister(JSON.parse(localRegister))
        } 

    },[])

}