import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Certifique-se que você tem metamask instalado!")
      return;
    } else {
      console.log("Temos o objeto ethereum!", ethereum)
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  /*
   * Implemente seu método connectWallet aqui
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Baixe o Metamask!");
        return;
      }
      /*
       * Método chique para pedir acesso a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizar o Metamask.
       */
      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "INSIRA_O_ENDEREÇO_DO_CONTRATO_NA_REDE_RINKEBY";
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        console.log("Vai abrir a carteira agora para pagar o gás...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        console.log("Cunhando...espere por favor.");
        await nftTxn.wait();
        console.log(
          `Cunhado, veja a transação: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Objeto ethereum não existe!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Métodos para Renderizar
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Conectar Carteira
    </button>
  )
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  /*
   * Adicionei um render condicional! Nós não queremos mostrar o Connect to Wallet se já estivermos conectados
   */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção NFT</p>
          <p className="sub-text">
            Únicas. Lindas. Descubra a sua NFT hoje.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={null} className="cta-button connect-wallet-button">
              Cunhar NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`feito com ❤️ pela @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};
export default App;