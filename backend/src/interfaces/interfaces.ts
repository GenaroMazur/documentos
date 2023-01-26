export interface userAccount {
    username:string,
    password:string,
    role?:"USER"|"ADMIN"|"DRIVER",
    information?:userInformation
}

export interface userInformation {
    document:number,
    firstName:string,
    lastName:string,
    cellphone?:string,
    email:string
}

export interface objectOfToken extends userInformation{
    username:string
    role:"USER"|"ADMIN"|"DRIVER"
}

export interface archive {
    idVehicle:string,
    document:string,
    documentType:string,
    expiredIn:string,
    description?:string
}