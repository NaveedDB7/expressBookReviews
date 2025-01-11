const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
 const username=req.body.username;
    const password=req.body.password;

    if(username&&password){

        if(!isValid(username)){

            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered.You can Login Now"});
        }
        else{
            return res.status(404).json({message:"User already exists"});
        }
    }

    return res.status(404).json({message:"Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        if (Object.keys(book.reviews).length > 0) {
            res.status(200).json({ reviews: book.reviews });
        } else {
            res.status(200).json({ message: "No reviews available for this book." });
        }
    } else {
        res.status(404).json({ message: "Book not found." });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    
    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: `No books found by author ${author}.` });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({ message: `No books found with the title ${title}.` });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn;
    const book=books[isbn];

    if(book){

        if(Object.keys(book.reviews).length>0){
            res.status(200({reviews:book.reviews}));
        }
        else{
            res.status(404).json({message: "Book not found."});
        }
    }
});

module.exports.general = public_users;
