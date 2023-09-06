export type ServerResponse<T> ={


    data: T,
    errors: ServerError[]

}


export type ServerError = {

    location: string,
    message: string,

}