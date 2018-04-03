const Express = require("express");
const app = Express();
const domain = "factorio-proxy-grenudi.c9users.io";
let IP;

app.get("",(req,res)=>{
    if(!IP){
        console.log("No IP to redirect to. WAITING...");
        setTimeout(()=>{
            res.set("Location",`http://${IP || domain}`);
            res.status(303);
            res.end();
            console.log("Redirected to try again");
        },3000);
    }
});

app.get("/peeling",(req,res)=>{
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);
    
    res.send(`Your IP: ${ip}`);
    res.end();
    
    if(req.query.secret === "radikloh"){
        console.log("IP adress changed from:",IP," to:",ip);
        IP = ip;
    }
})

app.listen(process.env.PORT, (err)=>{
    if(!err){
        console.log("We are rolling on:", domain);
    }
});

//https://factorio-proxy-grenudi.c9users.io