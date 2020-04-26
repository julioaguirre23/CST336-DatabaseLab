/* Require external APIs and start our application instance */
var express = require('express');
var mysql = require('mysql');
var app = express();

/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* Configure MySQL DBMS */
const connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'julio',
    // password: 'julio',
    // database: 'quotes_db'
    host:'us-cdbr-iron-east-01.cleardb.net',
    user:'b9b4fed8b49bc8',
    password:'e1092dd9',
    database:'heroku_d0d14298e1c6533'
});
connection.connect();

/* The handler for the DEFAULT route */
app.get('/', function(req, res){
    res.render('home');
});

/* The handler for the /author route */
app.get('/author', function(req, res){
    var stmt = 'select * from l9_author where firstName=\'' 
                + req.query.firstname + '\' and lastName=\'' 
                + req.query.lastname + '\';'
	connection.query(stmt, function(error, found){
	    var author = null;
	    if(error) throw error;
	    if(found.length){
	        author = found[0];
	        // Convert the Date type into the String type
	        author.dob = author.dob.toString().split(' ').slice(0,4).join(' ');
	        author.dod = author.dod.toString().split(' ').slice(0,4).join(' ');
	    }
	    res.redirect('/author/' + found[0].authorId);
	});
});

/* The handler for the /author/name/id route */
app.get('/author/:aid', function(req, res){
    var stmt = 'select *,quote ' +
               'from l9_quotes, l9_author ' +
               'where l9_quotes.authorId=l9_author.authorId ' + 
               'and l9_quotes.authorId=' + req.params.aid + ';';
    connection.query(stmt, function(error, results){
        if(error) throw error;
        // var name = results[0].firstName + ' ' + results[0].lastName;
        res.render('quotes', {name: results[0], quotes: results});      
    });
});
app.get("/c",function(req, res) {
    res.render("category");
});

app.get("/categorySearch",function(req, res) {
    var topic = req.query.topic;
    console.log(req.query);
    res.redirect("category/" + topic);
});

app.get("/category/:topic",function(req, res) {
   var stmt = 'select * ' +
             'from l9_quotes, l9_author where l9_quotes.category ="'+ req.params.topic + '" and l9_quotes.authorId = l9_author.authorId;';
    console.log(stmt);
    connection.query(stmt,function(error, results) {
       if(error)throw error;
       res.render("categoryResults", {m : results});
    });
});

app.get("/k",function(req, res) {
    res.render("keyword");
});

app.get("/keywordSearch", function(req, res) {
    var keyword = req.query.keyword;
    res.redirect("keyword/"+keyword);
});

app.get("/keyword/:keyword", function(req, res) {
    //stmt += ' l9_quotes.quote like \‘’ + “%” + param  + “%”
    var stmt = "select * from l9_quotes, l9_author where l9_quotes.quote like \'" + "%" + req.params.keyword + "%\' and l9_quotes.authorId = l9_author.authorId;";
    connection.query(stmt, function(error, results) {
        if(error)throw error;
        res.render("keywordResult", {key: results});
    });
});

app.get("/g",function(req, res) {
   res.render("gender"); 
});

app.get("/genderSearch",function(req, res) {
   var gender = req.query.gender;
   res.redirect("gender/"+gender);
});

app.get("/gender/:gender", function(req, res) {
   var stmt = 'select * from l9_quotes, l9_author where l9_author.sex = "' + req.params.gender + '" and l9_quotes.authorId = l9_author.authorId;';
   connection.query(stmt, function(error, results) {
      if(error)throw error;
      res.render("genderResults", {input : results});
   });
});

app.get("/authorName", function(req, res) {
   res.render('authorName'); 
});
/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error'); 
});

/* Start the application server */
app.listen(process.env.PORT || 3000, function(){
    console.log('Server has been started');
})