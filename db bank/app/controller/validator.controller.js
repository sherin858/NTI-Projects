const validator = require("validator")
class ValiadtorController{
    static isEmptyString = (val)=>{
        return val.length //0=false >0 =true
    }
    static isValidEmail = (val) => {
        return validator.isEmail(val)  //true false
    }
    static validInitialBalance=(initialbalance)=>{
        return((!isNaN(initialbalance))&&initialbalance>=1000)
    }
    static validAge=(age)=>{
        return parseInt(age)>=18
    }
}
module.exports = ValiadtorController