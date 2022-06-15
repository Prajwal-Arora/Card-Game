import { io } from "socket.io-client";
import { getLocalStore, setLocalStore } from "../common/localStorage";
import { setBattleArray, setEventClickable, setSocket } from "../store/reducer/userReducer";
import { handleRedirect } from "./CommonUsedFunction";
import { End_point } from "./config/constant/Address";
import { connectionOptions } from "./config/constant/constant";
import { inactiveMessage, refreshMessage } from "./config/constant/notificationText";

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
  message: string,
  redirectWinner: any,
  history: any
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
    redirectWinner(team, message, history);
  }
};

export const roomDelete = (socket: any, ownerAddress: any, userAddress: any) => {
  if (socket) {
    const array = [ownerAddress, userAddress];
    socket?.emit("clean", JSON.stringify(array));

  }
}



export const refreshCardSelection = (dispatch: any, socket: any, history: any) => {
  if (socket) {
    socket.on("decWin", (obj: any) => {
      const battleObj = JSON.parse(obj);
      setLocalStore('battleArray', battleObj)
      dispatch(setBattleArray(battleObj));
      if (battleObj.winner_g) {
        handleGameVictoryScreen(
          battleObj.winner_g,
          battleObj.player1,
          battleObj.team1,
          inactiveMessage,
          handleRedirect,
          history
        );
      }
    });
    socket.on("afterRefresh", (obj: any) => {
      const battleObj = JSON.parse(obj);
      setLocalStore('battleArray', battleObj)
      dispatch(setBattleArray(battleObj));
      if (battleObj.winner_g) {
        handleGameVictoryScreen(
          battleObj.winner_g,
          battleObj.player1,
          battleObj.team1,
          refreshMessage,
          handleRedirect,
          history
        );
      }
    });
  }
}

export const connectSocket = async (dispatch: any) => {
  let socket = io(End_point, connectionOptions);
  dispatch(setSocket(socket));
};

export const refreshScreen = (owner: any, socket: any) => {
  const arr = [owner, getLocalStore('userName')];
  socket.emit('refresh', JSON.stringify(arr))
}
