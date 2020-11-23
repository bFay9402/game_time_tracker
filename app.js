//Game class represents a game
class Game {
  constructor(title, time) {
    this.title = title;
    this.time = time;
  }
}

//UI class handle UI tasks
class UI {
  static displayGames() {
    const games = Store.getGames();

    games.forEach((game) => UI.addGameToList(game));
  }

  static addGameToList(game) {
    const list = document.querySelector('#game-list');

    const row = document.createElement('tr');

    row.innerHTML = `<td>${game.title}</td> <td>${game.time}</td> <td><a class="btn btn-danger btn-sm delete">X</a></td>`;

    list.appendChild(row);
  }

  static deleteGame(el) {
    if(el.classList.contains('delete')){
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('#container');
    const form = document.querySelector('#game-form');
    container.insertBefore(div, form);

    //vanish in 3 secs
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#time').value = '';
  }
}

//Store class handles storage
class Store {
  static getGames() {
    let games;
    if(localStorage.getItem('games') === null) {
      games = [];
    } else {
      games = JSON.parse(localStorage.getItem('games'));
    }

    return games;
  }

  static addGame(game) {
    const games = Store.getGames();

    games.push(game);

    localStorage.setItem('games', JSON.stringify(games));
  }

  static removeGame(game) {
    const games = Store.getGames();

    localStorage.removeItem(game);

    localStorage.setItem('games', JSON.stringify(game));
  }
}

//event display games
document.addEventListener('DOMContentLoaded', UI.displayGames);

//event add a game
document.querySelector('#game-form').addEventListener('submit', (e) => {
  e.preventDefault();

  //get form values
  const title = document.querySelector('#title').value; 
  const time = document.querySelector('#time').value;

  //validate
  if(title === '' || time === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    //instantiate game
    const game = new Game(title, time);

    //add game to UI
    UI.addGameToList(game);

    //add game to store
    Store.addGame(game);

    //show success
    UI.showAlert('Game Added', 'success');

    //clear fields
    UI.clearFields();
  }
});

//event remove a game
document.querySelector('#game-list').addEventListener('click', (e) => {
  //remove from UI
  UI.deleteGame(e.target);

  //remove from store
  Store.removeGame(e.target);

  //show success
  UI.showAlert('Game Removed', 'success');
});