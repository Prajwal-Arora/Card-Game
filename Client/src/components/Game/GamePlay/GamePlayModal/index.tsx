import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DiscardedPileModal from "./DiscardedPileModal";
import EmploratorsModal from "./ExploratorsModal";
import LegionModal from "./LegionModal";
import RoundModal from "./RoundModal";

const GamePlayModal = ({
  roundModalDraw,
  setIsDraw,
  isDraw,
  battleListOpponent,
  setOpenExploratoryModal,
  openExploratoryModal,
  opponentPlayedDeck,
  legion,
  discardedPile,
  currentSelectedCard,
  handleChangeTurnCardEmit,
  setOpenLegion,
  openLegion,
  setOpenDiscardedPile,
  openDiscardedPile,
  ownerAccount,
  socket,
  account,
  gameWinner,
  round,
  winnerRound,
}: any) => {
  const [legionData, setLegionData] = useState<any>();


  return (
    <>
      <RoundModal
        roundModalDraw={roundModalDraw}
        isDraw={isDraw}
        winnerRound={winnerRound}
        round={round}
        gameWinner={gameWinner}
        account={account}
      />
     {openDiscardedPile&& <DiscardedPileModal
        legionData={legionData}
        discardedPile={discardedPile}
        currentSelectedCard={currentSelectedCard}
        handleChangeTurnCardEmit={handleChangeTurnCardEmit}
        setOpenDiscardedPile={setOpenDiscardedPile}
        openDiscardedPile={openDiscardedPile}
        ownerAccount={ownerAccount}
        account={account}
      />}
     {openLegion&& <LegionModal
        socket={socket}
        setIsDraw={setIsDraw}
        isDraw={isDraw}
        discardedPile={discardedPile}
        setLegionData={setLegionData}
        legion={legion}
        currentSelectedCard={currentSelectedCard}
        handleChangeTurnCardEmit={handleChangeTurnCardEmit}
        ownerAccount={ownerAccount}
        account={account}
        setOpenLegion={setOpenLegion}
        openLegion={openLegion}
      />}
      {openExploratoryModal&&<EmploratorsModal
        currentSelectedCard={currentSelectedCard}
        account={account}
        handleChangeTurnCardEmit={handleChangeTurnCardEmit}
        openExploratoryModal={openExploratoryModal}
        ownerAccount={ownerAccount}
        setOpenExploratoryModal={setOpenExploratoryModal}
        battleListOpponent={battleListOpponent}
      />}
    </>
  );
};

export default GamePlayModal;
