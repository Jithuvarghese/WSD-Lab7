document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://example.com/api/books'; // Replace with your JSON API URL
    let books = [];
    let currentPage = 1;
    const pageSize = 5;

    // Elements
    const bookList = document.getElementById('bookList');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const errorDiv = document.getElementById('error');

    function fetchBooks() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                books = data;
                displayBooks();
            })
            .catch(error => {
                errorDiv.textContent = `Error fetching books: ${error.message}`;
            });
    }

    function displayBooks() {
        const searchText = searchInput.value.toLowerCase();
        const sortOption = sortSelect.value;

        let filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchText) || 
            book.author.toLowerCase().includes(searchText)
        );

        filteredBooks.sort((a, b) => {
            if (sortOption === 'title') {
                return a.title.localeCompare(b.title);
            } else if (sortOption === 'author') {
                return a.author.localeCompare(b.author);
            } else if (sortOption === 'year') {
                return a.year - b.year;
            }
            return 0;
        });

        const paginatedBooks = filteredBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        bookList.innerHTML = paginatedBooks.map(book => `
            <li>
                <h2>${book.title}</h2>
                <p>Author: ${book.author}</p>
                <p>Year: ${book.year}</p>
            </li>
        `).join('');

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage * pageSize >= filteredBooks.length;
    }

    function handleSearch() {
        displayBooks();
    }

    function handleSort() {
        displayBooks();
    }

    function handlePagination(direction) {
        if (direction === 'next') {
            currentPage++;
        } else if (direction === 'prev') {
            currentPage--;
        }
        displayBooks();
    }

    searchInput.addEventListener('input', handleSearch);
    sortSelect.addEventListener('change', handleSort);
    prevPageButton.addEventListener('click', () => handlePagination('prev'));
    nextPageButton.addEventListener('click', () => handlePagination('next'));

    fetchBooks();
});
