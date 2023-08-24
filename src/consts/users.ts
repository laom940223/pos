

export type User = {


    id:number;
    username: string;
    name:string;
    lastname:string;
    email:string
    role: string;

}


export const defaultUser :User = {


    id: 258,
    username:"tester32",
    name:"Misael",
    lastname:"Tester",
    email: "misatester@tester.com",
    role:"EMPLOYEE"

} 