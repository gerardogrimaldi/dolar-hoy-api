var uriString = 'mongodb://heroku_hp49qmbd:2uac8h9g06op5db8a1d3i26kr0@ds049084.mongolab.com:49084/heroku_hp49qmbd';
var mongoose = require ("mongoose");
var express = require('express');
var mail = require("./nodemail");
var valoresSchema = require("./Model/mongoSchema").valoresDolarHoySchema;
var Valores = mongoose.model('ValoresDolarHoy', valoresSchema);

var app = express();
app.use(express.logger());

// CORS
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/dolar/:pass', function(req, res) {
  if (req.params.pass !== 'Hola123!') {
    return res.send('Error: Wrong password...');
  }

  try {
    if(!mongoose.connection.readyState) {
      mongoose.connect(uriString, function (err, response) {
        if (err) {
          onError('ERROR connecting to: ' + uriString + '. ' + err);
        } else {
          console.log ('Succeeded connected to: ' + uriString);
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
        }
      });
    }
  } catch (err) {
    onError(err);
  }
});

app.listen(process.env.PORT || 3000);

function onError(err) {
  mail.mailOptions.subject = 'DolarHoyServer Info: Error';
  mail.mailOptions.html = 'ERROR connecting to: ' + uristring + '. ' + err;
  mail.sendMail();
  console.log(err);
}

console.log('Server HTTP Listening on port ' + process.env.PORT + '...');
