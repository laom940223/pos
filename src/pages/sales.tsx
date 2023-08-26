import { useState } from "react"




export const Sales = ()=>{


    const [page, setPage] = useState(2)



    const slides   =  ["1","2","3", "4","5","6"].map((slide, index) =>{

        console.log(index+ " " + page)
        console.log(slide)
        return (
                <div style={{
                    width:"500px",
                    color:"whitesmoke",
                    fontSize:"2em",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    flexShrink:0,
                    position: "relative",
                    left: `-${page * 500}px`,
                    top:0,
                    backgroundColor: "teal",
                    // opacity:`${index ===  page ? 1 : 0}`
                    transition: "left .4s "

                }}>
                    {slide}
                </div>

        )
    })

    return (
        <>

            <div style={{
                 width:"500px",
                 height:"300px",
                 
                display: "flex",
                flexWrap:"nowrap",
                
                margin: "0 auto",
                position: "relative",
                top:0,
                left:0,
                overflow: "hidden",
                
                
                
            }} >

                {slides}
            </div>

            <button 
                disabled={page=== 0}
                onClick={()=>{     
                if(page===0) return 
                setPage(page =>page-1)
            }}
                >prev</button>



            <button 
                
            onClick={()=>{  

            if(page=== slides.length-1) {
                setPage(0)
                return
            }
            setPage(page =>page+1)
            }}
            >next</button>
            
            </>
    )
}