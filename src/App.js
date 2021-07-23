import { useState } from "react";
import RLogin, { RLoginButton } from "@rsksmart/rlogin";
import WalletConnectProvider from "@walletconnect/web3-provider";

import "./App.css";

const rLogin = new RLogin({
  cachedProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          31: "https://public-node.testnet.rsk.co",
        },
      },
    },
  },
  supportedChains: [31], // we are going to connect to rsk testnet for this test
});

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [txHash, setTxHash] = useState("");
  const [signature, setSignature] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  const connect = () =>
    rLogin.connect().then(({ provider }) => {
      setProvider(provider);
      provider
        .request({ method: "eth_accounts" })
        .then(([account]) => setAccount(account));
    });

  const logout = () => {
    window.location.reload(false);
  };

  const getBalance = () =>
    provider
      .request({
        method: "eth_getBalance",
        params: [account],
      })
      .then(setBalance);

  const faucetAddress = "0x88250f772101179a4ecfaa4b92a983676a3ce445";
  const sendTransaction = () =>
    provider
      .request({
        method: "eth_sendTransaction",
        params: [{ from: account, to: faucetAddress, value: "100000" }],
      })
      .then(setTxHash);

  const message = "Welcome to RIF Identity suite!!!";
  const personalSign = () =>
    provider
      .request({
        method: "personal_sign",
        params: [message, account],
      })
      .then(setSignature);

  return (
    <div className="App">
      <div className="appBody">
        <RLoginButton onClick={connect} className="connectButton">
          Connect Wallet
        </RLoginButton>
        <RLoginButton onClick={logout}>Logout</RLoginButton>
        <p>Wallet Address : {account}</p>
        <hr />
        <button onClick={getBalance} disabled={!account} className="appButton">
          Get Balance
        </button>
        <p>Balance : {balance}</p>
        <hr />
        <input
          type="number"
          className="appInput"
          placeholder="Enter the Amount To Send"
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        <input
          className="appInput"
          placeholder="Enter the Address To Send"
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <button
          onClick={sendTransaction}
          disabled={!account}
          className="appButton"
        >
          Send Transaction
        </button>
      </div>
    </div>
  );
}

export default App;
