import React from "react";
import group34 from "../src/vector-sleep-active.svg";
import group from "../src/group.png";
import vector5 from "../src/vector-5.svg";
import vector6 from "../src/vector-6.svg";
import vector7 from "../src/vector-7.svg";

const MenuGroup = ({
  onMenuClickAccount,
  onMenuClickSleep, 
  onMenuClickMain,
  onMenuClickStatistic,
  onMenuClickChat,
}) => {
  return (
    <div className="menu-group div-2">
      <div className="view-2">
        <img 
          className="vector-5" 
          alt="Vector" 
          src={vector5} 
          onClick={onMenuClickStatistic}
        />
        <div className="group-wrapper">
          <img 
            className="group-3" 
            alt="Group" 
            src={group34} 
            onClick={onMenuClickSleep}
          />
        </div>
        <img
          className="vector-6"
          alt="Vector"
          src={vector6}
          onClick={onMenuClickMain}
          style={{ cursor: "pointer" }}
        />
        <img 
          className="vector-7" 
          alt="Vector" 
          src={vector7} 
          onClick={onMenuClickAccount}
        />
        <img 
          className="group-4" 
          alt="Group" 
          src={group} 
          onClick={onMenuClickChat}
          />
      </div>
    </div>
  );
};

export default MenuGroup;
