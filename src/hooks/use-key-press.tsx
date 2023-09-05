import { useCallback, useEffect, useState } from "react"


interface KeyCombination {

    key: string, 
    special: KeySpecial
}

type KeySpecial = "CTRL" | "ALT" | "SHIFT" | "NULL"



export const useKeyPress = ()=>{

    const [keypressed, setKeypressed] = useState<KeyCombination>()


    const handler = useCallback( (e: KeyboardEvent)=>{


            
            let special= "NULL"


            if(e.ctrlKey){ 

                special= "CTRL"
            }

            if(e.shiftKey){

                special="ALT"
            }



            console.log(e)
            setKeypressed({  key: e.key , special: special  as KeySpecial })



    },[])

    useEffect(()=>{

        window.addEventListener("keypress", handler)


        return ()=>{ window.removeEventListener("keypress", handler)}


    },[handler])

    return  keypressed

}