import { useEffect, useState } from "react"



export const useDebounceValue = (value: string, timeout=200)=>{


    const [debounceValue, setDebounceValue] = useState("")
    

    useEffect(() => {
        
      const interval = setTimeout(()=>{
        setDebounceValue(value)
      } ,timeout)

      return () => {
        clearTimeout(interval)
      }
    }, [value, timeout])


    

   
    return debounceValue

    
}