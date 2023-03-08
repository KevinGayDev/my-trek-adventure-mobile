import { useNavigate } from "react-router-dom";
import emptyStar from "../pictures/ico_emptyStar.png";
import fullStar from "../pictures/ico_fullStar.png";

import Button from "./atoms/Button";

function Parcours ({picture, name, duration, description, price, difficulty, slug}) 
{
  let difficultyLevel;
  const navigate = useNavigate();

  function goToParcoursPage ()
  {
    console.log(slug);
    navigate('/parcours-page/'+slug);
  }

  async function setDifficulty (difficulty)
  {
    switch (difficulty)
    {
      case 1:
        difficultyLevel = "Facile";
        break;
      case 2:
        difficultyLevel = "Moyen";
        break;
      case 3:
        difficultyLevel = "Difficile";
        break;
      default:
      break;
    }
    return difficultyLevel;
  }

  setDifficulty(difficulty);

  return (
    <div id="post">
      <div><img className = "parcoursImage" src = {picture} alt = "Photos du parcours"></img></div>
      <div className="content">
          <div className="gameInfos">
            <p><span className="userInfo">Nom :</span> {name} </p>
            <p><span className="userInfo">Durée :</span> {duration} jours</p>
            <p><span className="userInfo">Prix :</span> {price} €</p>
            {difficulty === 1 && (
              <p><span className="userInfo">Difficulté :</span> <img src = {fullStar} alt = "Etoile Pleine" /><img src = {emptyStar} alt = "Etoile Vide"/> <img src = {emptyStar} alt = "Etoile Vide"/> ({difficultyLevel})</p>
            )}
            {difficulty === 2 && (
              <p><span className="userInfo">Difficulté :</span> <img src = {fullStar} alt = "Etoile Pleine" /><img src = {fullStar} alt = "Etoile Pleine"/> <img src = {emptyStar} alt = "Etoile Vide"/> ({difficultyLevel})</p>
            )}
            {difficulty === 3 && (
              <p><span className="userInfo">Difficulté :</span> <img src = {fullStar} alt = "Etoile Pleine" /><img src = {fullStar} alt = "Etoile Pleine"/> <img src = {fullStar} alt = "Etoile Pleine"/> ({difficultyLevel})</p>
            )}
          </div>
          <div className="gameInfos">
            <p><span className="userInfo">Description :</span> {description}</p>
          </div>
          <div className="gameInfos">
            <Button onClick = {goToParcoursPage}>Voir le parcours</Button>
          </div>
      </div>  
    </div> 
  );
}

export default Parcours;