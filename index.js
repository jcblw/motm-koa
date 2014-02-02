var koa = require('koa'),
	fs = require('fs'),
	port = process.env.PORT || 3000,
	app = koa();

// basic loging showing flow of koa
app.use(function *( next ){
	var ms = new Date;
	yield next;
	ms = (new Date) - ms;
	console.log( this.method, this.url,  ms);
	this.set('X-Server-Time', ms );
});
// returning a string
app.use( function *( next ) {
	if ( this.url === '/' ) {
		this.body = 'hello world';
	}
	yield next;
});

// returning a object
app.use( function *( next ) {
	if ( this.url === '/json' ) {
		this.body = {
			hello : 'world'
		};
	}
	yield next;
});

// thunks using koa or co
function readFile ( filename ) {
	return function ( cb ) {
		fs.readFile( filename, cb );
	}
}

// returning a file
app.use( function *( next ) {
	var file;
	if( this.url === '/html' ) {
		file = yield readFile( __dirname + '/index.html' );
		if ( file ) {
			return this.body = file.toString('utf8');
		}
		this.body = 'could not get file';
	}
	yield next;
});

app.listen( port );
console.log(
	'Server listening on port ', port, 'with pid', process.pid)

