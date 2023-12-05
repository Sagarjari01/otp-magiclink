const express = require('express')
const { UserDetail } = require('otpless-node-js-auth-sdk')
require("dotenv/config");
const app = express()
const path = require("path");
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET 

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});


app.post('/', async (req, res) => {
    const { number, email } = req.body
    const originalUrl = req.headers.referer
    const magicLinkTokens = await UserDetail.magicLink(
        number,
        email,
        `${originalUrl}dashboard`,
        "",
        client_id,
        client_secret,
        ""
    );
    if(magicLinkTokens){
        
        res.send('Link has been send to whatsapp')
    }
    // console.log("MagicLink Tokens Details:", magicLinkTokens);
})

app.get('/dashboard', async (req, res) => {
    const code = req.query.code
    let flag = false;
    if(code){
        const userDetail = await UserDetail.verifyCode(code, client_id, client_secret);
        console.log("User Details:", userDetail);
        // res.json({msg:userDetail})
        flag = userDetail.success
    }
    const data = {
        flag
    }
    res.render('dashboard',data)
})

app.listen(5000, () => {
    console.log("Server started on http://localhost:5000");
})

// app.get('/',async (req,res)=>{
//     res.send("hello")
//     const {code} = req.params
//     console.log(code)
//     if(!code){
//         const magicLinkTokens = await UserDetail.magicLink(
//             "916352996900",
//             "sagarjari9495@gmail.com",
//             "http://localhost:5000/",
//             "",
//             "kp79hlri",
//             "4djabbfg2bl5oxqx",
//             ""
//             );
//         console.log("MagicLink Tokens Details:", magicLinkTokens);
//     }else{
//         const userDetail = await UserDetail.verifyCode(code, "kp79hlri", "4djabbfg2bl5oxqx");
//         console.log("User Details:", userDetail);
//         res.json({"msg":userDetail})
//     }

// })