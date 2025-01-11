const express = require('express');
const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. You can login now." });
        } else {
            return res.status(404).json({ message: "User already exists." });
        }
    }

    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const bookList = await axios.get("http://localhost:5000/"); // Use the correct endpoint
        res.status(200).json(bookList.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching the book list.", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const bookDetails = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Use the correct endpoint
        res.status(200).json(bookDetails.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found.", error: error.message });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const booksByAuthor = await axios.get(`http://localhost:5000/author/${author}`); // Use the correct endpoint
        res.status(200).json(booksByAuthor.data);
    } catch (error) {
        res.status(404).json({ message: `No books found by author ${author}.`, error: error.message });
    }
});

// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const booksByTitle = await axios.get(`http://localhost:5000/title/${title}`); // Use the correct endpoint
        res.status(200).json(booksByTitle.data);
    } catch (error) {
        res.status(404).json({ message: `No books found with the title ${title}.`, error: error.message });
    }
});

// Get book reviews
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const reviews = await axios.get(`http://localhost:5000/review/${isbn}`); // Use the correct endpoint
        res.status(200).json(reviews.data);
    } catch (error) {
        res.status(404).json({ message: "Book reviews not found.", error: error.message });
    }
});

module.exports.general = public_users;
