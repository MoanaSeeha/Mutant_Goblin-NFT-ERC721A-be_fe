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
  const[remainingCount,setRemainingCount] = useState(9999);

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

  useEffect(() => {
    async function fetchData() {
      let m = Number(await contract.maxSupply());
      let t = Number(await contract.totalSupply());
      setRemainingCount(m-t);
    }
    fetchData();
    
  }, [contract])

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
          <img alt='' src={`${process.env.PUBLIC_URL}/images/Transparent_File-01.png`} style={{
            width: '100%',
            maxWidth: '800px'
          }}/>
        <div className="description">
          <p style={{fontSize: 'xx-large'}}>AAAAAAAAUUUUGGGGGHHHHH.. city contaminated.. all degens become fucking mutants.. AAAAAAAAAAAUUUUUUGGGGGGHHHH.. join us now already..</p>
          First mint is FREE.
          <br/>
          After that it's 0.0042 ETH per mutant goblin.
          <br/>
          721A contract so gas is cheaper if you mint 2 or more.
          <br/>
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
        <p style={{display: 'flex'}}>{remainingCount} out of 9999 of these fuckers left.. <img alt='' src={`${process.env.PUBLIC_URL}/images/etherscan.c49ca24.svg`} width={'30px'} style={{margin: '0 10px', cursor: 'pointer'}}/></p>
      </div>
        </div>
        
    </>
  );
}
