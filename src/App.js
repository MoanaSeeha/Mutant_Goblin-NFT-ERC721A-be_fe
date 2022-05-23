import React,{ useState, useEffect } from "react";
import { ethers } from "ethers";

import Loading from "./components/loading";

import nft_abi from "./MutantGoblins_abi.json";

const NFT_address = `0xc796F98C940151e77bE98f0B0209fB70d623454D`;

export default function App() {

  const [account, setAccount] = useState('');
  const [connected_chain, setChain] = useState('');
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(NFT_address, nft_abi, signer);

  useEffect(() => {
    async function fetchData() {
      setAccount('')
    }
    fetchData();
  }, [])

  const connect = async () => {
    if(account === '') {
      console.log('unconnected')
      await window.ethereum.send("eth_requestAccounts");
      setChain('0x'+ window.ethereum?.networkVersion?.toString(16));
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {}
          }
        ]
      });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts[0]) setAccount (accounts[0]);
    }
    else {
      setAccount('');
    }
  }

  const mint = async () => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      if(connected_chain === '0x4' && account !== '') {
        let mintedCount = await contract.mintedCount(account);
        let _amount = amount
        if(mintedCount === 0) {
          _amount--;
        }

        let _cost = await contract.cost();
        // _cost = _cost.toString();
        console.log(_cost);
        let fee = (_cost * amount).toString();
        console.log(fee);
        const transaction = await contract.mint(_amount, { value: fee })
        setLoading(true);
        await transaction.wait();
        setLoading(false);
      }
      else if(connected_chain !== '0x4') {
        await window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x4` }],
          }).then(() => setChain('0x4'))
        console.log(connected_chain)
      }
      if(account === '') {
        if(window.confirm('You Should Connect Wallet First!')) connect();
      }

    } catch (err) {
      console.log('err', err)
    }
  };

  return (
    <>
      {loading?<Loading/>:<></>}
      <button className="wallet_connect" onClick={connect}>
        {account===''?'Connect Wallet':account.substring(0, 5) + '...'+account.substring(account.length-4, account.length)}
      </button>
      <div className="mainbox">
        <div className="description">
          AAAAAAAUUUUUGGGHHHHH deez ar deffinitly NOOOOTT gobblins GOBLINNNNNNNNns wekm ta goblintown yoo sniksnakr DEJEN RATS oooooh rats are yummmz dis a NEFTEEE O GOBBLINGS on da BLOKCHIN wat? oh. crustybutt da goblinking say GEE EMMM DEDJEN RUTS an queenie saay HLLO SWEATIES ok dats all byeby
          <br/>
          yur first mint is FREE<br/>
          but if yer greedy thenn u can mint moar for .0042<br/>
        </div>
        <div className="button_group">
          <button className="add_button" onClick={() => {
            if(amount > 1) {
              return setAmount(amount-1);
            }
          }}>-</button>
          <p style={{width: '30px', textAlign: 'center'}}>{amount}</p>
          <button className="add_button" onClick={() => setAmount(amount+1)}>+</button>
        </div>
        <button className="mint_button" onClick={mint}>Mint</button> 
      </div>
    </>
  );
}
