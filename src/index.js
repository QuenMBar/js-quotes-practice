document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/quotes?_embed=likes&_sort=author")
        .then((response) => response.json())
        .then((listData) => {
            popList(listData);
        });

    document.getElementById("new-quote-form").addEventListener("submit", (e) => {
        e.preventDefault();
        let dataObj = {
            quote: e.target.quote.value,
            author: e.target.author.value,
        };
        let postObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(dataObj),
        };
        fetch(`http://localhost:3000/quotes`, postObj)
            .then((response) => response.json())
            .then((data) => {
                data["likes"] = [];
                appendList(data);
                e.target.quote.value = "";
                e.target.author.value = "";
            });
    });
});

/**
 * @param {array} data
 */
function popList(listData) {
    const quoteList = document.getElementById("quote-list");
    quoteList.innerHTML = "";

    listData.forEach((quote) => {
        appendList(quote);
    });
}

function appendList(quote) {
    const quoteList = document.getElementById("quote-list");

    const quoteLi = document.createElement("li");
    quoteLi.className = "quoteListItem";
    quoteLi.data = { id: quote.id };

    const quoteTxt = document.createElement("p");
    quoteTxt.textContent = quote.quote;
    quoteTxt.className = "quoteText";

    const quoteAuthor = document.createElement("p");
    quoteAuthor.textContent = quote.author;
    quoteAuthor.className = "quoteAuthor";

    const quoteLikes = document.createElement("button");
    quoteLikes.textContent = "Likes: " + quote.likes.length;
    quoteLikes.className = "quoteLike";
    quoteLikes.addEventListener("click", (e) => {
        let dataObj = {
            quoteId: e.target.parentElement.data.id,
            createdAt: Date.now(),
        };
        let postObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(dataObj),
        };
        fetch(`http://localhost:3000/likes`, postObj)
            .then((response) => response.json())
            .then((data) => {
                e.target.textContent = "Likes: " + (parseInt(e.target.textContent.slice(7)) + 1);
            });
    });

    const deleteBttn = document.createElement("button");
    deleteBttn.textContent = "delete";
    deleteBttn.className = "quoteDelete";
    deleteBttn.addEventListener("click", (e) => {
        let postObj = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        };
        fetch(`http://localhost:3000/quotes/${e.target.parentElement.data.id}`, postObj).then((respones) => {
            e.target.parentElement.remove();
        });
    });

    quoteLi.append(quoteTxt, quoteAuthor, quoteLikes, deleteBttn);
    quoteList.append(quoteLi);
}
