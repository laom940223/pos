

export type User = {


    id:number;
    username: string;
    name:string;
    lastname:string;
    email:string
    role: string;

}


export enum UserRoles {


    ADMIN = "ADMIN",
    SUPERVISOR= "SUPERVISOR",
    EMPLOYEE = "EMPLOYEE"
    
}

export const defaultUser :User = {


    id: 258,
    username:"tester32",
    name:"Misael",
    lastname:"Tester",
    email: "misatester@tester.com",
    role: UserRoles.EMPLOYEE

} 



