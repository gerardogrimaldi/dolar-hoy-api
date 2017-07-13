var uriString = process.env.MONGOLAB_URI;
var mongoose = require('mongoose');
var express = require('express');
var request = require('request');
var mail = require('./nodemail');
var valoresSchema = require('./Model/mongoSchema').valoresDolarHoySchema;
var Valores = mongoose.model('ValoresDolarHoy', valoresSchema);
console.log(uriString);
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

app.get('/dolar-graph/:pass', function(req, res) {
  if (req.params.pass !== 'Hola123!') {
    return res.send('Error: Wrong password...');
  }
  request({
      url: 'http://www.ambito.com/economia/mercados/monedas/x_monedas_get_grafico.asp?ric=ARSSCBCRA&tipo=ww&from=modulo_mercados', json: true
    }, function (error, response, body) {
      if (error && response.statusCode !== 200) {
        onError(body);
        res.status(404).send('Not found');
      } else {
        return res.send(eval(body));
      }
    });
});

app.get('/dolar-blue-graph/:pass', function(req, res) {
  if (req.params.pass !== 'Hola123!') {
    return res.send('Error: Wrong password...');
  }
  request({
    url: 'http://www.ambito.com/economia/mercados/monedas/x_monedas_get_grafico.asp?ric=ARSB=&tipo=ww&from=modulo_mercados', json: true
  }, function (error, response, body) {
    if (error && response.statusCode !== 200) {
      onError(body);
      res.status(404).send('Not found');
    } else {
      return res.send(eval(body));
    }
  });
});

app.get('/dolar-tarjeta-graph/:pass', function(req, res) {
  if (req.params.pass !== 'Hola123!') {
    return res.send('Error: Wrong password...');
  }
  request({
    url: 'http://www.ambito.com/economia/mercados/monedas/x_monedas_get_grafico.asp?ric=ARSSCBCRA=DT&tipo=ww&from=modulo_mercados', json: true
  }, function (error, response, body) {
    if (error && response.statusCode !== 200) {
      onError(body);
      res.status(404).send('Not found');
    } else {
      return res.send(eval(body));
    }
  });
});

app.get('/dolar-ahorro-graph/:pass', function(req, res) {
  if (req.params.pass !== 'Hola123!') {
    return res.send('Error: Wrong password...');
  }
  request({
    url: 'http://www.ambito.com/economia/mercados/monedas/x_monedas_get_grafico.asp?ric=ARSSCBCRA=TE&tipo=ww&from=modulo_mercados', json: true
  }, function (error, response, body) {
    if (error && response.statusCode !== 200) {
      onError(body);
      res.status(404).send('Not found');
    } else {
      return res.send(eval(body));
    }
  });
});
app.listen(process.env.PORT || 3000);

function onError(err) {
  mail.mailOptions.subject = 'DolarHoyApi Info: Error';
  mail.mailOptions.html = 'ERROR connecting to: ' + uriString + '. ' + err;
  mail.sendMail();
  console.log(err);
}

console.log('Server HTTP Listening on port ' + process.env.PORT + '...');
