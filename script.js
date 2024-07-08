//*API====
const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '35942530famsh4dcf142672dfb7ep1285d1jsn79ccfa44a595',
        'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
    }
};
//*API====

//?GAME CLASS START
class Game {
    constructor(id, title, thumbnail, shortDescription, gameUrl, genre, platform) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
        this.shortDescription = shortDescription;
        this.gameUrl = gameUrl;
        this.genre = genre;
        this.platform = platform;
    }
}
//?GAME CLASS END

//*UI CLASS START

class Ui {
    constructor() {
        this.gamesContainer = document.getElementById('games-container');
        this.detailsContainer = document.getElementById('details-container');
        this.detailsSection = document.getElementById('details-section');

        // GAMES CATEGORIES
        const genreItems = document.querySelectorAll('#navbar a[data-genre]');
        genreItems.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                const genre = event.target.getAttribute('data-genre');
                this.displayByGenre(genre);
            });
        });
    }
    

    //TO GET THE GAMES
    async fetchGames(genre = '') {
        try {
            const fetchUrl = genre ? `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${genre}` : url;
            const response = await fetch(fetchUrl, options);
            const data = await response.json();
            console.log(data);
            return this.displayGames(data);
        } catch (error) {
            console.error('Error fetching games:', error);
            return [];
        }
    }

    async displayByGenre(genre) {
        await this.fetchGames(genre);
    }

    async fetchDetails(id) {
        try {
            const response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`, options);
            const data = await response.json();
            console.log(data)
            return this.displayDetails(data);
        } catch (error) {
            console.error('Error fetching game details:', error);
            return null;
        }
    }


    //TO DISPLAY THE GAMES

    displayGames(data) {
        this.gamesContainer.innerHTML = '';
        data.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'card';

            gameCard.innerHTML = `
                <div class="card-img"><img src="${game.thumbnail}" alt="${game.title}"></div>
                <div class="card-content">
                    <div class="card-title">${game.title}</div>
                    <div class="card-body">${this.truncateDescription(game.short_description)}</div>
                    <div class="card-category"><strong>Genre:</strong> ${game.genre}</div>
                    <div class="card-platform"><strong>Platform:</strong> ${game.platform}</div>
                </div>
            `;
            gameCard.addEventListener('click', () => {
                this.fetchDetails(game.id);
            });
            this.gamesContainer.appendChild(gameCard);
        });
    }

    displayDetails(gameId) {
        this.detailsContainer.innerHTML = `
            <span class="close-btn">&times;</span>
            <div class="details-img">
                            <h1>${gameId.title}</h1>
                <img src="${gameId.thumbnail}" alt="${gameId.title}">
            </div>
            <div class="details-content">
                <div>
                    <p>${gameId.description}</p>
                </div>
                        <hr/>
                <div>
                    <p><strong>Genre:</strong> ${gameId.genre}</p>
                    <p><strong>Platform:</strong> ${gameId.platform}</p>
                    <p><strong>Publisher:</strong> ${gameId.publisher}</p>
                    <p><strong>Developer:</strong> ${gameId.developer}</p>
                    <p><strong>Release Date:</strong> ${gameId.release_date}</p>
                    <button><a href="${gameId.game_url}" target="_blank">Play Now</a></button>
                </div>
            </div>
        `;
        this.gamesContainer.style.display = 'none';
        this.detailsSection.style.display = 'block';

        const closeButton = this.detailsContainer.querySelector('.close-btn');
        closeButton.addEventListener('click', () => {
            this.gamesContainer.style.display = 'grid';
            this.detailsSection.style.display = 'none';
        });
    }

    //EFFECTS
    truncateDescription(description) {
        const words = description.split(' ');
        if (words.length > 9) {
            return words.slice(0, 10).join(' ') + '...';
        }
        return description;
    }

    ScrollEffect() {
        window.onscroll = () => {
            let nav = document.querySelector('#navbar');
            let header = document.querySelector('header');

            if (window.scrollY >= header.offsetHeight - 55) {
                nav.classList.add("fixed");
            } else {
                nav.classList.remove("fixed");
            }


        };
    }
    //EFFECTS


}
//*UI CLASS END

let ui = new Ui();
ui.fetchGames();
ui.ScrollEffect();