import {  Descriptions, DescriptionsProps, Typography } from "antd"

import { useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../../consts/query-consts"
import { RegisterSession } from "../../consts/operations"




export const CashOut =()=>{


        const queryClient= useQueryClient()
        const session = queryClient.getQueryData<RegisterSession | null>([QUERIES.registerSession])
        // const calculatedTotal = sampleOpeations.map((value)=>{ return value.type ==="SALE" ?  value.amount : -value.amount  }).reduce((acc, curr)=> acc + curr)



        const items: DescriptionsProps['items'] = [
            {
              key: '1',
              label: 'SessionId',
              children: <p>{session?.id}</p>,
            },
            {
              key: '2',
              label: 'User',
              children: <p>{session?.user?.username}</p>,
            },

           
           

          ]
          

          
          

        

    return (
            <>
                <Typography.Title>Cash Out</Typography.Title>
                <Descriptions title="User Info" items={items} />;

                <>
                    {/* <Typography.Text> Total counter {calculatedTotal}</Typography.Text> */}
                </>

                <Typography.Text> TO DO input with money and authorization from admin</Typography.Text>

            </>      
    )

}