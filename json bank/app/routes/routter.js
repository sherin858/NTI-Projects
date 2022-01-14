const router=require("express").Router();
const app=require("../../src/app");
const control=require("../controller/controller.js")
//
router.get("/",control.showAll);
router.get("/show/:id",control.showSingle);
router.get("/edit/:id",control.edit)
router.post("/edit/:id",control.editLogic)
router.get("/add",control.addUser)
router.post("/add",control.addUserLogic)
router.get("/delete/:id",control.delete)
router.get("/addwithdraw/:id",control.addwithdraw)
router.post("/withdrawmoney/:id",control.Withdraw)
router.post("/addmoney/:id",control.addMoney)
module.exports = router