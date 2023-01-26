import mongoose from "mongoose";

export const mongoosedb  = (url: string) => {
    mongoose.set('strictQuery', false)
    mongoose.connect( url, (err) => {
        if (err) throw err;
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
    })
}