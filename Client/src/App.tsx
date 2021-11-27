import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import "./App.css";
import BackgroundVideo from "./common/BackgroundVideo";
import CardList from "./components/Game/CardList";
import GamePlay from "./components/Game/GamePlay";
import CreateRoom from "./components/Home/CreateRoom";
import JoinRoom from "./components/Home/JoinRoom";
import WalletConnection from "./components/Home/WalletConnection";
import Welcome from "./components/Home/Welcome";
import RiskFactor from "./components/RiskFactor";
import { useAppDispatch } from "./store/store";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchWalletPublicDataAsync } from "./utils/contractIntegration/walletIntegration";
import { connectionOptions } from "./utils/constant/constant";
import { setSocket } from "./store/reducer/userReducer";
import GameHistory from "./components/Home/gameHistory";

let socket: any;

function App() {
  const dispatch = useAppDispatch();

  // const connectSocket = async () => {
  //   socket = io(End_point, connectionOptions);
  //   dispatch(setSocket(socket));
  //   socket?.on("connect", (data: any, payload: any) => {
  //     console.log("connected", { data, payload });
  //   });
  // };

  useEffect(() => {
    const connect = async () => {
      await fetchWalletPublicDataAsync(dispatch);
    };
    connect();
    // connectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Router>
      <BackgroundVideo />
      <WalletConnection />
      <Switch>
        <Route path="/" exact>
          <Welcome />
        </Route>
        <Route path="/game-play/:data" exact>
          <GamePlay />
        </Route>
        <Route path="/create-room" exact>
          <CreateRoom />
        </Route>
        <Route path="/risk-factor" exact>
          <RiskFactor />
        </Route>
        <Route path="/join-room" exact>
          <JoinRoom />
        </Route>
        <Route path="/cards-selection/:data" exact>
          <CardList />
        </Route>
        <Route path="/battle-history" exact>
          <GameHistory />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
