import React from "react";
import "./index.css";

const CardInfoModal = ({ battleCard }: any) => {
  return (
    <div className="battle-modal p-3">
      <div className="gradient-text text-uppercase font-style">
        {battleCard.name}-{battleCard.class}
      </div>
      <div className="text-white mt-3 font-style">
        Strength:{" "}
        <span className="modal-font-weight">{battleCard.strength}</span>
      </div>
      <div className="text-white font-style">
        Ability: <span className="modal-font-weight">{battleCard.ability}</span>
      </div>
    </div>
  );
};

export default CardInfoModal;
