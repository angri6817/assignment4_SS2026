/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",  
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
      Called on page load to start all the requests:
      - Fetch random meal
      - Display meal
      - Map meal category to spirit
      - Fetch matching (or random) cocktail
      - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
Fetch a Random Meal from TheMealDB
Returns a Promise that resolves with the meal object
 */
function fetchRandomMeal() {
    return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(response => response.json())
    .then(data => {
      console.log(data);

      const meal=data.meals[0];
      return meal;
    });
}

/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/
function displayMealData(meal) {
    let mealName=document.getElementById("mealName").textContent=meal.strMeal;      //henter ut element fra HTML fil for å fylle ut detaljer om måltidet
    let mealImage=document.getElementById("mealImage").src=meal.strMealThumb;
    let category=document.getElementById("category").textContent="Category: " + meal.strCategory;
    let instructions=document.getElementById("mealInstructions").textContent=meal.strInstructions;

    //loop for ingrediender
    let list=document.getElementById("mealIngredientsList");
    list.innerHTML="";

    for(let i=1; i<=20; i++) {
      const ingredient=meal["strIngredient"+i];
      const measure=meal["strMeasure"+i];

      if(ingredient && ingredient!=="") {
        const li= document.createElement("li");
        li.textContent=ingredient+" - "+measure;
        list.appendChild(li);
      }
    }

    //la til if-setning for Youtubevideo i meal (om det finst displayer siden det)
    if(meal.strYoutube) {
      const videoId=meal.strYoutube.split("v=")[1];
      const embedUrl="https://www.youtube.com/embed/"+videoId;
      document.getElementById("mealYoutube").src=embedUrl;
    }
}

/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/
function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  return mealCategoryToCocktailIngredient[category] || "cola";
}

/*
Fetch a Cocktail Using a Spirit from TheCocktailDB
Returns Promise that resolves to cocktail object
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
Don't forget encodeURIComponent()
If no cocktails found, fetch random
*/

function fetchCocktailByDrinkIngredient(drinkIngredient) {
  return fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + encodeURIComponent(drinkIngredient))
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.drinks && data.drinks.length > 0) {
        return data.drinks[0];
      } else {
        return fetchRandomCocktail();
      }
    });
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
  return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      return data.drinks[0];
    });
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
  const cocktailContainer = document.getElementById("cocktail-container");

  let ingredients ="";
  for (let i = 1; i <= 15; i++) {
    if (cocktail["strIngredient" + i]) {
      ingredients += "<li>" + cocktail["strIngredient" + i] + "</li>";
    }
  }

  cocktailContainer.innerHTML =
  "<h2>" + cocktail.strDrink + "</h2>" +
  "<img src='" + cocktail.strDrinkThumb + "' alt='" + cocktail.strDrink + "'>" +
  "<h3> Ingredients: </h3>" +
  "<ul>" + ingredients + "</ul>" +
  "<h3> Instructions: </h3>" +
  "<p>" + cocktail.strInstructions + "</p>";
}

/*
Call init() when the page loads
*/
window.onload = init;
