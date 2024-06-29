import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from '../utils/renderWith';
import App from '../App';
import { search, buttonSeach } from './App.test';

// **FALTA DESCOBRIR O QUE TESTAR NA LINHA 20 APENAS**

const headerContainer = 'header-container';
describe('testando se o componente Header funciona corretamente', () => {
  beforeEach(() => {
    const route = '/meals';
    renderWithRouterAndRedux(<App />, { initialEntries: [route] });
  });

  it('testando se o Header não se encontra na tela de Login', () => {
    const header = screen.queryByTestId(headerContainer);
    expect(header).not.toBeInTheDocument();
  });

  it('testando Header/ meals', async () => {
    const routeTitle = screen.getByTestId('page-title');
    const textoMeals = screen.getByText('Você está na tela de receitas de comidas');
    expect(routeTitle.textContent).toBe('Meals');
    expect(routeTitle).toBeInTheDocument();
    expect(textoMeals).toBeInTheDocument();
    // TESTANDO SE O PROFILE ESTÁ NA TELA E SEU FUNCIONAMENTO
    const profileBtn = screen.getByTestId('profile-top-btn');
    expect(profileBtn).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(profileBtn);
    });

    const profileTitle = screen.getByRole('heading', { name: 'Profile' });
    expect(profileTitle.textContent).toBe('Profile');
    expect(profileTitle).toBeInTheDocument();
    // TESTANDO SE FOOTER ESTÁ NA PÁGINA E SE REDIRECIONA PARA A ROTA DRINKS APÓS O CLICK
    const iconDrinks = screen.getByTestId('drinks-bottom-btn');
    expect(iconDrinks).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(iconDrinks);
    });
    const titleDrink = screen.getByRole('heading', { name: 'Drinks' });
    expect(titleDrink.textContent).toBe('Drinks');
    expect(titleDrink).toBeInTheDocument();
    const searchBtn = screen.getByTestId(search);
    expect(searchBtn).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(searchBtn);
    });
    // TESTA SE O BTN SEARCH APARECE NA PÁGINA DRINKS
    const pesquisar = screen.getByTestId('search-input');
    expect(pesquisar).toBeInTheDocument();
    const ingrediente = screen.getByTestId('ingredient-search-radio');
    expect(ingrediente).toBeInTheDocument();
    const name = screen.getByTestId('name-search-radio');
    expect(name).toBeInTheDocument();
    const letter = screen.getByTestId('first-letter-search-radio');
    expect(letter).toBeInTheDocument();
    const searchButton = screen.getByTestId(buttonSeach);
    expect(searchButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(searchBtn);
    });
    await act(async () => {
      await userEvent.click(name);
      await userEvent.type(pesquisar, 'A1');
      await userEvent.click(searchButton);
    });
  });
  it('testando renderização de title', async () => {
    const title = screen.getByTestId('page-title');
    const iconDrinks = screen.getByTestId('drinks-bottom-btn');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/Meals/i);
    expect(iconDrinks).toBeInTheDocument();
    await userEvent.click(iconDrinks);
    const header = await screen.findByRole('heading', { name: /Drinks/i });
    expect(header).toBeInTheDocument();
  });
});

describe('testando se o componente Header funciona corretamente', () => {
  it('testando se o Header se encontra na tela de Recipes', () => {
    const route = '/favorite-recipes';
    renderWithRouterAndRedux(<App />, { initialEntries: [route] });

    const header = screen.queryByTestId(headerContainer);
    expect(header).not.toBeInTheDocument();
  });

  it('testando se o Header se encontra na tela de DoneRecipes', () => {
    const route = '/done-recipes';
    renderWithRouterAndRedux(<App />, { initialEntries: [route] });

    const header = screen.queryByTestId(headerContainer);
    expect(header).not.toBeInTheDocument();
  });
});
