const router = require("express").Router()
const User = require("../controller/app.controller")

router.get("/", User.showAll)

router.get("/addPost", User.addUserPost)
router.post("/addPost", User.addUserLogic)
router.get("/edit/:id", User.editUser)
router.post("/edit/:id",User.editUserLogic)
router.get("/delete/:id", User.deleteUser)
router.get("/single/:id", User.singleUser)
router.get("/addwithdraw/:id",User.addwithdraw)
router.post("/withdrawmoney/:id",User.Withdraw)
router.post("/addmoney/:id",User.addMoney)
module.exports = router
