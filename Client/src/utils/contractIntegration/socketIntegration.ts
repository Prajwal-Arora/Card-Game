import { io } from "socket.io-client";
import { setBattleArray, setSocket } from "../../store/reducer/userReducer";
import { End_point } from "../constant/Address";
import { connectionOptions } from "../constant/constant";

let socket: any;

export const socketCreateIntegration = (
  dispatch: any,
  options: {
    account: any;
    amount: string;
    teamSelect: string;
    onCreation?: any;
  }
) => {
  socket = io(End_point, connectionOptions);
  dispatch(setSocket(socket));
  const { account, amount, teamSelect, onCreation } = options;
  const payload = {
    p1: account,
    xVemp: amount,
    team: teamSelect,
  };
  socket?.on("connect", () => {
    socket?.emit("createBattleRoom", JSON.stringify(payload), () => {
      console.log("!! we are in callback due to empty account !!");
    });
  });

  socket?.on("p1xObj", (obj: any) => {
    const battleObj = JSON.parse(obj);
    dispatch(setBattleArray(battleObj));
    if (onCreation) {
      onCreation();
    }
  });
};

export const socketJoinIntegration = (
  dispatch: any,
  options: { account?: any; onJoin?: Function } = {}
) => {
  socket = io(End_point, connectionOptions);
  dispatch(setSocket(socket));
  socket?.on("connect", () => {
    socket?.emit("getArray");
  });

  socket?.on("arrayOnJoin", (array: any) => {
    const battleArray = JSON.parse(array);
    const requiredBattleArray = battleArray.filter(
      (value: any) => value.player2 === ""
    );
    dispatch(setBattleArray(requiredBattleArray));
    if (options.onJoin) {
      options.onJoin();
    }
  });
};

export function isSocketIO(socket: any) {
  return !!(
    typeof socket.join === "function" ||
    socket.rooms ||
    socket.handshake
  );
}
