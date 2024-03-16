export default class customError{
    static generateError (message ,code,name){
        const error = new Error(message)
        error.code = code 
        error.name = name
        return error; 
    }
}