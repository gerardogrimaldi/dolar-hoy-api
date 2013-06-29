var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://dolarhoy:Traserito#321!@ds051447.mongolab.com:51447/dolarhoydb'
//'mongodb://dolarhoy:Traserito#321!@widmore.mongohq.com:10010/dolarhoydb';
var mongoose = require ("mongoose"); 
var express = require('express');
var mail = require("./nodemail");
var valoresSchema = require("./Model/mongoSchema").valoresDolarHoySchema;
var Valores = mongoose.model('ValoresDolarHoy', valoresSchema);

var app = express();
app.use(express.logger());

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
        .select('dolarCompra dolarVenta dolarBlueCompra dolarBlueVenta dolarTarjeta euroCompra euroVenta date')
        .sort('-date')
        .exec(
        function (err, doc) {
            if (err) return onError(err);
            return res.send(JSON.stringify(doc));
        });
        
    }
    catch(err) { onError(err); }
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