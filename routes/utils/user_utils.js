const { json } = require("express/lib/response");

const DButils = require("./DButils");
const { query } = require("./MySql");




// Watched
async function getWatchedRecipes(userID){
    const query = `select * from watchedRecipes where user_id='${userID}' `
    return await DButils.execQuery(query);
}
async function addRecipeToWatched(userID,recipe_id){
    const query = `insert into watchedRecipes values('${userID}','${recipe_id}')`
    await DButils.execQuery(query);
}

// favorite
async function markAsFavorite(user_id, recipe_id){
    const query = `insert into FavoriteRecipes values ('${user_id}',${recipe_id})`
    await DButils.execQuery(query);
}

async function getFavoriteRecipes(user_id){
    const query = `select recipe_id from FavoriteRecipes where user_id='${user_id}'`
    const recipes_id = await DButils.execQuery(query);
    return recipes_id;
}

// async function RemoveFromFavorite(user_id,recipe_id){
//     const query = `delete from FavoriteRecipes where recipe_id = '${recipe_id}' and user_id ='${user_id}'`
//     return await DButils.execQuery(query);
// }

//myRecipe

// async function RemoveFrommyRecipes(user_id,recipe_id){
//     const query = `delete from myRecipes where recipe_id = '${recipe_id}' and user_id ='${user_id}'`
//     return await DButils.execQuery(query);
// }

async function getMyRecipes(user_id){
    const query = `select * from myrecipes where user_id ='${user_id}'`
    const recipes = await DButils.execQuery(query);
    var res = [];
    for (let i = 0; i<recipes.length; i++){
        var recipe = {
            "recipe_id":recipes[i].recipe_id,
            "image":recipes[i].image,
            "title":recipes[i].title,
            "PreparationTime":recipes[i].PreparationTime,
            "popularity":recipes[i].popularity,
            "vegan":Boolean(recipes[i].vegan),
            "vegetarian":Boolean(recipes[i].vegeterian),
            "glutenFree":Boolean(recipes[i].glutenFree),
            "ingradiants":recipes[i].ingradiants,
            "instructions":recipes[i].instructions,
            "quantity":recipes[i].quantity
            }
        res.push(recipe);
    }
    return res;
}
// check
async function getMyRecipeFullInformation(user_id,recipe_id){
    const query = `select * from myRecipes where user_id ='${user_id}' and recipe_id ='${recipe_id}`
    const recipes = await DButils.execQuery(query);
    var res = [];
    for (let i = 0; i<recipes.length; i++){
        var recipe = {
            "recipe_id":recipes[i].recipe_id,
            "image":recipes[i].image,
            "title":recipes[i].title,
            "readyInMinutes":recipes[i].minutes,
            "popularity":recipes[i].popularity,
            "vegan":Boolean(recipes[i].vegan),
            "vegetarian":Boolean(recipes[i].vegetarian),
            "glutenFree":Boolean(recipes[i].glutenFree),
            "ingrediants":JSON.parse(recipes[i].ingrediants),
            "instructions":JSON.parse(recipes[i].instructions)
            }
        res.push(recipe);
    }
    return res[0];  
}

async function addToMyRecipe(user_id,image,title,Preparationtime,vegan,vegetarian,gluten,ingrediants,instructions){
    // const query = `insert into myRecipes values ('0','${user_id}','${img}','${title}','${Preparationminutes}','0',${vegan},${vegetarian},${gluten},'${ingrediants}','${instructions}')`
    const q = `insert into myrecipes (user_id,image,title,preparationTime,popularity,vegan,vegeterian,glutenfree,ingradiants,instructions,quantity) values ('${user_id}','${image}','${title}','${Preparationtime}','0','${vegan}','${vegetarian}','${gluten}','${ingrediants}','${instructions}','0')`
    await DButils.execQuery(q);
}

//Family

// async function RemoveFromFamily(user_id,recipe_id){
//     const query = `delete from FamilyRecipes where recipe_id = '${recipe_id}' and user_id ='${user_id}'`
//     return await DButils.execQuery(query);
// }

async function getFamilyRecipes(user_id){
    const query = `select * from FamilyRecipes where user_id ='${user_id}'`
    const recipes = await DButils.execQuery(query);
    var res = [];
    for (let i = 0; i<recipes.length; i++){
        var recipe = {
            "recipe_owner_id":recipes.recipe_owner_id,
            "image":recipes[i].image,
            "title":recipes[i].title,
            "preparationTime":recipes[i].preparationTime,
            "ingradiants":recipes[i].ingradiants,
            "instructions":recipes[i].instructions
            }
        res.push(recipe);
    }
    return res;
}


//check
async function getFamilyRecipeFullInformation(user_id,recipe_id){
    const query = `select * from FamilyRecipes where user_id ='${user_id}' and recipe_id ='${recipe_id}`
    const recipes = await DButils.execQuery(query);
    var res = [];
    for (let i = 0; i<recipes.length; i++){
        var recipe = {
            "image":recipes[i].image,
            "title":recipes[i].title,
            "owner":recipes[i].owner,
            "custom_time":recipes[i].custom_time,
            "readyInMinutes":recipes[i].minutes,
            "aggregate_likes":recipes.aggregate_likes,
            "vegan":Boolean(recipes[i].vegan),
            "vegetarian":Boolean(recipes[i].vegetarian),
            "glutenFree":Boolean(recipes[i].glutenFree),
            "ingrediants":JSON.parse(recipes[i].ingrediants),
            "instructions":JSON.parse(recipes[i].instructions)
            }
        res.push(recipe);
    }
    return res[0];  
}


async function addFamilyRecipe(user_id,owner,family_prep_time,image,title,preparationTime,ingrediants,instructions){
    // json_ingrediants = JSON.stringify(ingrediants);
    // json_instructions = JSON.stringify(instructions);

    const query =  `insert into FamilyRecipes values ('${user_id}','${owner}','${image}','${title}','${preparationTime}','${ingrediants}','${instructions}','${family_prep_time}')`
    await DButils.execQuery(query);
}







exports.addRecipeToWatched = addRecipeToWatched;
exports.getWatchedRecipes = getWatchedRecipes;

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
// exports.RemoveFromFavorite = RemoveFromFavorite;

exports.addToMyRecipe = addToMyRecipe;
exports.getMyRecipeFullInformation =getMyRecipeFullInformation;
exports.getToMyRecipes = getMyRecipes;
// exports.RemoveFromPrivate = RemoveFrommyRecipes;

exports.addFamilyRecipe = addFamilyRecipe;
exports.getFamilyRecipeFullInformation =getFamilyRecipeFullInformation;
exports.getFamilyRecipes = getFamilyRecipes;
// exports.RemoveFromFamily = RemoveFromFamily;

