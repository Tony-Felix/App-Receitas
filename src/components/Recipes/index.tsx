import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchMeals, fetchDrinks, fetchListDrinks,
  fetchListMeals,
  fetchFilterDrinks,
  fetchFilterMeals } from '../../utils/FetchApi';

function Recipes() {
  const { isDrink } = useSelector((state: any) => state.drinks);
  const [isChecked, setIsChecked] = useState<string>('');
  const [meals, setMeals] = useState<any>([]);
  const [saveMeals, setSaveMeals] = useState<any>([]);
  const [categorys, setCategorys] = useState<any>([]);

  const fetchApi = async () => {
    const results = isDrink ? await fetchDrinks() : await fetchMeals();
    const arrayResults = isDrink
      ? results.drinks.splice(0, 12) : results.meals.splice(0, 12);
    setMeals(arrayResults);
    setSaveMeals(arrayResults);

    const resultsCategorys = isDrink ? await fetchListDrinks() : await fetchListMeals();
    setCategorys(isDrink ? [...new Set(resultsCategorys.map((drink: any) => {
      return drink.strCategory;
    }))].splice(0, 5) : [...new Set(resultsCategorys.map((meal: any) => {
      return meal.strCategory;
    }))].splice(0, 5));
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleClickCategory = (event: any) => {
    const { name } = event.target;
    if (isChecked === name) {
      setIsChecked('');
    } else {
      setIsChecked(name);
    }
  };

  const checkBoxFilters = async () => {
    const results = isDrink
      ? await fetchFilterDrinks(isChecked) : await fetchFilterMeals(isChecked);
    setMeals(results.splice(0, 12));
  };

  useEffect(() => {
    if (isChecked) {
      checkBoxFilters();
    } else {
      setMeals(saveMeals);
    }
  }, [isChecked]);

  const handleClearFilterClick = (event: any) => {
    event?.preventDefault();
    setMeals(saveMeals);
    setIsChecked('');
  };

  return (
    <>
      <div>
        {categorys.map((category: any) => (
          <div
            key={ category }
          >
            <label htmlFor="category">{ category }</label>
            <input
              onClick={ handleClickCategory }
              type="checkbox"
              id={ category }
              name={ category }
              checked={ category === isChecked }
              data-testid={ `${category
              }-category-filter` }
            />
          </div>
        ))}
      </div>
      <button
        onClick={ handleClearFilterClick }
        data-testid="All-category-filter"
      >
        All
      </button>
      <br />

      { meals?.map((meal: any, index: number) => (
        <Link
          key={ meal?.idMeal || meal?.idDrink }
          data-testid={ `${index}-recipe-card` }
          to={ isDrink ? `/drinks/${meal?.idDrink}` : `/meals/${meal?.idMeal}` }
        >
          <img
            src={ meal?.strMealThumb || meal?.strDrinkThumb }
            alt={ `${meal?.idMeal || meal?.idDrink}-imagem` }
            data-testid={ `${index}-card-img` }
          />
          <p data-testid={ `${index}-card-name` }>
            {meal?.strMeal || meal?.strDrink}
          </p>
          <p>
            {meal?.strCategory}
          </p>
        </Link>
      ))}
    </>
  );
}

export default Recipes;
