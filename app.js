var express = require("express"),
    app = express(),
    path = require("path"),
    SDK = require('./node_modules/microsoft-speech-browser-sdk/distrib/Speech.Browser.Sdk.js');

//app.use(express.static(__diname + "/public"));


app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req,res) {
    res.render("index.ejs", {SDK: SDK});
})
function startSpeech() {
	alert("CLICKED");
}
app.listen(3000, function() {
    console.log("Server has started");
})