const { redirect } = require('express/lib/response')
const dbConnection = require('../../models/dbcon')
const ValiadtorController = require("./validator.controller")
const{ObjectId}=require("mongodb");
const { response } = require('express');
const e = require('express');
const validateData=(incomingData)=>{
    let errors={};
    if(!ValiadtorController.isEmptyString(incomingData.name))errors.name="enter valid name"
    if(!ValiadtorController.isValidEmail(incomingData.email))errors.email="not valid email"
    if(!ValiadtorController.validInitialBalance(incomingData.initialbalance))errors.initialbalance="add money starting form 1000EG"
    if(!ValiadtorController.validAge(incomingData.age))errors.age="not valid age"
    return errors
}
const transactions=(sign,req)=>{
    let total;
    dbConnection((err, client, db) => {
        db.collection('data').findOne(
            { _id:new ObjectId(req.params.id) },
            (error, result)=>{
                //changing initial balance
                if(sign=="+"){total= +result.initialbalance + parseInt(req.body.money)}
                else{total= +result.initialbalance - parseInt(req.body.money)}
                let transactions=result.transactions;
                //changing trasactions
                if(!result.transactions){transactions=[];transactions.push(`${sign}${req.body.money}`)}
                else{transactions.push(`${sign}${req.body.money}`)}
                //witing them to db
                db.collection('data').updateOne(
                    {_id:new ObjectId(req.params.id)},
                    {
                        $set:{
                            initialbalance:total,
                            transactions:transactions
                        }
                    }
                )
            }
        )
    })
}

class User {
    static showAll = (req, res) => {
        dbConnection((err, client, db) => {
            db.collection('data').find().toArray((error, result) => {
                if (error) return redirect('/err')
                const data = result
                const isEmpty = data.length == 0
                client.close()
                res.render("all", { pageTitle: "All Users", data, isEmpty })
            })
        })
    }
    
    //post method
    static addUserPost = (req, res) => {
        res.render("addPost", { pageTitle: "add new user" })
    }
    static addUserLogic = (req, res) => {
        let user = req.body
        let errors=validateData(user);
        if (Object.keys(errors).length > 0)
            return res.render('addPost', {
                pageTitle: "add new user",
                errors,
                user
            })
        dbConnection((err, client, db) => {
            db.collection('data').insertOne(user,(error, result)=>{
            if(err) return res.redirect("/err")
            client.close()
            res.redirect("/")
        })
    })
    }
    static singleUser = (req, res) => {
        dbConnection((err,client,db)=>{
            db.collection('data').findOne(
                { _id:new ObjectId(req.params.id) },
                (error, result)=>{
                    if(!result){
                        res.render("single", {
                        pageTitle: "User Details",
                        user: result,
                        isNotFound :true
                        })
                        client.close()
                    }
                    else{
                    res.render("single", {
                    pageTitle: "User Details",
                    user: result,
                    isNotFound : false
                    })
                    client.close()
                    }
                }
            )
            
        })
    }

    static editUser = (req, res) => {
        dbConnection((err,client,db)=>{
            db.collection('data').findOne(
        { _id:new ObjectId(req.params.id) },
        (error, result)=>{
            if(!result) { 
                res.render("edit", {
                    pageTitle: "User Details",
                    isNotFound : true
                })
            }
            else{
                res.render("edit",{
                pageTitle: "User Details",
                user: result,
                isNotFound : false
            })
            client.close()
        }
        }
        )}
        )}
    static editUserLogic=(req,res)=>{
        let user = req.body
        let errors=validateData(user);
        if (Object.keys(errors).length > 0)
        return res.render('edit', {
            pageTitle: "add new user",
            errors,
            user
        })
        dbConnection((err,client,db)=>{
            db.collection('data').updateOne(
                {_id:new ObjectId(req.params.id)},
                {
                    $set:{
                        name:req.body.name,
                        age:req.body.age,
                        email:req.body.email,
                        initialbalance:req.body.initialbalance,
                        address:req.body.address
                    },
                }
            )
            .then(result=>{
                client.close()
                res.redirect("/")
            })
        })
    }

    static deleteUser = (req, res) => {
        dbConnection((err,client,db)=>{
        db.collection('data').deleteOne({ _id:new ObjectId(req.params.id) } )
    .then(response=> {
        console.log(response);
        res.redirect("/");
        client.close();
        
    })
    .catch(error=> {
        console.log(error)
        client.close()
    })
        })
    }
    static addwithdraw=(req,res)=>{
        let id=req.params.id;
        res.render("addwithdraw",{id})
    }
    static addMoney=(req,res)=>{
        transactions("+",req)
        res.redirect("/")
    }
    static Withdraw=(req,res)=>{
        transactions("-",req)
        res.redirect("/")
    }

}
module.exports = User