import { initializeApp } from 'firebase/app';
import { 
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    updateDoc,
    doc,
    serverTimestamp,
    getDoc,
    deleteDoc
} from 'firebase/firestore';

import './style.css';

// initialize firebase
const firebaseApp = initializeApp({
    apiKey: "AIzaSyB6YQ81OmLCHM4pe3P9uI28pVJrmMAZZJc",
    authDomain: "library-8b24c.firebaseapp.com",
    projectId: "library-8b24c",
    storageBucket: "library-8b24c.appspot.com",
    messagingSenderId: "1021396265744",
    appId: "1:1021396265744:web:564501778c7fc2c5f15395"
});
// get Firebase Database
const db = getFirestore(firebaseApp);


// // an array of book objects
// let myLibrary = [];

// // adding a book to the myLibrary array
// function addBookToLibrary(book) {
//     myLibrary.push(book);
// }

// save a book to Firebase Database
async function saveBook(book) {
    try {
        await addDoc(collection(db, 'books'), {
            author: book.author,
            title: book.title,
            pages: book.pages,
            status: book.read ? 'read' : 'not read yet',
            timestamp: serverTimestamp()
        });
    }
    catch(error) {
        console.log('Error writing new book to Firebase Database', error);
    }
}

// loading the books from Firebase Database into the DOM
function loadBooks() {
    // query for loading books according to timestamps in descending order
    const booksQuery = query(collection(db, 'books'), orderBy('timestamp', 'desc'));

    // listening to the query
    onSnapshot(booksQuery, function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === 'removed') {
                // remove a book from the UI
                removeBookFromUI(change.doc.id);
            } else {
                let book = change.doc.data();
                // display book to the UI
                displayBook(change.doc.id, book.timestamp, book.author, book.title,
                            book.pages, book.status);
            }
        });
    });
}

// create and insert book into DOM (Placeholder for a book's content to display)
function createAndInsertBookToUI(id) {
    const container = document.createElement('div');
    container.classList.add('book-container');
    container.setAttribute('id', id);
    
    // also need to generate some placeholders for book's content to feed into in the displayBook function call
    // a skeleton
    const author = document.createElement('div');
    author.classList.add('author');

    const title = document.createElement('div');
    title.classList.add('title');

    const pages = document.createElement('div');
    pages.classList.add('pages');

    const status = document.createElement('div');
    status.classList.add('status');

    container.appendChild(author);
    container.appendChild(title);
    container.appendChild(pages);
    container.appendChild(status);

    const updateStatusButton = document.createElement('button');
    updateStatusButton.classList.add('updateBookStatus');
    updateStatusButton.textContent = 'update read status';
    updateStatusButton.addEventListener('click', updateBookReadStatus);
    container.appendChild(updateStatusButton);

    const removeBookButton = document.createElement('button');
    removeBookButton.classList.add('removeBook');
    removeBookButton.textContent = 'remove book';
    removeBookButton.addEventListener('click', removeBookFromDatabase);
    container.appendChild(removeBookButton);

    document.querySelector('.container').appendChild(container);

    return container;
}

// display a book in the UI
function displayBook(id, timestamp, author, title, pages, status) {
    let div = document.getElementById(id) || createAndInsertBookToUI(id);

    div.querySelector('.author').textContent = `author: ${author}`;
    div.querySelector('.title').textContent = `title: ${title}`;
    div.querySelector('.pages').textContent = `pages: ${pages}`;
    div.querySelector('.status').textContent = `status: ${status}`;
}

// update the status of book via setDoc to Firebase Database
// callback
async function updateBookReadStatus(e) {
    const bookID = e.target.parentNode.id;
    const book = doc(db, 'books', bookID);
    const docSnap = await getDoc(book);

    if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.status === 'read') {
            await updateDoc(book, {
                    status: 'not read yet'
                });
        } else if (data.status === 'not read yet') {
            await updateDoc(book, {
                status: 'read'
            });
        }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}

// remove the book from Firebase Database
// callback
async function removeBookFromDatabase(e) {
    const bookID = e.target.parentNode.id;

    await deleteDoc(doc(db, 'books', bookID));
}

// remove a book from the DOM
function removeBookFromUI(id) {
    document.getElementById(id).remove();
}


// class for creating Book objects
class Book {
    constructor(author, title, pages, read) {
        this.author = author;
        this.title = title;
        this.pages = pages;
        this.read = read;
    }

    status() {
        if (this.read) {
            return 'read';
        } else {
            return 'not read yet';
        }
    }
}

const authorField = document.querySelector('#author');
const authorFieldError = document.querySelector('#author + span.error');
const titleField = document.querySelector('#title');
const titleFieldError = document.querySelector('#title + span.error');
const pagesField = document.querySelector('#pages');
const pagesFieldError = document.querySelector('#pages + span.error');
const readField = document.getElementById('read');
const notreadField = document.getElementById('notread');
const readnotreadFieldError = document.querySelector('.radio.error');


// incorporate validity check during user input
authorField.addEventListener('input', () => {
    if (!authorField.validity.valid) {
        authorFieldError.textContent = 'author name needed';
    } else {
        authorFieldError.textContent = '';
    }
});

titleField.addEventListener('input', () => {
    if (!titleField.validity.valid) {
        titleFieldError.textContent = 'title name needed';
    } else {
        titleFieldError.textContent = '';
    }
});

pagesField.addEventListener('input', () => {
    if (!pagesField.validity.valid) {
        pagesFieldError.textContent = 'pages needed';
    } else {
        pagesFieldError.textContent = '';
    }
});

readField.addEventListener('change', () => {
    readnotreadFieldError.textContent = '';
});

notreadField.addEventListener('change', () => {
    readnotreadFieldError.textContent = '';
});


const submitBtn = document.querySelector('#submit');
submitBtn.addEventListener('click', () => {

    // input fields validity check
    if (!authorField.checkValidity() || !titleField.checkValidity() || !pagesField.checkValidity() || 
        (!readField.checked && !notreadField.checked)) {
        showError();
        return;
    } else {
        authorFieldError.textContent = '';
        titleFieldError.textContent = '';
        pagesFieldError.textContent = '';
        readnotreadFieldError.textContent = '';
    }

    const author = authorField.value;
    const title = titleField.value;
    const pages = pagesField.value;

    let read = false;
    if (readField.checked) {
        read = true;
    } else if(notreadField.checked) {
        read = false;
    }

    const book = new Book(author, title, pages, read);
    saveBook(book); // to firebase database

    document.querySelector('#author').value = null;
    document.querySelector('#title').value = null;
    document.querySelector('#pages').value = null;
    document.getElementById('read').checked = false;
    document.getElementById('notread').checked = false;
});

function showError() {
    // check for author field
    if (!authorField.validity.valid) {
        if (authorField.validity.valueMissing) {
            authorFieldError.textContent = 'author name needed';
        }
    }

    // check for title field
    if (!titleField.validity.valid) {
        if (titleField.validity.valueMissing) {
            titleFieldError.textContent = 'title name needed';
        }
    }

    // check for pages field
    if (!pagesField.validity.valid) {
        if (pagesField.validity.valueMissing) {
            pagesFieldError.textContent = 'pages needed';
        }
    }

    // check for read field
    if (!readField.checked && !notreadField.checked) {
        readnotreadFieldError.textContent = 'pls check either box';
    }
}


// "NEW BOOK" button that brings up a form for user to input the new book's details
// e.g. author, title, number of pages, whether it's been read, ...
function displayForm() {
    const form = document.querySelector('.form');

    if (form.style.visibility == 'hidden') {
        form.style.visibility = 'visible';
    }
}

const newBook = document.querySelector('#newBook');
newBook.addEventListener('click', displayForm);


// cancel button to clear the form values and hide the form
function cancelForm() {

    document.querySelector('#author').value = null;
    document.querySelector('#title').value = null;
    document.querySelector('#pages').value = null;
    document.getElementById('read').checked = false;
    document.getElementById('notread').checked = false;

    authorFieldError.textContent = '';
    titleFieldError.textContent = '';
    pagesFieldError.textContent = '';
    readnotreadFieldError.textContent = '';

    const form = document.querySelector('.form');
    form.style.visibility = 'hidden';
}

const cancelBtn = document.querySelector('#cancel');
cancelBtn.addEventListener('click', cancelForm);




// load books into the app
loadBooks();