import React from "react";
import "./index.css";

const CardInfoModal = ({ battleCard, css }: any) => {
  return (
    <div className="battle-modal p-3 m-lg-3 m-sm-2" style={css}>
      <div className="gradient-text text-uppercase font-style">
        {battleCard.disPlay_name}-{battleCard.display_class}
      </div>
      <div className="text-white mt-3 font-style">
        Strength:{" "}
        <span className="modal-font-weight">{battleCard.strength}</span>
      </div>
      <div className="text-white font-style">
        Ability:{" "}
        <span className="modal-font-weight">{battleCard.ability_desc}</span>
      </div>
    </div>
  );
};

export default CardInfoModal;
