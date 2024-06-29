import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from '../utils/renderWith';
import App from '../App';

describe('Testa a cobertura de testes da Tela de Login', () => {
  beforeEach(() => {
    renderWithRouterAndRedux(<App />);
  });
  const emailTxt = 'email-input';
  const passwordTxt = 'password-input';
  const btnTxt = 'login-submit-btn';

  it('testa a existencia da pagina e de seus componentes', async () => {
    const buttonEnter = await screen.findByTestId(btnTxt);
    const email = screen.getByTestId(emailTxt);
    const password = screen.getByTestId(passwordTxt);
    expect(buttonEnter).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(buttonEnter).toBeDisabled();

    await act(async () => {
      await userEvent.type(email, 'trybe@teste.com');
      await userEvent.type(password, '1234568fgf');
    });
    expect(buttonEnter).toBeEnabled();
    await act(async () => {
      await userEvent.click(buttonEnter);
    });
    const txtmeals = screen.getByText('Você está na tela de receitas de comidas');
    expect(txtmeals).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /meals/i })).toBeInTheDocument();
  });

  it('Testa se o botão está desabilitado se o email for inválido', async () => {
    const inputEmail = screen.getByTestId(emailTxt);
    const inputPassword = screen.getByTestId(passwordTxt);
    const inputButton = screen.getByTestId(btnTxt);

    expect(inputButton).toBeDisabled();

    await userEvent.type(inputEmail, 'email');
    expect(inputEmail).toHaveValue('email');

    await userEvent.type(inputPassword, '1234567');
    expect(inputPassword).toHaveValue('1234567');
    screen.debug();
    expect(inputButton).toBeDisabled();
  });

  it('Verifica se o botão está desabilitado se a senha for inválida', async () => {
    const inputEmail = screen.getByTestId(emailTxt);
    const inputPassword = screen.getByTestId(passwordTxt);
    const inputButton = screen.getByTestId(btnTxt);

    await userEvent.type(inputEmail, 'teste@gmail.com');
    expect(inputEmail).toHaveValue('teste@gmail.com');

    await userEvent.type(inputPassword, '12356');
    expect(inputPassword).toHaveValue('12356');

    expect(inputButton).toBeDisabled();
  });
});
