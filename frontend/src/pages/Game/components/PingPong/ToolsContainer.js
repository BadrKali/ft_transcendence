import React from "react";
import PickTools from "./PickTools";
import Keys from "./Keys";

const ToolsContainer = ( {className }) => {
    return (
        <div className={className}>
            {/* <Keys className="keys-container"/> */}
            <PickTools className="paddle-container"/>
        </div>
    );
}
 
export default ToolsContainer;