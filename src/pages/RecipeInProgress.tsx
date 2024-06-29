import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CoracaoVazio from '../images/whiteHeartIcon.svg';
import CoracaoCheio from '../images/blackHeartIcon.svg';
import { fetchRecipesDetailsDrinks, fetchRecipesDetailsMeals } from '../utils/FetchApi';

function RecipeInProgress() {
  const locationResult = useLocation();
  const resultSplit = locationResult.pathname.split('/');
  const isDrink = resultSplit[1] === 'drinks';
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<any>({});
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [urlCopyState, setUrlCopyState] = useState<string>('');
  const [recipeInformations, setRecipeInformations] = useState<any>({});
  const strIngredient = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
    '13', '14', '15', '16', '17', '18', '19', '20',
  ];
  const [progress, setProgress] = useState<string[]>([]);

  const CallFechRecipesDetais = async () => {
    const results = isDrink
      ? await fetchRecipesDetailsDrinks(id)
      : await fetchRecipesDetailsMeals(id);
    console.log('results', results);

    setMeal(results[0]);
    console.log(meal);
  };

  useEffect(() => {
    CallFechRecipesDetais();
    const inProgress: any = localStorage?.getItem('inProgressRecipes');
    setProgress(JSON.parse(inProgress));
  }, []);

  const favoriteFuction = () => {
    const favoriteHeart: any = localStorage.getItem('favoriteRecipes');
    if (favoriteHeart) {
      const resultfavorite = JSON.parse(favoriteHeart);
      if (resultfavorite.length > 0) {
        resultfavorite?.forEach((receita: any) => {
          setIsFavorite(receita?.id === id);
        });
      } else {
        setIsFavorite(false);
      }
    }
  };
  const handleClickToShare = async (event: any) => {
    event?.preventDefault();
    if (navigator.clipboard) {
      const urlToCopy = window.location.href;
      try {
        await navigator.clipboard.writeText(urlToCopy);
        console.log('URL copiada para a área de transferência:', urlToCopy);
        setUrlCopyState('Link copied!');
      } catch (err) {
        console.error('Erro ao copiar URL para a área de transferência', err);
      }
    } else {
      console.error('A API da área de transferência não é suportada neste navegador');
    }
  };
  const handleClickFavorite = (event: any) => {
    event?.preventDefault();
    const recuperaFavorites: any = localStorage.getItem('favoriteRecipes');
    if (recuperaFavorites) {
      const currentFavorites = JSON.parse(recuperaFavorites);
      const isRecipeFavorited = currentFavorites
        .some((receita: any) => receita.id === id);
      if (isRecipeFavorited) {
        const updatedFavorites = currentFavorites
          .filter((receita: any) => receita.id !== id);
        localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
      } else {
        currentFavorites.push({
          id,
          type: recipeInformations.drinkOrMeal,
          nationality: meal.strArea || '',
          category: meal.strCategory || '',
          alcoholicOrNot: meal.strAlcoholic || '',
          name: recipeInformations.name,
          image: recipeInformations.imagem,
        });
        localStorage.setItem('favoriteRecipes', JSON.stringify(currentFavorites));
      }
    } else {
      const firstFavorite = [{
        id,
        type: recipeInformations.drinkOrMeal,
        nationality: meal.strArea || '',
        category: meal.strCategory || '',
        alcoholicOrNot: meal.strAlcoholic || '',
        name: recipeInformations.name,
        image: recipeInformations.imagem,
      }];
      localStorage.setItem('favoriteRecipes', JSON.stringify(firstFavorite));
    }
    favoriteFuction();
  };
  useEffect(() => {
    if (isDrink) {
      setRecipeInformations({
        drinkOrMeal: 'drink',
        name: meal.strDrink,
        imagem: meal.strDrinkThumb,
      });
    } else {
      setRecipeInformations({
        drinkOrMeal: 'meal',
        name: meal.strMeal,
        imagem: meal.strMealThumb,
      });
    }
  }, [meal]);

  const contain = (ingredient: string) => {
    if (progress?.length > 0) {
      return progress?.some((ingred: string) => ingred === ingredient);
    }
  };

  const onProgress = ({ target }: any) => {
    if (progress?.length > 0) {
      const isProgress = progress?.some((ingred: string) => ingred === target.name);

      if (isProgress) {
        setProgress(progress?.filter((ingred: string) => ingred !== target.name));
      } else {
        setProgress([...progress, target.name]);
      }
    } else {
      setProgress([target.name]);
    }
  };

  useEffect(() => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(progress));
  }, [progress]);

  return (
    <div>
      <h1>Receita em progresso</h1>
      <ul>
        <h2 data-testid="recipe-title">{ meal?.strMeal || meal?.strDrink }</h2>
        <h3 data-testid="recipe-category">
          {
        isDrink ? meal?.strAlcoholic : meal?.strCategory
        }
        </h3>

        <img
          data-testid="recipe-photo"
          src={ meal?.strMealThumb || meal?.strDrinkThumb }
          alt={ `${meal?.idMeal || meal?.idDrink}-imagem` }
        />
        <br />
        {strIngredient.map((ingredient: string, index: any) => (
          meal[`strIngredient${ingredient}`] !== ''
          && meal[`strIngredient${ingredient}`] !== null
          && meal[`strIngredient${ingredient}`] !== undefined) && (
            <li key={ meal.idMeal + ingredient || meal.idDrink }>
              <label
                htmlFor="ingredient-measure"
                data-testid={ `${index}-ingredient-step` }
              >
                <input
                  name={ ingredient }
                  type="checkbox"
                  id={ ingredient }
                  data-testid={ `${index}-ingredient-name-and-measure` }
                  checked={ contain(ingredient) }
                  onClick={ onProgress }
                />
                {meal[`strIngredient${ingredient}`]}
                {' '}
                {meal[`strMeasure${index + 1}`]}
              </label>
            </li>))}
      </ul>
      <p data-testid="instructions">
        {meal.strInstructions}
      </p>
      <button onClick={ handleClickToShare } data-testid="share-btn">compartilhar</button>
      <p>{urlCopyState !== '' && urlCopyState}</p>

      <button
        id="favorite"
        onClick={ handleClickFavorite }
      >
        <img
          data-testid="favorite-btn"
          src={ isFavorite ? CoracaoCheio : CoracaoVazio }
          alt="Coração"
          style={ { width: '16px', height: '16px', marginRight: '5px' } }
        />
        favoritar
      </button>
      <br />
      <button
        data-testid="finish-recipe-btn"
        onClick={ () => navigate('/done-recipes') }
      >
        Finalizar Receita

      </button>
    </div>
  );
}

export default RecipeInProgress;
