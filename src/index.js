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

let IP;

//Looper path if no IP to redirect to , a client will wait untill it will appear
app.get("",(req,res)=>{
    if(!IP){
        console.log("No IP to redirect to. Client is WAITING...");
        setTimeout(()=>{ 
            res.set("Location",`http://${domain}/?port=${req.query.port || 8080}`);
            res.status(303);
            res.end();
            console.log("Redirected to try again to:",`http://${domain}/?port=${req.query.port || 8080}`);
        },3000);
    }else{
        const port = req.query.port || 8080;
        res.set("Location",`http://${IP}:${port}`);
        res.status(303);
        res.end();
        console.log("Success redirect to:",`http://${IP}:${port}`);
    }
});

app.get("/peeling",(req,res)=>{
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