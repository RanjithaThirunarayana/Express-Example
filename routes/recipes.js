var express = require('express');
const app = require('../app');
var router = express.Router();

/* List all recipes*/
router.get('/', async function(req, res, next) {
  let recipes = await req.app.locals.db.collection("recipes");
  res.json(await recipes.find().toArray());
});

/*Search recipe names using MongoDB's text search*/
router.get('/recipeName/:name',async function(req,res,next) {
    try{
    var inputName = req.params.name;
    let recipes = await req.app.locals.db.collection("recipes");
    recipes.createIndex({
        name: "text"
    });
    let results = recipes.find({ $text: { $search: inputName } }).project({ name: 1 });
    results.count(function(err,count){
        if(!err && count === 0){
            res.send("Recipe name does not exist");
        }
    });
        await results.forEach(doc => {
                res.json(doc);
                  
        });

}catch(err){
    next(err);
}
});

/*Search recipes that use certain ingredients*/
router.get('/beefPotato',async function(req,res,next){
    let recipes = await req.app.locals.db.collection("recipes");
    res.json(await recipes.find({
        $and: [{
            'ingredients.name': 'Beef'
        }, {
            'ingredients.name': 'Potato'
        }]
    }).project({ name: 1 }).toArray());
});

/*Add a recipe*/
router.post('/addRecipe',async function(req,res,next){
    let recipes = await req.app.locals.db.collection("recipes");
    recipes.insert(req.body, function(err,result){
        if (err)
         res.send('Error');
      else
        res.send('Success');
    });
});
module.exports = router;