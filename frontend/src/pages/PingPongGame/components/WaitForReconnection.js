import "./waitforreconnection.css"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const WaitForReconnection = ({ opponent }) => {
    return (
        <div className="reconnection-modal">
            <img src={`${BACKEND_URL}${opponent.avatar}`} alt="" className="opponent-avatar"/>
            <h2 className="opponent-username">{opponent.username}</h2>
            <h2 className="reconnection-title">Waiting For Your Opponent to Get Back ...</h2>
        </div>
    );
}

export default WaitForReconnection;