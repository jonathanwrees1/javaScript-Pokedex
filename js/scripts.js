//IIFE Start//
let pokemonRepository = (function () {
  function showModal(pokemon) {
    let modalBody = $('.modal-body');
    let modalTitle = $('.modal-title');

    modalTitle.empty();
    modalBody.empty();

    let pokemonName = $('<h1>' + pokemon.name + '</h1>');

    let pokemonImage = $('<img class="modal-img"/>');
    pokemonImage.attr('src', pokemon.imageUrl);

    let pokemonHeight = $(
      '<p>' +
        'height : ' +
        (pokemon.height * 0.1).toFixed(1) +
        ' meters tall' +
        '</p>'
    );

    function getTypes() {
      if (!pokemon.type2) {
        return '';
      } else {
        return ', ' + pokemon.type2;
      }
    }

    let pokemonType = $(
      '<p>' + 'type : ' + pokemon.type1 + getTypes() + '</p>'
    );

    modalTitle.append(pokemonName);
    modalBody.append(pokemonImage);
    modalBody.append(pokemonHeight);
    modalBody.append(pokemonType);
  }

  let pokemonList = [];
  //external site we get the pokemon info from
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=1000';

  //add pokemon to end of list
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  //return entire list
  function getAll() {
    return pokemonList;
  }

  function loadList() {
    //grabs list from site
    return (
      fetch(apiUrl)
        .then(function (response) {
          return response.json();
        })
        //translates from json
        .then(function (json) {
          json.results.forEach(function (item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url,
            };
            add(pokemon);
          });
        })
        .catch(function (e) {
          console.error(e);
        })
    );
  }

  //selects details of each pokemon including sprite from external site
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.type1 = details.types[0].type.name;
        item.type2 = details.types[1].type.name;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //function to turn list items into buttons
  function addListItem(pokemon) {
    let pokemonList = document.querySelector('.list-group');
    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item');

    let button = document.createElement('button');
    button.innerText = pokemon.name;

    button.classList.add('btn');
    button.classList.add('btn-secondary');
    button.setAttribute('data-target', '#exampleModal');
    button.setAttribute('data-toggle', 'modal');

    listItem.appendChild(button);

    pokemonList.appendChild(listItem);

    //listener so details are shown when button is clicked
    button.addEventListener('click', function () {
      showDetails(pokemon);
    });
  }
  const list = document.getElementById('poke-list');

  const searchBar = document.getElementById('myInput');
  searchBar.addEventListener('keyup', function (event) {
    const term = event.target.value.toLowerCase();
    const words = list.getElementsByTagName('li');
    Array.from(words).forEach(function (word) {
      const title = word.textContent;
      if (title.toLowerCase().indexOf(term) != -1) {
        word.style.display = 'block';
      } else {
        word.style.display = 'none';
      }
    });
  });

  //displays all details in the modal
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
      $('#exampleModal').modal('show');
    });
  }

  //object keys
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

//IIFE End

//calling out functions
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
