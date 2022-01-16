const chalk=require("chalk");
const res = require("express/lib/response");
const fs=require("fs");
const validate= require("./validate");
const readFromJSON = () =>{
    let data
    try{
        data = JSON.parse(fs.readFileSync('./models/data.json'))
        if(!Array.isArray(data)) throw new Error()
    }
    catch(e){
        data = []
    }
    return data
}
const writeDataToJSON = (data) =>{
    try{
        fs.writeFileSync("./models/data.json", JSON.stringify(data))
    }
    catch(e){
        console.log(chalk.red(e.message))
    }
}
const searchById=(id)=>{
    let data=readFromJSON();
    let index;
    data.forEach((el,i)=>{
        if(el.id==id){data= data[i];index=i}
    })
    return {data,index}
}
const transactions=(sign,data,element,req,res)=>{
    let newData=parseInt(data[element.index].initialbalance);
    let number=parseInt(req.body.money)
    if(data[element.index].transactions){
        if(sign=="-"){newData -= number;data[element.index].initialbalance=newData}
        else{newData += number;data[element.index].initialbalance=newData}
        data[element.index].transactions.push(`${sign}${req.body.money}`);
        writeDataToJSON(data);
        res.redirect("/");
    }
    else{
        data[element.index].transactions=[`${sign}${req.body.money}`];
        if(sign=="-"){newData -= number;data[element.index].initialbalance=newData}
        else{newData += number;data[element.index].initialbalance=newData}
        writeDataToJSON(data);
        res.redirect("/");
    }
}
const validateData=(incomingData)=>{
    let errors={};
    if(!validate.isEmptyString(incomingData.name))errors.name="enter valid name"
    if(!validate.isValidEmail(incomingData.email))errors.email="not valid email"
    if(!validate.validInitialBalance(incomingData.initialbalance))errors.initialbalance="add money starting form 1000EG"
    if(!validate.validAge(incomingData.age))errors.age="not valid age"
    if(!validate.validmobile(incomingData.mobile))errors.mobile="not a mobile number"
    if(!validate.isEmptyString(incomingData.address))errors.address="enter address"
    return errors
}

class control{
    static showAll=(req,res)=>{
        let allData={pageTitle:"allUsers"};
        allData.data=readFromJSON();
        res.render("home",allData);
    }
    static showSingle=(req,res)=>{
        let id=req.params.id;
        let changed=searchById(id)
        if(!(changed.index>=0))return res.redirect("/err")
        res.render("single",{data:changed.data ,pageTitle:"userData"})
    }
    static edit=(req,res)=>{
        let id=req.params.id;
        let data=searchById(id);
        if(!(data.index>=0))return res.redirect("/err")
        res.render("edit",{
            pageTitle:"edit user",
            user:data.data
        })
    }
    static editLogic=(req,res)=>{
        let incomingData=req.body;
        let errors=validateData(incomingData);
        if(Object.keys(errors).length>0) 
        return res.render('edit', {
            pageTitle:"edit user",
            errors,
            user:incomingData
        })
        let id=req.params.id;
        let changed=searchById(id);
        let data=readFromJSON();
        let keys=Object.keys(data[changed.index]);
        console.log(keys);
        keys.forEach((key)=>{
            if(key!=="id"&&key!="transactions"){data[changed.index][key]=req.body[key];}
        })
        
        writeDataToJSON(data);
        res.render("home",{
            pageTitle:"allUsers",
            data:data
        })
        
        res.redirect("/");
    }
    static addUser=(req,res)=>{
        res.render("newUser")
    }
    static addUserLogic=(req,res)=>{
        let incomingData=req.body;
        let errors=validateData(incomingData);
        let id;
        if(Object.keys(errors).length>0) 
        return res.render('newUser', {
            pageTitle:"newUser",
            errors,
            data:incomingData
        })
        let data=readFromJSON();
        if(data.length=="0"){id=1}
        else{id=data[data.length-1].id+1;}
        let newData={id,...req.body};
        data.push(newData);
        writeDataToJSON(data);
        res.redirect("/");
    }
    static delete=(req,res)=>{
        let data=readFromJSON();
        let changed=searchById(req.params.id)
        console.log(changed);
        if(!(changed.index>=0))return res.redirect("/err")
        data.splice(changed.index,1);
        writeDataToJSON(data);
        res.redirect("/")
    }
    static addwithdraw=(req,res)=>{
        let id=req.params.id;
        let changed=searchById(id)
        console.log(changed)
        if(!(changed.index>=0)){res.redirect("/err")} 
        else{res.render("addwithdraw",{id})}
    }
    static Withdraw=(req,res)=>{
        let id=req.params.id;
        let data=readFromJSON();
        let element=searchById(id);
        transactions("-",data,element,req,res);
    }
    static addMoney=(req,res)=>{
        let id=req.params.id;
        let data=readFromJSON();
        let element=searchById(id);
        transactions("+",data,element,req,res);
    }

}

module.exports = control