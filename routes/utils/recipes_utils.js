const axios = require("axios");
const res = require("express/lib/response");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}



////////////////////////////////////
// Searching for recipes with expected "number" of results
async function search(query,number){
    let apiurl = `${api_domain}/complexSearch${query}&apiKey=${process.env.spooncular_apiKey}`;
    const d = await axios.get(apiurl);
    let data = d.data["results"];
    let result = [];
    for (let i = 0; i< data.length; i++){
        result.push(await getRecipeDetails(data[i].id))
    }
    result = result.slice(0,number);
    return result;
}


// getting recipe full information.
// TODO: CHECK
async function getRecipeFullInformation(recipe_id){
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, instructions, extendedIngredients,analyzedInstructions } = recipe_info.data;
    
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        servings:servings,
        extendedIngredients:extendedIngredients,
        instructions:instructions,
        analyzedInstructions: analyzedInstructions
    }
}


async function randomRecipes(){
    let apiurl=`${api_domain}/random?number=3&apiKey=${process.env.spooncular_apiKey}`;
    const d = await axios.get(apiurl);
    let data = d.data["recipes"];
    let result = [];
    for (let i = 0; i< data.length; i++){
        result.push(await getRecipeDetails(data[i].id))
    }
    result = result.slice(0,3);
    return result;
}

async function getRecipesPreview(recipes_id_array){
    var res = [];
    for (const id of recipes_id_array){
        let preview = await getRecipeDetails(id);
        res.push(preview);
    }
    return res;
}

exports.getRecipesPreview = getRecipesPreview;
exports.getRecipeDetails = getRecipeDetails;
exports.search = search;
exports.getRecipeFullInformation = getRecipeFullInformation;
exports.randomRecipes = randomRecipes;
exports.getRecipeInformation = getRecipeInformation

