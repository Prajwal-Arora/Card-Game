import { toast } from "react-toastify";
import { setBattleArray, setSocket } from "../../store/reducer/userReducer";


export const socketCreateIntegration = (
  dispatch: any,
  options: {
    account: any;
    teamSelect: string;
    onCreation?: any;
    socket?:any
  }
) => {
  const { account, teamSelect, onCreation,socket } = options;
  const payload = {
    p1: account,
    team: teamSelect,
  };
 
  if (socket) {
    // socket.connect();
    socket?.emit("createBattleRoom", JSON.stringify(payload), () => {
      console.log("!! we are in callback due to empty account !!");
    });

    socket?.on("p1xObj", (obj: any) => {
      socket.emit('telegram',account)
      const battleObj = JSON.parse(obj);
      dispatch(setBattleArray(battleObj));
      if (onCreation) {
        onCreation();
      }
    });

  }
};

export const socketJoinIntegration = (
  dispatch: any,
  options: { account?: any; roomFilled?: any,socket?:any },
) => {
  const {  roomFilled,socket } = options;
  if(socket){
  // socket.connect();
  socket?.emit("getArray");
  socket?.on("arrayOnJoin", (array: any) => {
    const battleArray = JSON.parse(array);
    const requiredBattleArray = battleArray.filter(
      (value: any) => value.player2 === ""
    );
    dispatch(setBattleArray(requiredBattleArray));
  });

  socket.on("roomFull", () => {
    toast("Room already full")
    roomFilled()
  })
}
};

export function isSocketIO(socket: any) {
  return !!(
    typeof socket.join === "function" ||
    socket.rooms ||
    socket.handshake
  );
}
