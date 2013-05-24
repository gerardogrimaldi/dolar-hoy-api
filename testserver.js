var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || // conexion a mongolabs 'mongodb://dolarhoy:Hola123!@ds051447.mongolab.com:51447/dolarhoydb';
'mongodb://dolarhoy:Traserito#321!@widmore.mongohq.com:10010/dolarhoydb';
var mongoose = require ("mongoose"); 
var express = require('express');
var valoresDolarHoySchema = new mongoose.Schema({
    dolarCompra : String,
    dolarVenta : String,
    dolarBlueCompra : String,
    dolarBlueVenta : String,
    dolarTarjeta : String,
    euroCompra : String,
    euroVenta : String,
    date : Date
});
var Valores = mongoose.model('ValoresDolarHoy', valoresDolarHoySchema);

var app = express();
app.use(express.logger());

app.get('/Dolar/:pass', function(req, res) {
    if(req.params.pass == 'Hola123!'){
        try{
            mongoose.connect(uristring, function (err, res) {
                if (err) { console.log ('ERROR connecting to: ' + uristring + '. ' + err); } 
                else { console.log ('Succeeded connected to: ' + uristring); }
            });
            return Valores.findOne({}, {}, { sort: { 'date' : -1 } }, function(err, doc) {
                if (!err) {
                  console.log( doc );
                  return res.send(doc.toString());
                } else {
                  return console.log(err);
                }
            });
        }
        catch(err) { console.log (err); }
        //finally { mongoose.connection.close();}
    }
    return res.send('Error: Wrong password...');
});

app.listen(process.env.PORT);

console.log('Server HTTP Listening on port ' + process.env.PORT + '...');