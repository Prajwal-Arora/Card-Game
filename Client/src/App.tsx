import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import { useAppDispatch } from "./store/store";

import { fetchWalletPublicDataAsync } from "./utils/contractIntegration/walletIntegration";
import RiskFactor from "./components/RiskFactor";
import JoinRoom from "./components/Home/JoinRoom/JoinRoom";
import GameHistory from "./components/Home/GameHistory/GameHistory";
import GameWinner from "./components/Game/GamePlay/GameWinner/GameWinner";
import WalletConnection from "./components/Home/WalletConnection";
import PageLoader from "./components/common/PageLoader";
import BackgroundImg from "./common/BackgroundImg";
import { toast, ToastContainer } from "react-toastify";
import { apiHandler } from "./services/apiService/axios";
import { getLeaderBoard } from "./services/apiService/userServices";
import LeaderBoard from "./components/Home/LeaderBoard";
const CardList = lazy(() => import('./components/Game/CardList'))
const GamePlay = lazy(() => import('./components/Game/GamePlay'))
const CreateRoom = lazy(() => import('./components/Home/CreateRoom/CreateRoom'))


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
    fetch(
      "https://api.opensea.io/api/v1/assets?owner=0x60db761b4f5444fa8455a5ddb66e5ba841f6e5ed&asset_contract_address=0x495f947276749Ce646f68AC8c248420045cb7b5e&order_direction=desc&offset=0&limit=20&collection=vempire-the-founding-soldiers"
    )
      .then((response) => response.json())
      .then((response) => {
        const userNFT = [];
        for (let i = 0; i < response.assets.length; i++) {
          userNFT.push(
            response.assets[i].name.split(" - ")[1].replace(" ", "_")
          );
        }
      })
      .catch((err) => console.error(err));
    const connect = async () => {
      await fetchWalletPublicDataAsync(dispatch);
    };
    connect();
  }, [dispatch]);

  return (
    <Router>
      <BackgroundImg />
      <WalletConnection />
      <ToastContainer toastClassName="toastr" hideProgressBar={true} progressClassName="toastProgress"/>
      <Suspense fallback={<PageLoader/>}>
      <Switch>
        <Route path="/" exact>
          <CreateRoom />
        </Route>
        <Route path="/game-play/:data" exact>
          <GamePlay />
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
        <Route path="/game-winner" exact>
          <GameWinner />
        </Route>
        <Route path="/leaderboard" exact>
          <LeaderBoard />
        </Route>
      </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
