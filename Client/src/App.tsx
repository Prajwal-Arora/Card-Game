import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import CreateRoom from './components/Home/CreateRoom';
import JoinRoom from './components/Home/JoinRoom';
import WalletConnection from './components/Home/WalletConnection';
import Welcome from './components/Home/Welcome';
import RiskFactor from './components/RiskFactor';
import { useAppDispatch } from './store/store';
import { fetchWallewPublicDataAsync } from './utils/contractIntegration/walletIntegration';

function App() {
  const dispatch = useAppDispatch();


  useEffect(() => {
    const connect = async () => {
      await fetchWallewPublicDataAsync(dispatch)
    }
    connect()

  }, [dispatch])

  return (
    <Router>
      <WalletConnection />
      <Switch>
        <Route path="/" exact>
          <Welcome />
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
      </Switch>
    </Router>
  );
}

export default App;
