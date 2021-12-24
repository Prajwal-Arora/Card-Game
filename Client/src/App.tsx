import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import { useAppDispatch } from "./store/store";

import { fetchWalletPublicDataAsync } from "./utils/contractIntegration/walletIntegration";
// import CreateRoom from "./components/Home/CreateRoom";
import RiskFactor from "./components/RiskFactor";
import JoinRoom from "./components/Home/JoinRoom";
import GameHistory from "./components/Home/gameHistory";
import GameWinner from "./components/Home/GameWinner/GameWinner";
import BackgroundVideo from "./common/BackgroundVideo";
import WalletConnection from "./components/Home/WalletConnection";
import {  ToastContainer } from "react-toastify";
const CardList = lazy(() => import('./components/Game/CardList'))
const GamePlay = lazy(() => import('./components/Game/GamePlay'))
const CreateRoom = lazy(() => import('./components/Home/CreateRoom'))



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
        console.log(userNFT, "userNFT");
      })
      .catch((err) => console.error(err));
    const connect = async () => {
      await fetchWalletPublicDataAsync(dispatch);
    };
    connect();
  }, [dispatch]);

  return (
    <Router>
      <BackgroundVideo />
      <WalletConnection />
      <ToastContainer toastClassName="toastr" progressClassName="toastProgress"/>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
