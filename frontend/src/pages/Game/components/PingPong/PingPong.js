import Underground from './UnderGround';
import PickTools from './PickTools';

const PingPong = () => {
    return (
        <div className="PingPong-container">
            <h1>Choose Your Arena</h1>
            <Underground/>
            <PickTools/>
        </div>
    );
}

export default PingPong;