import { Input } from "antd"
import  { useEffect, useState } from "react"
import { useDebounceValue } from "./hooks/use-debounce"


export const Debounce =()=>{


    const [value, setValue]= useState("")
    const debouceValue = useDebounceValue(value, 200)

    useEffect(()=>{
        console.log("debounce:" +debouceValue)

    }, [debouceValue])

    
    // console.log(value)
    

    return (


        <Input onChange={(e)=>{ setValue(e.target.value)}} value= {value} />
    )

}