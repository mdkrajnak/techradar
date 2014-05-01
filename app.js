/*
 * app.js - Express server with advanced routing
*/

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var
  http    = require( 'http'    ),
  express = require( 'express' ),
  fs      = require( 'fs' ),

  app     = express(),
  server  = http.createServer( app );
// ------------- END MODULE SCOPE VARIABLES ---------------

var sendFile = function(fname, response) {
    console.log('Trying to read ' + __dirname + '/public/radars/' + fname);
    
    fs.readFile( __dirname + '/public/radars/' + fname, function (err, data) {
      if (err) {
        throw err; 
      }
      response.send(data);
    });
};

// ------------- BEGIN SERVER CONFIGURATION ---------------
app.configure( function () {
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( express.static( __dirname + '/public' ) );
  app.use( app.router );
});

app.configure( 'development', function () {
  app.use( express.logger() );
  app.use( express.errorHandler({
    dumpExceptions : true,
    showStack      : true
  }) );
});

app.configure( 'production', function () {
  app.use( express.errorHandler() );
});

// all configurations below are for routes
app.get( '/', function ( request, response ) {
  response.redirect( '/radar.html' );
});

app.all( '/radars/*?', function ( request, response, next ) {
  response.contentType( 'json' );
  next();
});

app.get( '/radars/list', function ( request, response ) {
  response.send({ title: 'radar list' });
});

app.post( '/radars/create', function ( request, response ) {
  response.send({ title: 'radar created' });
});

app.get( '/radars/read/:id',
  function ( request, response ) {
    sendFile(request.params.id, response);
  }
);

app.post( '/radars/update/:id)',
  function ( request, response ) {
    response.send({
      title: 'radar with id ' + request.params.id + ' updated'
    });
  }
);

app.get( '/radars/delete/:id([0-9]+)',
  function ( request, response ) {
    response.send({
      title: 'radar with id ' + request.params.id + ' deleted'
    });
  }
);
// -------------- END SERVER CONFIGURATION ----------------

// ----------------- BEGIN START SERVER -------------------
server.listen( 3000 );
console.log(
  'Express server listening on port %d in %s mode',
   server.address().port, app.settings.env
);
// ------------------ END START SERVER --------------------
