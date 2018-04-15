var express = require('express');
var hbs = require('hbs');
var fs = require('fs');

var app = express();


// To avoid the repeated html section in views.
hbs.registerPartials(__dirname + '/views/partials');

// Telling express that we are using hbs has our view engine. ( no need of specifying .hbs extension on res.render)
app.set('view engine', 'hbs');

// Note: Order of middleware matters.

// User defined middleware 
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now} ${req.method} ${req.url} \n`;
	fs.appendFile('server.log', log, (err) => {
		if(err){
			console.log('unable to write to log');
		}
	})
	console.log(log);
	next();
});


// // Maintenance middleware
// app.use((req, res, next) => {
// 	res.render('maintenance');
// });

// To render all static content of our app. ( Ex: Just calling localhost:3000/help.html renders our help.html in public folder)
app.use(express.static(__dirname + '/public'));

// To avoid repeated code snippet by writing a function and registering it as helper which partials look 
// for first before looking for passed variable with that name.
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

// Helper which takes parameter
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get('/', (req, res) => {
	// To send just a small text or html as response use send. ( content-type set to text/html automatically) 
	// res.send('<h1> Hello world fuckers! </h1>');
	res.render('home.hbs', {title: 'Home Page', welcomeMessage: 'Welcome Nigga!!'});
});

app.get('/dummy', (req, res) => {
	// No need to specify .hbs extension since we have told express that our view-engine is hbs
	res.render('dummy' , {title: 'Dummy Page', welcomeMessage: 'Dummy dummy dummy!'});
});

app.get('/bad', (req, res) => {
	// content-type is automatically set to application/json if object is passed to res.send.
	res.send({
		err: 'unable to handle request'
	})
});

// Listening to server at port 3000.
app.listen('3000', () => {
	console.log('Server has started!!')
});

