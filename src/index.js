const Express = require("express");
const app = Express();

const config = {
    heroku: {
        domain: "ddns-factorio.herokuapp.com"
    },
    c9: {
        domain: "factorio-proxy-grenudi.c9users.io"
    }
};
const env = config.heroku;

const domain = env.domain;
const port = 8080;
let IP;

//Looper path if no IP to redirect to , a client will wait untill it will appear
app.get("",(req,res)=>{
    if(!IP){
        console.log("No IP to redirect to. Client is WAITING...");
        setTimeout(()=>{
            res.set("Location",`http://${IP || domain}:${port}`);
            res.status(303);
            res.end();
            console.log("Redirected to try again to:",`http://${IP || domain}:${port}`);
        },3000);
    }else{
        res.set("Location",`http://${IP}:${port}`);
        res.status(303);
        res.end();
        console.log("Success redirect to:",`http://${IP}:${port}`);
    }
});


app.get("/peeling",(req,res)=>{
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        res.send(`Your IP: ${ip}`);
        res.end();
    });
    
app.post("/peeling",(req,res)=>{
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log("peeling recieved from:",ip);
        
        res.send(`Your IP: ${ip}`);
        res.end();
        
        if(req.query.secret === "radikloh" && ip !== IP){
            console.log("IP adress changed from:",IP," to:",ip);
            IP = ip;
        };
    });


app.listen(process.env.PORT, (err)=>{
    if(!err){
        console.log("We are rolling on:", domain);
    }
});

//https://factorio-proxy-grenudi.c9users.io