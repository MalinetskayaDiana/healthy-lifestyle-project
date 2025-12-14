import React from "react";
import line103 from "../../src/line-103.svg";
import vector4 from "../../src/vector-4.svg";
import "../../waterscreenstyle.css";

const WaterRecord = ({ volume = "500 мл", label = "Напиток", onClick }) => {
    return (
        <div className="water-record" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="text-wrapper-5">{volume}</div>
            <div className="text-wrapper-6">{label}</div>
            <img className="line" alt="Line" src={line103} />
            <img className="vector" alt="Vector" src={vector4} />
        </div>
    );
};

export default WaterRecord;