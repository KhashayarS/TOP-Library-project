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