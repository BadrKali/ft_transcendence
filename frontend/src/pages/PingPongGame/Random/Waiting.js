import './random.css';
import './waiting.css';

const Waiting = () => {
    return (
        <div className="waiting-container">
            <div className="spinner"></div>
            <h1>Searching for a Player ...</h1>
        </div>
    );
}
 
export default Waiting;