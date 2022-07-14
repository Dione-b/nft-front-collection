import React, { useEffect, useState } from "react"
import "./styles/App.css"
import twitterLogo from "./assets/twitter-logo.svg"
import openseaLogo from "./assets/opensea.png"
import { ethers } from "ethers"
import myEpicNft from "./utils/MyEpicNFT.json"

// endereço do contrato
const CONTRACT_ADDRESS = "0xd14777c6C15774f9d812aa96507551F271700B9a"

// Constants
const TWITTER_HANDLE = "Diiibastos"
const OPENSEA_HANDLE = "OpenSea"
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`
const OPENSEA_LINK = `https://testnets.opensea.io/collection/marvels-hero-vilain-ubydeiiilk`
const TOTAL_MINT_COUNT = 50


const App = () => {
  /*
   * Só uma variável de estado que usamos pra armazenar nossa carteira pública. Não esqueça de importar o useState.
   */
  let totalMinted = 0;
  const [currentAccount, setCurrentAccount] = useState("")
  const [mintTotal, setMintTotal] = useState(totalMinted)

  const checkIfWalletIsConnected = async () => {
    /*
     * Primeiro tenha certeza que temos acesso a window.ethereum
     */
    const { ethereum } = window
    if (!ethereum) {
      console.log("Certifique-se que você tem metamask instalado!")
      return
    } else {
      console.log("Temos o objeto ethereum!", ethereum)
    }
    /*
     * Checa se estamos autorizados a carteira do usuário.
     */
    const accounts = await ethereum.request({ method: "eth_accounts" })
    /*
     * Usuário pode ter múltiplas carteiras autorizadas, nós podemos pegar a primeira que está lá!
     */
    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log("Encontrou uma conta autorizada:", account)
      setCurrentAccount(account)

      // Setup listener! Isso é para quando o usuário vem no site
      // e já tem a carteira conectada e autorizada
      setupEventListener()
    } else {
      console.log("Nenhuma conta autorizada foi encontrada")
    }
  }
  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert("Baixe o Metamask!")
        return
      }
      /*
       * Método chique para pedir acesso a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })
      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizar o Metamask.
       */
      console.log("Conectado", accounts[0])
      setCurrentAccount(accounts[0])

      // Setup listener! Para quando o usuário vem para o site
      // e conecta a carteira pela primeira vez
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalNFTsMintedSoFar = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicNft.abi,
      provider
    );
  let count = await connectedContract.getTotalNFTsMintedSoFar();
  const total = parseInt(count._hex.substring(2), 16);
  console.log("minted", total);
  setMintTotal(total);
};

  // Setup do listener.
  const setupEventListener = async () => {
    // é bem parecido com a função
    try {
      const { ethereum } = window

      if (ethereum) {
        // mesma coisa de novo
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        // Aqui está o tempero mágico.
        // Isso essencialmente captura nosso evento quando o contrato lança
        // Se você está familiar com webhooks, é bem parecido!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          alert(
            `Ei! Nós cunhamos seu NFT e o enviamos para sua carteira. Pode estar em branco agora. Pode levar no máximo 10 minutos para aparecer no OpenSea. Aqui está o link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        })

        console.log("Setup event listener!")
      } else {
        console.log("Objeto ethereum não existe!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        let nftTxn = await connectedContract.makeAnEpicNFT()
        console.log("Vai abrir a carteira agora para pagar o gás...")
        
        console.log("Cunhando...espere por favor.")
        await nftTxn.wait()
        console.log(`Cunhado, veja a transação: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
        setInterval(() => {
          document.location.reload(true);
        }, 1000);
      } else {
        console.log("Objeto ethereum não existe!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Métodos para Renderizar
  const renderNotConnectedContainer = () => (
    <button
    onClick={connectWallet}
    className="cta-button connect-wallet-button"
  >
    Conectar carteira
  </button>
  )
  /*
   * Isso roda nossa função quando a página carrega.
   */
  useEffect(() => {
    checkIfWalletIsConnected()
    getTotalNFTsMintedSoFar()
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção de NFT</p>
          <p className="sub-text">Exclusivos! Maravilhosos! Únicos! Descubra seu NFT hoje.</p>
          <div className="sub-text benefit_2">
              <div style={{ fontSize: "1.5em" }}>
                {mintTotal}/{TOTAL_MINT_COUNT}
              </div>
              NFTs mintados
          </div>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button mint-button">
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
          >{`feito com ❤️ por @${TWITTER_HANDLE}`}</a>

          <img alt="Opensea Logo" className="opensea-logo" src={openseaLogo} />
            <a
              className="opensea-text"
              href={OPENSEA_LINK}
              target="_blank"
              rel="noreferrer"
            >{`Disponível em @${OPENSEA_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App