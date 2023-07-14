const { registermodel } = require("../Model/register");
const express = require("express");
const app = express()
const { auth } = require("../Middlewares/authenticate")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const registerrouter = express.Router();

// *****************NEW REGISTERED USER****************

registerrouter.post("/api/user", async (req, res) => {
    const payload = req.body;
    // console.log(payload)
    let email = payload.email;
    let check = await registermodel.find({ email });
    if (check.length > 0) {
        res.send({ "msg": "User Exist" });
    } else {
        try {
            bcrypt.hash(payload.password, 2, async (err, hash) => {
                try {
                    if (hash) {
                        payload.password = hash;
                        const data = await new registermodel(payload);
                        await data.save()
                        res.send({ "msg": "NEW REGISTRATION SUCCESSFUL" });
                    } else {
                        res.send({ "msg": "ERROR WHILE HASHING" })
                    }
                } catch (err) {
                    // console.log("ERROR IN REGISTER", err)
                    res.send({ "msg": "ERROR WHILE REGISTER" })
                }
            });

        } catch (err) {
            console.log("ERROR", err)
            res.send({"error":err})
        }
    }

});

// *****************LOGIN REGISTERED USER****************

registerrouter.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const data = await registermodel.find({ email });
        if (data.length > 0) {
            bcrypt.compare(password, data[0].password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ email: data[0].email }, process.env.key);
                    res.status(200).send({
                        "msg": "LOGGIN SUCCESSFUL",
                        "token": token
                    });
                } else {
                    res.status(404).send({ "msg": "Invalid password" })
                }
            });
        } else {
            res.status(404).send({ "msg": "email not Found" })
        }

    } catch (err) {
        console.log("ERROR", err)
        res.send({"error":err})
    }
})


// ****************USER UPDATE BY ID********
registerrouter.put("/api/user/:userID", auth, async (req, res) => {
    var userID = req.params.userID;
    let payload = req.body;
    try {
        var data = await registermodel.findByIdAndUpdate({ _id: userID }, payload);;
        await res.status(200).send(data)
    } catch (err) {
        res.send({"msg":"Invalid ID"})
    }


});

// ************DELETE USER by ID**********

registerrouter.delete("/api/user/:userID", auth, async (req, res) => {
    var userID = req.params.userID;
    try {
        var data = await registermodel.findByIdAndDelete({ _id: userID });;
        await res.status(200).send(data)
    } catch (err) {
        res.send({"msg":"Invalid ID"})
    }



});

// ******ALL USER****

registerrouter.get("/api/user", async (req, res) => {
    let check = await registermodel.find();
    try {

        res.status(200).send(check)
    } catch (err) {
        res.send("Something Went Wrong")
    }

});

// ******USER by its ID****

registerrouter.post("/api/user/:id", auth, async (req, res) => {
    const id = req.params.id;
    try {
        let check = await registermodel.find({ _id: id });
        await res.status(200).send(check)
    } catch (err) {
        res.send("Invalid ID")
    }
});

registerrouter.get("/api/pages", async (req, res) => {
    let data=await registermodel.find()
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || data.length;
    const skip = (page - 1) * limit;
    try {
        let check = await registermodel.find().skip(skip).limit(limit)
        await res.status(200).send(check)
    } catch (err) {
        res.send("Invalid ID")
    }
});
registerrouter.get("/api/startend", async (req, res) => {
    const start = parseInt(req.query.start) || 1;
    const end = parseInt(req.query.end) || 5;
    const limit = parseInt((start-1)-end) || 5;
    const skip = (start-1);
    try {
        let check = await registermodel.find().skip(skip).limit(limit)
        await res.status(200).send(check)
    } catch (err) {
        res.send("Invalid ID")
    }
});

module.exports = { registerrouter }