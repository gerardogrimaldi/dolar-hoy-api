var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL
|| 'mongodb://dolarhoy:Traserito#321!@ds051447.mongolab.com:51447/dolarhoydb'
//'mongodb://dolarhoy:Traserito#321!@widmore.mongohq.com:10010/dolarhoydb';
var mongoose = require ("mongoose");
var express = require('express');
var mail = require("./nodemail");
var valoresSchema = require("./Model/mongoSchema").valoresDolarHoySchema;
var Valores = mongoose.model('ValoresDolarHoy', valoresSchema);

var app = express();
app.use(express.logger());

// CORS header securiy
app.all('/*', function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.header("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/Dolar/:pass', function(req, res) {
    if (req.params.pass != 'Hola123!') return res.send('Error: Wrong password...');
    try {
        if(!mongoose.connection.readyState){
            mongoose.connect(uristring, function (err, res) {
                if (err) {
                     onError('ERROR connecting to: ' + uristring + '. ' + err);
                } else {
                    console.log ('Succeeded connected to: ' + uristring);
                }
            });
        }

      Valores.findOne()
        .select('dolarCompra dolarVenta dolarBlueCompra dolarBlueVenta dolarTarjeta realCompra realVenta euroCompra euroVenta date')
        .sort('-date')
        .exec(
        function (err, doc) {
            if (err) { return onError(err); }
            return res.send(JSON.stringify(doc));
        });

    }
    catch(err) {
      onError(err);
    }
    //finally { mongoose.disconnect(); }
});

app.listen(process.env.PORT);

function onError(err) {
    mail.mailOptions.subject = 'DolarHoyServer Info: Error';
    mail.mailOptions.html = 'ERROR connecting to: ' + uristring + '. ' + err;
    mail.sendMail();
    console.log(err);
}

console.log('Server HTTP Listening on port ' + process.env.PORT + '...');
