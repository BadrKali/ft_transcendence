import "./waitforreconnection.css"

const WaitForReconnection = ({ opponent }) => {
    return (
        <div className="reconnection-modal">
            <img src={`http://127.0.0.1:8000${opponent.avatar}`} alt="" className="opponent-avatar"/>
            <h2 className="opponent-username">{opponent.username}</h2>
            <h2 className="reconnection-title">Waiting For Your Opponent to Get Back ...</h2>
        </div>
    );
}

export default WaitForReconnection;