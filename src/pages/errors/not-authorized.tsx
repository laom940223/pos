import { Button, Result } from "antd"
import { Link } from "react-router-dom"




export const NotAuthorized  = ()=>{



    return (
        <>
             <Result
                status="403"
                title="403"
                subTitle="Sorry, you  not are authorized to access this resource."
                extra={
                
                    <Link  to={"/"}>
                        <Button type="primary">Back Home</Button>
                    </Link>

                }
            />
        </>
    )
}