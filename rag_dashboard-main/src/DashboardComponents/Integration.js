
import { useNavigate } from 'react-router-dom';

function GenAI() {
    const Navigate = useNavigate();
    const handleClick = () => {
        Navigate('/Overview');
    }
    return (
        <div className="comp_dashboard">
            <h1 className="component1">GenAI Section is still under Development</h1>
            <h2 className="component2">Click Below to go back to Overview</h2>
            <button className="component3" onClick={handleClick}>Click here</button>
        </div>
    );
}

export default GenAI;