var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils =require("./utils/user_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/getRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    console.error('Sorry, There is no recipe by this id', error);
    next(error);
  }
});



/**
 * This path returns the search result of ID
 */

router.get("/search/", async(req,res,next)=>{
  console.log("in search")
  try{
    let query = "?query=" + req.query.query;
    let Quantity = 5;
    
    if (req.query.number != undefined){
      Quantity = req.query.number;
    }

    if (req.query.cuisine != undefined){
      query = query + "&cuisine=" + req.query.cuisine;
    }
    console.log(query);
    if (req.query.diet != undefined){
      query = query + "&diet=" + req.query.diet;
    }

    if (req.query.intolerances != undefined){
      query = query + "&intolerances=" + req.query.intolerances;
    }
    const result = await recipes_utils.search(query,Quantity)
    res.send(result);
  }
  catch(error){
    console.error('Sorry, There is no relevant recipes.', error);
    next(error)
  }
})


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/fullinformation/:recipeId", async(req,res,next)=> {
  try{
    const recipeID = req.params.recipeId;
    const userID = req.session.user_id;
    // await user_utils.addRecipeToWatched(userID,recipeID);
    const recipe = await recipes_utils.getRecipeFullInformation(recipeID);//check
    res.send(recipe);
  }
  catch(error){
    console.error('Sorry, There is no recipe by this id', error);
    next(error);
  }
})


/** 
 *  This path returns three random recipes
*/
router.get("/random", async(req,res,next)=>{
  try{
    const three = await recipes_utils.randomRecipes();
    res.send(three);
  }
  catch(error){
    console.error('Sorry, there is something wrong (( random )), REFRESH!', error);
    next(error);
  }
})


module.exports = router;
