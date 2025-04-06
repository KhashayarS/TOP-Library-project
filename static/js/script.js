// Define variables
const addBookBtn = document.querySelector("#add-book-btn");
const addBookDialog = document.querySelector("#add-book-dialog");


function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function () {
        const readString = this.read ? 'read' : 'not read yet';
        const book_info = `${this.title} by ${this.author}, ${this.pages} pages, ${readString}`;
        return book_info;
    }
}

// Instantiate a book
const theHobbit = new Book('The Hobbit', 'J.R.R. Tokien', 295, false);
console.log(theHobbit.info());

// Display and handle the add book dialog
addBookBtn.addEventListener("click", addBookDialogHandler);


// Event Handlers
function addBookDialogHandler(event) {
    addBookDialog.showModal();
}