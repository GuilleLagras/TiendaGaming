import swaggerJSDoc from "swagger-jsdoc";
import  __dirname  from './utils.js'

const swaggerOptions = {
    definition:{
        openapi: '3.0.0',
        info:{
            title:'Desafio Coder API',
            version: '1.0.0',
            description:'API documentation for coderhouse proyect'
        },
    },
    apis:[`${__dirname}/docs/*.yaml`]
    
}
export const swaggerSetup = swaggerJSDoc(swaggerOptions)