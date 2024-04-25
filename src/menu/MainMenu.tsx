import './MainMenu.css'
import PC from '../img/PC_icon.jpg'
import Mobile from '../img/Mobile_icon.jpg'
import { Link } from 'react-router-dom';

export const MainMenu = () => {
    return (
        <>
            <h1>Wybierz wersję gry!</h1>
            <div className="tiles-container">
                <Link to="/pc-sg" className="tile">
                    <img src={PC} alt="Brak" className="tile-image" />
                    <p className="tile-name">Space Game PC</p>
                </Link>
                <Link to="/mobile-sg" className="tile">
                    <img src={Mobile} alt="Brak" className="tile-image" />
                    <p className="tile-name">Space Game Mobile</p>
                </Link>
            </div>
        </>
    )
}
