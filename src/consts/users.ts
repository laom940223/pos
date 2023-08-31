

export type UsersType = {

    
    id:number;
    username: string;
    name:string;
    lastname:string;
    email:string
    role: string;
    password? :string;

}


export enum UserRoles {


    ADMIN = "ADMIN",
    SUPERVISOR= "SUPERVISOR",
    EMPLOYEE = "EMPLOYEE"
    
}

export const sampleUsers :UsersType[] =[ 
    
    {
        id: 258,
        username:"tester32",
        name:"Misael",
        lastname:"Tester",
        email: "misatester@tester.com",
        role: UserRoles.ADMIN
    }, 

    {

        id: 259,
        username:"user2",
        name:"John",
        lastname:"Tester",
        email: "johnr@tester.com",
        role: UserRoles.EMPLOYEE

    }

]

