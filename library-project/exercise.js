const myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function () {
        let info = "<p class='book-title'>" + this.title + "</p><p>By " + this.author + "</p><p>" + this.pages + " pages</p><p><em>";
        if (this.read) {
            info += "read"
        } else {
            info += "not read yet"
        }
        info += "</em></p>"
        return info;
    }
    this.toggleRead = function () {
        this.read = !this.read;
    }
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function displayBookCard(book) {
    const container = document.querySelector(".card-container");
    const card = document.createElement("div");
    card.setAttribute("class", "book-card");
    card.style.border = "solid black 2px";
    card.innerHTML = book.info();

    const removeBtn = document.createElement("button");
    removeBtn.setAttribute("class", "remove-btn");
    removeBtn.setAttribute("book-index", myLibrary.indexOf(book));
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", removeBtnCallBack);
    card.appendChild(removeBtn);

    const readBtn = document.createElement("button");
    readBtn.setAttribute("class", "read-btn");
    readBtn.setAttribute("book-index", myLibrary.indexOf(book));
    readBtn.setAttribute("isRead", book.read)
    readBtn.textContent = "Read";
    readBtn.addEventListener("click", readBtnCallBack)
    card.appendChild(readBtn);
    
    container.appendChild(card);
}

function displayCards(){
    if (myLibrary.length > 0) {
        myLibrary.forEach(displayBookCard);
    }
}

function setAddNewBookCallBack(){
    const addBookBtn = document.querySelector("#new-book-button");
    addBookBtn.addEventListener("click", (btn) => {
        const newBookDialog = document.querySelector(".new-book-dialog");
        newBookDialog.showModal();
    })
}

function removeBtnCallBack(event){
    const removedIndex = event.target.getAttribute("book-index");
    myLibrary.splice(removedIndex, 1);
    refreshCards();
}

function readBtnCallBack(event){
    const bookIndex = event.target.getAttribute("book-index");
    const book = myLibrary[bookIndex];
    book.toggleRead();
    refreshCards();
}

function refreshCards(){
    const cardContainer = document.querySelector(".card-container");
    cardContainer.innerHTML = "";
    displayCards();
}

function setSubmitBtnCallBack(){
    const bookForm = document.querySelector("#new-book-form");
    const newBookDialog = document.querySelector(".new-book-dialog");
    bookForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const bookTitle = document.querySelector("#book-title").value;
        const bookAuthor = document.querySelector("#book-author").value;
        const bookPages = document.querySelector("#book-pages").value;
        const bookRead = document.querySelector("#book-read").checked;
        const newBook = new Book(bookTitle, bookAuthor, bookPages, bookRead);
        addBookToLibrary(newBook);
        displayBookCard(newBook);

        newBookDialog.close();
        bookForm.reset();
    })
}

function setDialogCancelBtnCallBack() {
    const bookForm = document.querySelector("#new-book-form");
    const newBookDialog = document.querySelector(".new-book-dialog");
    document.querySelector("#dialog-cancel").addEventListener("click", () => {
        newBookDialog.close();
        bookForm.reset();
    });
}

// initiation
setAddNewBookCallBack();
setSubmitBtnCallBack()
setDialogCancelBtnCallBack()