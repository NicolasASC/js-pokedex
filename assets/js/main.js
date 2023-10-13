const pokemonList = document.getElementById('pokemonList');

const maxRecords = 151;
const limit = 8;
let offset = 0;

const loadMoreButton = document.getElementById('loadMoreButton');

const searchInput = document.getElementById('searchInput');

function convertPokemonToLi(pokemon) {
  
  let digits = '#0';
  if(pokemon.number < 10){
    digits = '#00';
  }else if(pokemon.number > 99){
    digits = '#';
  }
  
  return `
          <li class="pokemon ${pokemon.defType}">
            <div>

                <ol class="mainDetailList">
                    <li class="name">${pokemon.name}</li>
                    <li class="number">${digits}${pokemon.number}</li>
                </ol>

            </div>
                          
            <div class="detail">
                
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <ol class="types-list">
                        ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                
            </div>
        </li>
        `
}

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    })
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
  offset += limit;

  const totalRecordsWithNextPage = offset + limit;

  if (totalRecordsWithNextPage >= maxRecords){
    const newLimit = maxRecords - offset;
    loadPokemonItems(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  }else{
    loadPokemonItems(offset, limit);
  }
})

function debounce(search, delay) {
  let timeoutId;
  return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function() {
          search.apply(context, args);
      }, delay);
  };
}

searchInput.addEventListener('keyup', debounce(() => {

      pokemonList.innerHTML = '';
      loadMoreButton.style.display = 'none';
      const searchTxt = searchInput.value.toLowerCase();
      let pokemonCount = 0;
  
      function compare(pokemon, searchTxt){
          let stringPokemon = '';
          let stringSearch = '';
          for(let i=0; i<searchTxt.length; i++){
              stringPokemon += searchTxt.charAt(i);
              stringSearch += pokemon.name.charAt(i).toLowerCase();
              if(i === searchTxt.length - 1){
                  if(stringPokemon !== stringSearch){
                    return false;
                  } else {
                    return true;
                  }
              }
          }
      }
  
      pokeApi.getPokemons(0, 151).then((pokemons = []) => {
          pokemons.map(pokemon => {
              if(pokemonCount < 8 && compare(pokemon, searchTxt)){     
                  const newHtmlAfterSearch = convertPokemonToLi(pokemon);
                  pokemonList.innerHTML += newHtmlAfterSearch;
                  pokemonCount++
              }
          })
          if(pokemonCount < 8 && searchTxt == 0){
            loadPokemonItems(0, 8);
            loadMoreButton.style.display = 'block';
          }
      });
    }, 500));







