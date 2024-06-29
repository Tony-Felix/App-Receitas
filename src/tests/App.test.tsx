import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithRouterAndRedux } from '../utils/renderWith';
import App from '../App';
import Profile from '../pages/Profile';
import Drinks from '../pages/Drinks';
import SearchBar from '../components/SearchBar';

// const route = '/rota';
// const { user } = renderWithRouterAndRedux(<App />, {
// initialEntries: [route], initialState: { state } });

export const search = 'search-top-btn';
export const buttonSeach = 'exec-search-btn';
export const btnDrinks = 'drinks-bottom-btn';

describe('Testa o funcionamento do componente Footer.', () => {
  it('Testa se Footer existe e funciona corretamente', async () => {
    const route = '/meals';
    const { user } = renderWithRouterAndRedux(<App />, { initialEntries: [route] });

    const imgDrink = screen.getByTestId(btnDrinks);
    const imgMeal = screen.getByTestId('meals-bottom-btn');
    expect(imgDrink).toBeInTheDocument();
    expect(imgMeal).toBeInTheDocument();

    await act(async () => {
      await user.click(imgDrink);
    });
    const drink = screen.getByRole('heading', { level: 1, name: 'Drinks' });
    expect(drink).toBeInTheDocument();

    await act(async () => {
      await user.click(imgMeal);
    });
    const meals = screen.getByRole('heading', { level: 1, name: 'Drinks' });
    expect(meals).toBeInTheDocument();
  });
});

test('testando rota profile', () => {
  renderWithRouterAndRedux(<Profile />);
  const profileImg = screen.getByAltText('Check icon');
  const routeTitle = screen.getByText('Profile');
  const doneRecipes = screen.getByTestId('profile-done-btn');
  expect(profileImg).toBeInTheDocument();
  expect(routeTitle).toHaveTextContent('Profile');
  userEvent.click(doneRecipes);
});
test('testando rota drinks', async () => {
  renderWithRouterAndRedux(<Drinks />);
  const searchBtn = screen.getByTestId(search);
  await userEvent.click(searchBtn);
  const searchInput = screen.getByTestId('search-input');
  expect(searchInput).toBeInTheDocument();
  const Title = screen.getByRole('heading', { name: /drinks/i });
  expect(Title).toHaveTextContent('Drinks');
  await userEvent.click(searchBtn);
  expect(searchInput).not.toBeInTheDocument();
});
// test('testando searchbar', async () => {
// const route = '/drinks';
// const { user } = renderWithRouterAndRedux(<App />, { //initialEntries: [route] });
// const alertLetter = vi.spyOn(window, 'alert');
// const searchBtn = screen.getByTestId(search);
//  await userEvent.click(searchBtn);
//  const searchButoon = screen.getByTestId(buttonSeach);
//  expect(searchButoon).toBeInTheDocument();

// await act(async () => {
//   await user.click(searchButoon);
// });
// expect(alertLetter).toHaveBeenCalledWith("Sorry, ////something's wrong. Try again!");
/// /});

// test('testando alertas e correta renderização de elementos no componente searchBar', async () => {
// renderWithRouterAndRedux(<SearchBar />);
// const searchInput = screen.getByLabelText('pesquisar');
// const radioIngredient = screen.getByTestId/('ingredient-search-radio');
// const radioName = screen.getByTestId('name-search-radio');
//  const radioLetter = screen.getByTestId('first-letter-search-radio');
// const searchBtn = screen.getByTestId(buttonSeach);
// const alertLetter = vi.spyOn(window, 'alert');
// expect(searchInput).toBeInTheDocument();
//  expect(radioIngredient).toBeInTheDocument();
// expect(radioName).toBeInTheDocument();
//  expect(radioLetter).toBeInTheDocument();
// expect(searchBtn).toBeInTheDocument();
// await userEvent.type(searchInput, 'suco');
// await userEvent.click(radioLetter);
// expect(radioLetter).toBeChecked();
// await userEvent.click(searchBtn);
// expect(alertLetter).toHaveBeenCalledWith('Your search must have only 1 (one) character');
// });

test('testando Done recipes', async () => {
  const route = '/done-recipes';
  const { user } = renderWithRouterAndRedux(<App />, {
    initialEntries: [route] });

  const buttonAll = screen.getByTestId('filter-by-all-btn');
  expect(buttonAll).toBeInTheDocument();

  const mealsButton = screen.getByTestId('filter-by-meal-btn');
  expect(mealsButton).toBeInTheDocument();

  const drinksButton = screen.getByTestId('filter-by-drink-btn');
  expect(drinksButton).toBeInTheDocument();

  const title = screen.getByText('Done Recipes');
  expect(title).toBeInTheDocument();

  const profile = screen.getByTestId('profile-top-btn');
  expect(profile).toBeInTheDocument();

  await act(async () => {
    await user.click(profile);
  });

  const titleprofile = screen.getByText('Profile');
  expect(titleprofile).toBeInTheDocument();
});

describe('testando página recipes', () => {
  it('testa renderização do componente drink', async () => {
    const route = '/drinks';
    // vi.runAllTimersAsync();
    const { user } = renderWithRouterAndRedux(<App />, { initialEntries: [route] });

    const drinksBtn = screen.getByTestId(btnDrinks);
    await user.click(drinksBtn);

    const ordinaryCategory = await screen.findByTestId('Ordinary Drink-category-filter');
    const cocktailCategory = await screen.findByTestId('Cocktail-category-filter');
    const shakeCategory = await screen.findByTestId('Shake-category-filter');
    const otherUnknownCategory = await screen.findByTestId('Other / Unknown-category-filter');
    const cocoaCategory = await screen.findByTestId('Cocoa-category-filter');
    expect(ordinaryCategory).toBeInTheDocument();
    expect(cocktailCategory).toBeInTheDocument();
    expect(shakeCategory).toBeInTheDocument();
    expect(otherUnknownCategory).toBeInTheDocument();
    expect(cocoaCategory).toBeInTheDocument();

    expect(ordinaryCategory).not.toBeChecked();

    await user.click(ordinaryCategory);

    // expect(ordinaryCategory).not.toBeChecked();

    expect(ordinaryCategory).toBeChecked();

    const cardDrink1 = await screen.findByText('3-Mile Long Island Iced Tea');
    screen.debug();
    const cardDrink12 = await screen.findByTestId('11-recipe-card');

    expect(cardDrink1).toBeInTheDocument();
    // expect(cardDrink1).toHaveAttribute('href', '/drinks/15300');
    expect(cardDrink12).toBeInTheDocument();
  });
});
