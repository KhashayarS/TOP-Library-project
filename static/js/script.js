// Define custom variables
const myLibrary = [];

// Define document selector variables
const libraryContainer = document.querySelector("#library-container");
const addBookBtn = document.querySelector("#add-book-btn");
const addBookDialog = document.querySelector("#add-book-dialog");
const addBookForm = document.querySelector("#add-book-form");
const cancelAddBookBtn = document.querySelector("#cancel-add-book-btn");
const editBookDialog = document.querySelector("#edit-book-dialog");
const editBookForm = document.querySelector("#edit-book-form");
const confirmEditBookBtn = document.querySelector("#confirm-edit-book-btn");
const cancelEditBookBtn = document.querySelector("#cancel-edit-book-btn");
const trashIconBtn = document.querySelector("#trash-icon-btn");

let editBookBtnArray = [];

// HTML templates
const bookTemplateHTML = `
                <div class="book-container">
                    <div class="book-container-head">
                        <h3 class="title"></h3>
                    </div>
                    <div class="book-container-body">
                        <p class="author-text"><strong>Author(s): </strong></p>
                        <p class="pages-text"><strong>Pages: </strong></p>
                        <p class="read-text"><strong>Status: </strong><span class="reading-status finished"></span></p>
                    </div>
                    <div class="book-container-footer">
                        <button class="edit-book-btn">Edit</button>
                    </div>
                </div>
`;

// Book class
class Book {
    constructor(title, author, pages, read, id=false){
        const randomID = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = id ? id : randomID;
        this.info = function () {
            const readString = this.read ? 'read' : 'not read yet';
            const book_info = `${this.title} by ${this.author}, ${this.pages} pages, ${readString}`;
            return book_info;
        }
    }
}

/*

function Book(title, author, pages, read, id=false) {
    const randomID = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = id ? id : randomID;
    this.info = function () {
        const readString = this.read ? 'read' : 'not read yet';
        const book_info = `${this.title} by ${this.author}, ${this.pages} pages, ${readString}`;
        return book_info;
    }
}

*/

// Instantiate default books and display them on the page
const bookOne = new Book('The Pragmatic Programmer', 'Andy Hunt, Dave Thomas', 320, true);
const bookTwo = new Book('Eloquent JavaScript', 'Marijn Haverbeke', 448, false);
const bookThree = new Book('Clean Code', 'Robert Cecil Martin', 464, true);

myLibrary.push(bookOne, bookTwo, bookThree);

// console.log(bookOne.info());
// console.log(bookTwo.info());
// console.log(bookThree.info());


// EVENTS

// Display books right after the page gets loaded
document.addEventListener("DOMContentLoaded", displayBooks);

// Display and handle the add book dialog
addBookBtn.addEventListener("click", openAddBookDialogHandler);
addBookForm.addEventListener("submit", addBookHandler);
cancelAddBookBtn.addEventListener("click", cancelAddBookHandler);

// Add events to apply and cancel key of the edit form
confirmEditBookBtn.addEventListener("click", confirmEditBookHandler);
cancelEditBookBtn.addEventListener("click", cancelEditFormHandler);
trashIconBtn.addEventListener("click", deleteBookHandler);

// Event handlers and helper functions
function clearLibraryDisplay() {
    libraryContainer.innerHTML = '';
}

function displayBooks(event) {
    clearLibraryDisplay();
    let bookHTML;
    myLibrary.forEach(book => {
        const bookIsRead = book.read ? 'Reading Finished!' : 'Still Reading ...';
        const bookIsReadClass = book.read ? 'finished' : '';
        bookHTML = bookTemplateHTML;

        bookHTML = bookHTML.replace(`<h3 class="title"></h3>`, `<h3 class="title">${book.title}</h3>`);

        bookHTML = bookHTML.replace(
            `<p class="author-text"><strong>Author(s): </strong></p>`,
            `<p class="author-text"><strong>Author(s): </strong>${book.author}</p>`
        );

        bookHTML = bookHTML.replace(
            `<p class="pages-text"><strong>Pages: </strong></p>`,
            `<p class="pages-text"><strong>Pages: </strong>${book.pages}</p>`
        );

        bookHTML = bookHTML.replace(
            `<p class="read-text"><strong>Status: </strong><span class="reading-status finished"></span></p>`,
            `<p class="read-text"><strong>Status: </strong><span class="reading-status ${bookIsReadClass}">${bookIsRead}</span></p>`
        );
        
        bookHTML = bookHTML.replace(
            `<button class="edit-book-btn">Edit</button>`,
            `<button class="edit-book-btn" data-book-id="${book.id}">Edit</button>`
        );

        libraryContainer.insertAdjacentHTML('beforeend', bookHTML);
    });

    // Now that the display is updated we can update the edit buttons array and we add the handlers as well
    editBookBtnArray = document.querySelectorAll(".edit-book-btn");

    editBookBtnArray.forEach(editBtnElement => {
        editBtnElement.addEventListener("click", editBtnHandler);
    });
};

function openAddBookDialogHandler(event) {
    addBookDialog.showModal();
}

function addBook(book) {
    myLibrary.push(book);
}

function resetForm(form, resetValueAttributes = false) {
    form.reset();
    if (resetValueAttributes) {
        let inputElements = form.querySelectorAll('input');
        let inputElementsArray = Array.from(inputElements).filter(input => input['type'] !== 'submit');

        inputElementsArray.forEach(input => {
            input.setAttribute('value', '');
        });
    }
}

function addBookHandler(event) {
    event.preventDefault();
    // console.log(event.target);
    const formData = new FormData(addBookForm);
    const title = formData.get('new-book-title');
    const writer = formData.get('new-book-writer') ? formData.get('new-book-writer') : "-";
    const pages = formData.get('new-book-pages') ? formData.get('new-book-pages') : "-";
    const read = formData.get('new-book-read') ? true : false;
    const newBook = new Book(title, writer, pages, read);
    
    addBook(newBook);
    resetForm(addBookForm);

    addBookDialog.close();
    displayBooks();
}

function confirmEditBookHandler(event) {
    event.preventDefault();
    const formData = new FormData(editBookForm);
    const title = formData.get('current-book-title');
    const writer = formData.get('current-book-writer') ? formData.get('current-book-writer') : "-";
    const pages = formData.get('current-book-pages') ? formData.get('current-book-pages') : "-";
    // const read = formData.get('current-book-read') ? true : false;
    const read = editBookForm.querySelector('#current-book-read').checked;
    const id = editBookForm.querySelector('#confirm-edit-book-btn').getAttribute('data-book-id');
    
    const currentBookIndex = myLibrary.findIndex(book => book.id === id);
    const editedBook = new Book(title, writer, pages, read, id);
    myLibrary[currentBookIndex] = editedBook;

    editBookDialog.close();
    displayBooks();
}

function cancelAddBookHandler(event) {
    resetForm(addBookForm, resetValueAttributes=true);
    addBookDialog.close();
}

function fillEditForm(form, data) {
    const titleInput = form.querySelector('#current-book-title');
    const writerInput = form.querySelector('#current-book-writer');
    const pagesInput = form.querySelector('#current-book-pages');
    const readInput = form.querySelector('#current-book-read');
    const applyBtn = form.querySelector('#confirm-edit-book-btn');

    titleInput.setAttribute('value', data['title']);
    writerInput.setAttribute('value', data['writer']);
    pagesInput.setAttribute('value', data['pages']);
    if (data['read']) {
        readInput.setAttribute('checked', '');
    } else {
        readInput.removeAttribute('checked');
    }
    applyBtn.setAttribute('data-book-id', data['id']);
    trashIconBtn.setAttribute('data-book-id', data['id']);
}

function editBtnHandler(event) {
    const currentBookID = event.target.getAttribute('data-book-id');
    const currentBook = myLibrary.find(book => book['id'] === currentBookID);
    resetForm(editBookForm, resetValueAttributes=true);
    fillEditForm(editBookForm, data={
        title: currentBook['title'],
        writer: currentBook['author'],
        pages: currentBook['pages'],
        read: currentBook['read'],
        id: currentBook['id']
    })
    editBookDialog.showModal();
}

function cancelEditFormHandler(event) {
    editBookDialog.close();
}

function deleteBookHandler(event) {
    event.preventDefault();
    const currentBookID = event.currentTarget.getAttribute('data-book-id');
    const currentBookIndex = myLibrary.findIndex(book => book['id'] === currentBookID);
    if (currentBookIndex !== -1) myLibrary.splice(currentBookIndex, 1);
    editBookDialog.close();
    displayBooks();
}

