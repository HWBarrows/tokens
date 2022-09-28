import express from "express";
import jwt from 'jsonwebtoken'

const app = express()
const secret = "I'm a little teapot"


//Computer object properties are needed if the key value has a - in the string
function checkToken(req, res, next) {
    const tokenRaw = req.headers["authorization"]
    if(!tokenRaw){
        return res.sendStatus(401)
    }
    //console.log(tokenRaw)
    const token = tokenRaw.split(" ")[1]

    if (!token){
        res.status(401).send()
        return
    }
    jwt.verify(token, secret, (err, payload)=> {
        // console.log(err)
         console.log(payload);
        if(err) {
            res.status(401).send("What is that?!")
            return
        }
        //req.userId = payload.userId
        next()
    })
}

app.get("/token", (req, res)=> {
    const payload = {
        userId: Math.round(Math.random()*999999),
        name: "I am now in the payload"
    }
    const options = {
        expiresIn: "30m"
    }
    const token = jwt.sign(payload, secret, options)
    res.send(token)
})

function checkAdmin(req, res, next) {
    if(req.userId > 500000) {
        return next()
    }
    res.status(403).send("only admins")
}

app.get("/secret", checkToken, checkAdmin, (req, res)=> {

    res.send("Access granted, good job " + req.userId)
})


app.listen(9000, ()=> console.log("Rocking out on http://localhost:9000"))