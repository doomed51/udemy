var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book.model');
var port = 8080;
var db = 'mongodb://localhost/example';
var root = 'c:/workbench/udemy';

mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extends: true
}));
console.log('loading up routing at time: ' + Date.now());

//routing to root pge
//displays text
app.get('/',function(req,res){
    res.send('we out here son');
});


//routing to /books page
//find all books and post them to the website as well as console
app.get('/books', function(req,res){
    console.log('getting all books...!');
    Book.find({})
     .exec(function(err,books_result){
         if (err){
             res.send('error occured!!!');
         } else {
             console.log(books_result);
                res.json(books_result);
         }
     });
});


//routing to sandbox page
app.get('/sandbox',function(req,res){
    console.log('testing sandbox...');
    //res.send('sandbox loaded!');
    //res.send('<tr> <td> test </td> </tr> <tr> test2 </tr>');
    res.sendFile(root + '/main.html');
});

//routing to /books page with id param
// finds one book and returns json
app.get('/books/:_id', function(req,res){
    console.log('getting one book..!');
    Book.findOne({
        _id: req.params._id
    })
    .exec(function(err,book){
    if(err){   
        res.send('error occured');
    } else {
        console.log(book);
        res.json(book);
    }
    });
});


//routing POST to /books page with 3 args
// must use HTTP emulator to POST with the required  args  
app.post('/books',function(req,res){
    var newBook = new Book();
    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;

    newBook.save(function(err,book){
        if(err){
            res.send('something\'s fucked! error saving the book!!!');
        } else {
            console.log(book);
            res.send(book);
        }
    });
});


console.log('loading up findoneandupdate at time: ' + Date.now())

app.put('/books/:_id',function(req,res){
    Book.findOneAndUpdate(
        {
            _id:req.params._id
        },
        {
            $set:
            { title: req.body.title }},
            {upsert: true},
            function(err,newBook){
                if(err){
                    console.log('error occured finding and updating');
                    console.log(err);
                } else {
                    console.log(newBook);
                    res.status(204);
                }
        }) 
});

app.delete('/books/:_id', function(req,res){
    Book.findOneAndRemove({
        _id:req.params._id
    }, function(err, book){
        if(err){
            res.send('error deleting');
        } else {
            console.log(book);
            res.status(204);
        }
    });
});

app.listen(port, function(){
    //console.clear();
    console.log('app online and listening on port ' + port);
});
