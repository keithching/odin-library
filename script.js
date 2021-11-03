// an array of book objects
let myLibrary = [];

// adding a book to the myLibrary array
function addBookToLibrary(book) {
    myLibrary.push(book);
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
    addBookToLibrary(book);
    refreshDisplay();

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


// function that loops through the array and displays each book on the page
function refreshDisplay() {

    const container = document.querySelector('.container');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (let i = 0; i < myLibrary.length; i++) {

        const bookCard = document.createElement('div');
        bookCard.setAttribute('class','bookCard');
        // data-attribute to DOM element to correlate with myLibrary array
        bookCard.setAttribute('data-index', i);

        const authorDisplay = document.createElement('p');
        authorDisplay.setAttribute('class', 'author');
        authorDisplay.textContent = `Author: ${myLibrary[i].author}`; // TODO

        const titleDisplay = document.createElement('p');
        titleDisplay.setAttribute('class', 'title');
        titleDisplay.textContent = `Title: ${myLibrary[i].title}`;

        const pagesDisplay = document.createElement('p');
        pagesDisplay.setAttribute('class', 'pages');
        pagesDisplay.textContent = `Number of Pages: ${myLibrary[i].pages}`;

        const readDisplay = document.createElement('p');
        readDisplay.setAttribute('class', 'status');
        readDisplay.textContent = `Status: ${myLibrary[i].status()}`; 

        bookCard.appendChild(authorDisplay);
        bookCard.appendChild(titleDisplay);
        bookCard.appendChild(pagesDisplay);
        bookCard.appendChild(readDisplay);
        container.appendChild(bookCard);
    }

    addRemoveButton();
    addChangeStatusButton();
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

// add a remove button on each book's display to remove the book from the library
function addRemoveButton() {
    const cards = document.querySelectorAll('.bookCard');
    cards.forEach(card => {
        const button = document.createElement('button');
        button.setAttribute('class', 'remove');
        button.textContent = 'Remove Book';
        button.addEventListener('click', removeBook);
        card.appendChild(button);
    });    
}

function removeBook() {
    const bookCard = this.closest('.bookCard'); // get the closest bookCard element
    // remove book from myLibrary array
    const index = bookCard.getAttribute('data-index');

    myLibrary.splice(index, 1);
    refreshDisplay();
}


// add a button on each book's display to change its read status
function addChangeStatusButton() {
    const cards = document.querySelectorAll('.bookCard');
    cards.forEach(card => {
        const button = document.createElement('button');
        button.setAttribute('class', 'changestatus');
        button.textContent = 'Update Read Status';
        button.addEventListener('click', changeBookStatus);
        card.appendChild(button);
    });        
}

function changeBookStatus() {
    const bookCard = this.closest('.bookCard'); // get the closest bookCard element
    // remove book from myLibrary array
    const index = bookCard.getAttribute('data-index');

    if (myLibrary[index].read) {
        myLibrary[index].read = false;
    } else {
        myLibrary[index].read = true;
    }

    refreshDisplay();
}

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

