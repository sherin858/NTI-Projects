const validator=require("validator");
class validate{
    static isEmptyString=(name)=>{
        return name.length
    }
    static isValidEmail=(email)=>{
        return validator.isEmail(email)
    }
    static validInitialBalance=(initialbalance)=>{
        return((!isNaN(initialbalance))&&initialbalance>=1000)
    }
    static validAge=(age)=>{
        return parseInt(age)>=18
    }
    static validmobile=(mobile)=>{
        return validator.isMobilePhone(mobile);
    }
}
module.exports = validate