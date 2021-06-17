const axios = require('axios');
const config = require('../sous_config');
const apiKey = config.spoonicularKey;
const spoon = 'https://api.spoonacular.com/recipes'

// Gets recipes for normal complex search
const query = async function(query, perPage) {
    let newURL = "";
    console.log(perPage)
    query = query.split(' ').join('_');
    if (perPage == 0) {
        newURL = spoon + '/complexSearch' + apiKey + '&query=' + query + '&addRecipeInformation=true';
    } else {
        newURL = spoon + '/complexSearch' + apiKey + '&query=' + query + '&addRecipeInformation=true' + '&number=' + perPage;
        console.log(newURL)
    }
    const response = await axios.get(newURL);
    return response.data.results;
};

// Gets recipes if budget is included in complex search
// Just like upper function just gets more information and checks if price per serving is in budget

module.exports.query = query;