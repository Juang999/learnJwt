require('dotenv').config()

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const users = [
    {
        name: "Bangkit Juang Raharjo",
        password: "string1"
    },{
        name: "Ismail Nuralam",
        password: "string2"
    }
]

router.route('/user')
    .get(authenticateToken, (req, res) => {
        console.log(req.user)
        res.json({
            result: users.filter(user => user.name === req.user.name)
        })
    })
    .post((req, res) => {
        const user = {name: req.body.username}
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.json({
            token: accessToken 
        })
    })

function authenticateToken(req, res, next) {
    const authenticator = req.headers['authorization']
    const token = authenticator && authenticator.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403) 
        req.user = user
        next()
    })
}

module.exports = router