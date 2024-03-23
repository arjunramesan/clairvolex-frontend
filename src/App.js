import React, { useState } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);

  const [formData, setFormData] = useState({
    title: undefined,
    author: undefined,
    publishedFrom: undefined,
    publishedTo: undefined,
    genre: undefined,
    isbn: undefined,
    inStock: true,
  });

  const handleChange = (e) => {
    // Updating the formData on type
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBooks(formData);
  };

  const fetchBooks = async () => {
    // First we fetch auth token
    const token = await getToken();

    // Using this token we fetch books
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);
    const raw = JSON.stringify(formData);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    var books_resp = await fetch("http://localhost:8000/books", requestOptions);
    books_resp = await books_resp.json();
    setBooks(books_resp.data);
  };

  const getToken = async () => {
    // Reset books 
    setBooks([]);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      useremail: "arjun@gmail.com",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    var token_resp = await fetch(
      "http://localhost:8000/generate-token",
      requestOptions
    );
    token_resp = await token_resp.json();
    return token_resp.token;
  };

  return (
    <div className="App">
      <div className="max-w-md mx-auto flex p-6 bg-white rounded-lg shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-md mx-auto flex flex-col w-full text-left"
        >
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Title"
          />
          <hr></hr>
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="input-field"
            placeholder="Author"
          />
          <hr></hr>
          <div className="flex gap-4">
            <div>
              <label>Published From</label>
              <input
                type="date"
                name="publishedFrom"
                value={formData.publishedFrom}
                onChange={handleChange}
                className="input-field flex-1"
                placeholder="Published From"
              />
            </div>

            <div>
              <label>Published To</label>
              <input
                type="date"
                name="publishedTo"
                value={formData.publishedTo}
                onChange={handleChange}
                className="input-field flex-1"
                placeholder="Published To"
              />
            </div>
          </div>
          <hr></hr>
          <label>Genre</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="input-field"
            placeholder="Genre"
          />
          <hr></hr>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="checkbox"
            />
            <span className="ml-2">Show In Stock Only</span>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="mt-4">
        <div className="App">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-lg p-5">
                <h2 className="text-xl font-bold">{book.title}</h2>
                <p className="text-gray-800 text-sm">{book.author}</p>
                <p className="text-gray-600 text-xs">
                  Published:{" "}
                  {new Date(book.publication_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-xs">Genre: {book.genre}</p>
                <p className="mt-2 text-gray-700 text-sm">{book.description}</p>
                <p className="text-gray-600 text-xs">ISBN: {book.isbn}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
