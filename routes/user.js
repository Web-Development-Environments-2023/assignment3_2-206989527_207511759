var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {  
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {

      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
      res.status(401).send("user is not authorized");
      next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    console.log("here")

    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    res.status(401).send("user is not authorized");
    next(error); 
  }
});





router.post('/privates', async (req,res,next) => {
  try{
    console.log('added')

    // const recipe_id = req.body.recipe_id;
    const image = req.body.image;
    const user_id = req.session.user_id;
    const title = req.body.title;
    const preparationTime = req.body.preparationTime;
    const vegetarian = req.body.vegeterian;
    const gluten = req.body.gluten;
    const ingrediants = req.body.ingrediants;
    const instructions = req.body.instructions;
    const vegan = req.body.vegan;
    await user_utils.addToMyRecipe(user_id,image,title,preparationTime,vegan,vegetarian,gluten,ingrediants,instructions);
    res.status(200).send("The Recipe successfully added to myRecipes")
  }
  catch(error){
    res.status(401).send("user is not authorized")
  }
})






router.get('/privates', async (req,res,next) => {
  try{
    
    const user_id = req.session.user_id;
    console.log(user_id)
    // let myRecipes = {};
    const result = await user_utils.getToMyRecipes(user_id);
    res.status(200).send(result);
  }
  catch(error){
    console.log(error)
    res.status(401).send("user is not authorized")
  }
})

router.get('/privates/info', async (req,res,next) => {
  try{
    const recipe_id = req.body.recipe_id;
    const user_id = req.session.user_id;
    console.log(user_id)
    // let myRecipes = {};
    const result = await user_utils.getMyRecipeFullInformation(user_id,recipe_id);
    res.status(200).send(result);
  }
  catch(error){
    console.log(error)
    res.status(401).send("user is not authorized")
  }
})





router.post('/family', async (req,res,next) => {
  try{
    const image = req.body.image;
    const user_id = req.session.user_id;
    const title = req.body.title;
    const preparationTime = req.body.preparationTime;
    const ingrediants = req.body.ingrediants;
    const instructions = req.body.instructions;
    const owner = req.body.recipe_owner_id;
    const family_prep_time = req.body.family_prep_time;
    await user_utils.addFamilyRecipe(user_id,owner,family_prep_time,image,title,preparationTime,ingrediants,instructions);
    res.status(200).send("The Recipe successfully added to family list")
  }
  catch(error){
    res.status(401).send("user is not authorized")
  }
})







router.get('/family',async(req,res,next) =>{
  try{
    const user_id = req.session.user_id;
    // let myRecipes = {};
    const result = await user_utils.getFamilyRecipes(user_id);
    res.status(200).send(result);
  }
  catch(error){
    res.status(401).send("user is not authorized")
  }
})










router.post('/watchedRecipes',async(req,res,next) =>{
  try{
    console.log("2")
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    await user_utils.addRecipeToWatched(user_id,recipe_id);
    res.status(200).send("The Recipe successfully added to watched list")
  }
  catch(error){
    res.status(400).send("Bad Request")
    //check!
  }
})









router.get('/watchedrecipes', async(req,res,next) =>{
  try{
    console.log("arrived")
    const user_id = req.session.user_id;
    const watched_lst = await user_utils.getWatchedRecipes(user_id);
    const idList = [];
    
    for (let i = watched_lst.length - 1; i >= 0 && idList.length < 3; i--){
      const recipe_ID = watched_lst[i]["recipe_id"];
      if (idList.includes(recipe_ID)){
        continue;
      }
      idList.push(recipe_ID);
    }
    const result = await Promise.all(idList.map(async (recipe_ID) => {
      return await recipe_utils.getRecipeDetails(recipe_ID);
    }));
    res.status(200).send(result);
  }
  catch(error){
    res.status(400).send("Bad Request")
  }
})


router.get('/threeRandom', async(req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    const recipeIDs = await user_utils.getWatchedRecipes(user_id);
    let recipes = [];
    for (let i = 0; i < recipeIDs.length; i++){
      recipes.push(recipeIDs[i].recipe_id);
    }
    recipes = recipes.slice(0,3);
    result = await recipe_utils.getRecipesPreview(recipes);
    res.status(200).send(result);
  }
  catch(error){
    next(error);
  }
})
module.exports = router;
