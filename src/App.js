import React,{ useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAlert } from 'react-alert'

import Loading from "./components/loading";

import nft_abi from "./MutantGoblins_abi.json";

const NFT_address = `0xe7069c464f585971899650a37b260b7C55a4aE78`;

export default function App() {

  const [account, setAccount] = useState('');
  const [connected_chain, setChain] = useState('');
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(NFT_address, nft_abi, signer);
  const alert = useAlert()

  useEffect(() => {
    async function fetchData() {
      setAccount('')
    }
    fetchData();
  }, [])

  const connect = async () => {
    if(account === '') {
      // await window.ethereum.send("eth_requestAccounts");
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
        setLoading(true);
        let mintedCount = (await contract.mintedCount(account)).toString();
        let _amount = amount
        console.log(mintedCount, account);
        if(mintedCount === '0') {
          _amount--;
        }

        let _cost = await contract.cost();
        // _cost = _cost.toString();
        console.log(_amount);
        let fee = (_cost * _amount).toString();
        console.log(_amount);
        const transaction = await contract.mint(amount, { value: fee })
        await transaction.wait();
        setLoading(false);
        alert.show("Welcome successfully Minted!", {
          type: 'success'
        });
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
      setLoading(false);
    } catch (err) {
      console.log('err', err)
      if (err.data !== undefined && err.data.message !== undefined) 
        alert.show(err.data.message.err, {
          type: 'error'
        });
      else alert.show(err.message, {
        type: 'error'
      });
      setLoading(false);
    }
  };

  return (
    <>
      {loading?<Loading/>:<></>}
      <button className="wallet_connect" onClick={connect}>
        {account===''?'Connect Wallet':account.substring(0, 5) + '...'+account.substring(account.length-4, account.length)}
      </button>
      <div className="mainbox">
        <div className="border_box">
        <div className="description">
          AAAAAAAUUUUUGGGHHHHH deez ar deffinitly NOOOOTT gobblins GOBLINNNNNNNNns wekm ta goblintown yoo sniksnakr DEJEN RATS oooooh rats are yummmz dis a NEFTEEE O GOBBLINGS on da BLOKCHIN wat? oh. crustybutt da goblinking say GEE EMMM DEDJEN RUTS an queenie saay HLLO SWEATIES ok dats all byeby
          <br/>
          yur first mint is FREE<br/>
          but if yer greedy thenn u can mint moar for .0042<br/>
        </div>
        <div className="button_group">
          <button className="add_button left_button" onClick={() => {
            if(amount > 1) {
              return setAmount(amount-1);
            }
          }}>-</button>
          <p style={{width: '30px', textAlign: 'center', padding: '0 30px'}}>{amount}</p>
          <button className="add_button right_button" onClick={() => {
            if(amount < 20) {
              return setAmount(amount+1);
            }
          }}>+</button>
        </div>
        <button className="mint_button" onClick={mint}>Mint</button> 
      </div>
        </div>
        
    </>
  );
}
