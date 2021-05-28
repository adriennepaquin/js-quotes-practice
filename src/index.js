let quoteList = document.querySelector('#quote-list')
let quoteForm = document.querySelector('#new-quote-form')
let quoteCollection = []

getQuotes()
//console.log(quoteCollection)

quoteForm.addEventListener("submit", (e) => {
    e.preventDefault()
    postQuote(e.target)
})
quoteList.addEventListener("click", (e) => {
    if (e.target.textContent === "DELETE"){
        removeQuote(e.target.parentElement)
        //console.log(e.target.parentElement.id)
    } else if (e.target.textContent === "LIKE"){
        postLikes(e.target.parentElement)
    }
})

function getQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(data => iterateQuotes(data))
}
function iterateQuotes(quotesObj){
    quotesObj.forEach(renderQuote)
}
function renderQuote(quoteObj){
    quoteCollection.push(quoteObj)
    //console.log(quoteObj.likes.length)
    
    let quoteCard = document.createElement('li')
    let quote = document.createElement('h5')
    let author = document.createElement('h6')
    let likes = document.createElement('p')
    let likeBtn = document.createElement('button')
    let deleteBtn = document.createElement('button')

    quoteCard.id = quoteObj.id
    quote.textContent = quoteObj.quote
    author.textContent = quoteObj.author
    likes.textContent = `Likes: ${quoteObj.likes.length}`
    likeBtn.className = "like"
    likeBtn.textContent = "LIKE"
    deleteBtn.className = "delete"
    deleteBtn.textContent = "DELETE"

    quoteList.append(quoteCard)
    quoteCard.append(quote, author, likes, likeBtn,deleteBtn)
}

function postQuote(formInfo){
    let newQuote = {
        "quote": formInfo.quote.value,
        "author": formInfo.author.value
    }
    //console.log(newQuote)
    fetch('http://localhost:3000/quotes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
    .then(res => res.json())
    .then(data => renderNewQuote(data))
}
function renderNewQuote(quoteObj){
    //console.log(quoteObj)
    quoteCollection.push(quoteObj)
    //console.log(quoteObj.likes.length)
    quoteObj.likes = []
    
    let quoteCard = document.createElement('li')
    let quote = document.createElement('h5')
    let author = document.createElement('h6')
    let likes = document.createElement('p')
    let deleteBtn = document.createElement('button')
    let likeBtn = document.createElement('button')

    quoteCard.id = quoteObj.id
    quote.textContent = quoteObj.quote
    author.textContent = quoteObj.author
    likes.textContent = `Likes: ${quoteObj.likes.length}`
    likeBtn.className = "like"
    likeBtn.textContent = "LIKE"
    deleteBtn.className = "delete"
    deleteBtn.textContent = "DELETE"

    quoteList.append(quoteCard)
    quoteCard.append(quote, author, likes, likeBtn,deleteBtn)
}
function removeQuote(card){
    console.log(card)
    fetch(`http://localhost:3000/quotes/${card.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(res => res.json())
    .then(card.remove())
}
function postLikes(target){
    let newLikes = {
        "quoteId": parseInt(target.id),
        "createdAt": Date.now()
    }
    console.log(newLikes)
    fetch('http://localhost:3000/likes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLikes)
    })
    .then(res => res.json())
    .then(function(){
        quoteList.textContent = ""
        getQuotes()
    })

}