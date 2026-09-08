let currentQuote = "";
let currentAuthor = "";

async function getQuote() {
    try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();

        currentQuote = data.quote;
        currentAuthor = data.author;

        document.getElementById("quote").textContent = `"${currentQuote}"`;
        document.getElementById("author").textContent = `— ${currentAuthor}`;

    } catch (error) {
        document.getElementById("quote").textContent =
            "Unable to fetch a quote. Please try again.";
        console.error(error);
    }
}

async function favoriteQuote() {
    if (!currentQuote) {
        alert("Please get a quote first!");
        return;
    }

    try {
        const response = await fetch("/api/favorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quote: currentQuote,
                author: currentAuthor
            })
        });

        if (response.ok) {
            alert("❤️ Quote added to favorites!");
            loadFavorites();
        }

    } catch (error) {
        console.error(error);
    }
}

async function loadFavorites() {
    try {
        const response = await fetch("/api/favorites");
        const favorites = await response.json();

        const container = document.getElementById("favorites");

        if (favorites.length === 0) {
            container.innerHTML = "<p>No favorite quotes yet.</p>";
            return;
        }

        container.innerHTML = favorites.map(item => `
            <div class="favorite-item">
                <p>"${item.quote}"</p>
                <small>— ${item.author}</small>
            </div>
        `).join("");

    } catch (error) {
        console.error(error);
    }
}

async function copyQuote() {
    if (!currentQuote) {
        alert("Please get a quote first!");
        return;
    }

    const text = `"${currentQuote}" — ${currentAuthor}`;

    try {
        await navigator.clipboard.writeText(text);
        alert("📋 Quote copied!");
    } catch (error) {
        console.error(error);
    }
}

getQuote();
loadFavorites();