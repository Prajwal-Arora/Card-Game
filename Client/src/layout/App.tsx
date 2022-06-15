import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useAppDispatch } from "../store/store";
import RiskFactor from "../components/RiskFactor";
import JoinRoom from "../components/Home/JoinRoom/JoinRoom";
import GameWinner from "../components/Game/GamePlay/GameWinner/GameWinner";
import WalletConnection from "../components/Home/WalletConnection";
import PageLoader from "../components/common/PageLoader";
import BackgroundImg from "../common/BackgroundImg";
import { ToastContainer } from "react-toastify";
import LeaderBoard from "../components/Home/LeaderBoard";
import { connectSocket } from "../utils/SocketCommon";
import Welcome from '../components/Home/LoginSignup/Welcome'
import Login from '../components/Home/LoginSignup/Login'
import Signup from '../components/Home/LoginSignup/Signup'
import Routes from "../utils/config/constant/Routes";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import GameHistory from "../components/Home/GameHistory";
import ChattingBox from "../common/ChattingBox";

const CardList = lazy(() => import("../components/Game/CardList"));
const GamePlay = lazy(() => import("../components/Game/GamePlay"));
const CreateRoom = lazy(
  () => import("../components/Home/CreateRoom/CreateRoom")
);


function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const connect = async () => {
      connectSocket(dispatch)
    };
    connect();
  }, [dispatch]);

  window.onoffline = function () {
    return "You are offline";
  };

  window.onbeforeunload = function() {
    return true
  }

  return (
    <Router>
      <BackgroundImg />
      <ChattingBox/>
      <WalletConnection />
      <ToastContainer
        toastClassName="toastr"
        hideProgressBar={true}
        progressClassName="toastProgress"
      />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <PublicRoute exact path={Routes.HOME} component={Welcome} />
          <PublicRoute exact path={Routes.LOGIN} component={Login} />
          <PublicRoute exact path={Routes.SIGNUP} component={Signup} />
          <PrivateRoute exact path={Routes.CREATE_ROOM} component={CreateRoom} />
          <PrivateRoute exact path={Routes.GAME_PLAY} component={GamePlay} />
          <PrivateRoute exact path={Routes.READY} component={RiskFactor} />
          <PrivateRoute exact path={Routes.JOIN_ROOM} component={JoinRoom} />
          <PrivateRoute exact path={Routes.CARD_SELECTION} component={CardList} />
          <PrivateRoute exact path={Routes.GAME_WINNER} component={GameWinner} />
          <PrivateRoute exact path={Routes.BATTLE_HISTORY} component={GameHistory} />
          
          <Route exact path="/leaderboard" component={LeaderBoard} />

        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
