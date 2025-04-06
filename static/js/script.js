// Define custom variables
const myLibrary = [];

// Define document selector variables
const libraryContainer = document.querySelector("#library-container");
const addBookBtn = document.querySelector("#add-book-btn");
const addBookDialog = document.querySelector("#add-book-dialog");
const addBookForm = document.querySelector("#add-book-form");
const cancelAddBookBtn = document.querySelector("#cancel-add-book-btn");

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

// Book cunstructor
function Book(title, author, pages, read) {
    const randomID = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = randomID;
    this.info = function () {
        const readString = this.read ? 'read' : 'not read yet';
        const book_info = `${this.title} by ${this.author}, ${this.pages} pages, ${readString}`;
        return book_info;
    }
}

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
}

function openAddBookDialogHandler(event) {
    addBookDialog.showModal();
}

function addBook(book) {
    myLibrary.push(book);
}

function resetForm(form) {
    form.reset();
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

function cancelAddBookHandler(event) {
    resetForm(addBookForm);
    addBookDialog.close();
}