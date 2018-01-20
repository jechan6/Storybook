var express = require("express"),
    app = express();
    
app.get("/", function(req,res) {
    res.send("HELLO WORLD");
})

app.listen(process.env.PORT,process.env.IP, function() {
    console.log("Server has started");
})