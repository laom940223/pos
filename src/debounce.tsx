import { Button, Input, Typography } from "antd"
import  React, { useEffect, useRef, useState } from "react"
import { useDebounceValue } from "./hooks/use-debounce"


interface letterStatus {

    character:string, 
    visible :boolean
}

export const Debounce =()=>{


    const [sentence, setSentence] = useState<letterStatus[]>("The Lord Of The Rings".split("").map(character => ({ character, visible:character ===" "  })) as letterStatus[])
    const [letter, setLetter] = useState('')
    const [errors, setErrors] = useState(0)
    const [gameStatus, setGameStatus]= useState<"WON" | "PLAYING" | "LOSE">("PLAYING")
    const error = useRef(false)


   
    const handleReset = ()=>{


        setSentence("The Lord Of The Rings".split("").map(character => ({ character, visible:character ===" "  })) as letterStatus[])
        setErrors(0)
        setGameStatus("PLAYING")

    }


    useEffect(()=>{

        console.log(sentence.every(ref => ref.visible))

        if( sentence.every(ref => ref.visible)) {
            
            setGameStatus("WON")
            return
        }

        if(errors>=5){

            setGameStatus("LOSE")
        }
        

    },[sentence, errors])


    const display  = sentence.map(charto => {  return charto.visible ? charto.character : "_"})


    

    const handleEnter = ()=>{

        error.current = true

        const update = sentence.map<letterStatus>(toC =>{ 
           
            if(toC.character.toLowerCase() === letter.toLowerCase() ){
                error.current= false
                return { character: toC.character, visible: true } as letterStatus
            } 

            return toC
        })
        
        if(error.current) {
            setErrors(prev=> ++prev)
            setLetter("")
            return
        }


        // if(sentence.every(test => test.visible)) setGameStatus("WON")

        
        setSentence(update)
        setLetter("")
    }


    

    


    return (
<>
        <Typography.Title> {display} </Typography.Title>
        <Typography.Text>{errors}</Typography.Text>

            
         {
            gameStatus ==="PLAYING"?
                <Input value={letter} onChange={(e)=> setLetter(e.target.value[0])} onPressEnter={handleEnter} />
                :

                
                <>
                    <Typography.Title>{  `${gameStatus === "WON" ?  "YOU WON"  : "YOU LOSE"}` }</Typography.Title>
                    <Button onClick={handleReset}> Play again</Button>
                </>
         }       
            



  </>      
    )

}