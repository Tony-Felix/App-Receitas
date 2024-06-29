import DoneRecipes from '../components/DoneRecipesComponent';
import Header from '../components/HeaderProfile/index';

function DoneRecipesPage() {
  return (
    <main
      className="d-flex h-100 flex-column justify-content-start
      align-items-center w-100"
    >
      <Header title="Done Recipes" showSearch={ false } />
      <DoneRecipes />
    </main>
  );
}

export default DoneRecipesPage;
