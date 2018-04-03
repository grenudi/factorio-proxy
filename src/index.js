const Express = require("express");
const app = Express();

app.get("/peeling",(req,res)=>{
    console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    res.end();
})

app.listen(process.env.PORT);