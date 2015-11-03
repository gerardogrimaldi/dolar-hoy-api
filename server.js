var uriString = process.env.MONGOLAB_URI;
var mongoose = require('mongoose');
var express = require('express');
var mail = require('./nodemail');
var valoresSchema = require('./Model/mongoSchema').valoresDolarHoySchema;
var Valores = mongoose.model('ValoresDolarHoy', valoresSchema);

mongoose.connect(uriString, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uriString + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uriString);
  }
});

var app = express();
app.use(express.logger());
// CORS
app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/dolar/:pass', function(req, res) {
  if (req.params.pass !== 'Hola123!') {
    return res.send('Error: Wrong password...');
  }
  Valores.findOne()
    .select('dolarCompra dolarVenta dolarBlueCompra dolarBlueVenta dolarTarjeta realCompra realVenta euroCompra euroVenta date')
    .sort('-date')
    .exec(
      function (err, doc) {
        console.log(doc);
        if (err) {
          return onError(err);
        }
        return res.send(JSON.stringify(doc));
      });
});

app.listen(process.env.PORT || 3000);

function onError(err) {
  mail.mailOptions.subject = 'DolarHoyServer Info: Error';
  mail.mailOptions.html = 'ERROR connecting to: ' + uristring + '. ' + err;
  mail.sendMail();
  console.log(err);
}

console.log('Server HTTP Listening on port ' + process.env.PORT + '...');
