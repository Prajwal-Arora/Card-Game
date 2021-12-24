export const handleRoundEnd = (
  currentSelectedCard: any,
  ownerAccount: any,
  account: any,
  turn: any,
  socket: any
) => {
  const arr = [currentSelectedCard, ownerAccount, account, {}];
  const array = [ownerAccount, account];

  if (turn === account) {
    socket.emit("changeTurn", JSON.stringify(arr));
  }
  socket.emit("endClick", JSON.stringify(array));
};

export const handleGameVictoryScreen = (
  gameWinner: string,
  player1: string,
  team1: string,
  redirectWinner: any
) => {
  if (gameWinner !== "") {
    let team;
    if (gameWinner === player1) {
      team = team1;
    } else {
      if (team1 === "Remus") {
        team = "Romulus";
      } else {
        team = "Remus";
      }
    }
    redirectWinner(team);
  }
};
