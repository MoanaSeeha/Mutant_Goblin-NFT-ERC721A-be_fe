import React,{ useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom"
import LoadingIcons, {Oval} from 'react-loading-icons'


import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import busd_abi from "./BUSD_abi.json";
import Laoding from "./components/Loading";
import Loading from "./components/Loading";

const busd_address = `0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56`;

export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const [connected_chain, setChain] = useState('');
  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    setChain('0x'+ window.ethereum?.networkVersion?.toString(16));
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    //We take the first address in the array of addresses and display it
    if (accounts[0]) setAccount (accounts[0]);
    else setAccount('')
  }, []);

  const connect = async () => {
    if(account === '') {
      console.log('unconnected')
      await window.ethereum.send("eth_requestAccounts");
      setChain('0x'+ window.ethereum?.networkVersion?.toString(16));
      accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts[0]) setAccount (accounts[0]);
    }
  }

  const chains = [
    {
      chainId: "0x1",
      rpcUrls: ["https://mainnet.infura.io/v3/"],

    },
    {
      chainId: "0x38",
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      chainName: "Binance",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18
      },
      blockExplorerUrls: ["https://bscscan.com"]
    },
  ]

  const handleSubmit = async (e, chain) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr"),
      chain
    });
  };


  // window.ethereum.on('chainChanged', (_chainId) => setChain('0x'+ window.ethereum.networkVersion.toString(16)));

  const startPayment = async ({ setError, setTxs, ether, addr, chain }) => {

    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await ethers.utils.getAddress(addr);
      console.log('right chain:', connected_chain, chain)
      if((chain === 0 && connected_chain === '0x4') || (chain !== 0 && connected_chain === '0x56')) {

        if (chain < 0) {
          let contract = new ethers.Contract(
            busd_address,
            busd_abi,
            signer
          )
  
          // How many tokens?
          let numberOfTokens = ethers.utils.parseUnits(ether, 18)
          console.log(`numberOfTokens: ${numberOfTokens}`)
  
          // Send tokens
          const sendNativeToken = await contract.transfer(addr, numberOfTokens).then((transferResult) => {
            console.dir(transferResult)
            alert("sent token")
          });
          setLoading(true);
          await sendNativeToken.wait();
          setLoading(false);
          navigate('/success');
        }
        else {
          console.log('send Nativetoken')
          tx = await signer.sendTransaction({
            to: addr,
            value: ethers.utils.parseEther(ether)
          });
          setLoading(true);
          await tx.wait()
          setLoading(false);
          navigate('/success');
          console.log({ ether, addr });
          console.log("tx", tx);
          await setTxs([tx]);
        }
        
      }
      else {
        if (chain * chain === 1) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chains[chain * chain]]
          }).then(() => setChain('0x56'))
        }
        else {
          await window.ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x4` }],
            }).then(() => setChain('0x4'))
        }
        
        console.log(connected_chain)
      }
      

    } catch (err) {
      console.log('err', err)
      if (err.data !== undefined && err.data.message !== undefined) setError(err.data.message);
      else setError(err.message);
    }
  };


  return (
    <>
      {loading?<Loading/>:<></>}
      <button className='wallet_connect' onClick={connect}>{account===''?'Connect Wallet':account}</button>
      <div>{connected_chain}</div>
      <ErrorMessage message={error} />
      <form className="m-4" onSubmit={(e) => handlSubmit(e, 0)}>
        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Ethereum
            </h1>
            <div className="">
              <div className="my-3">
                <input
                  type="text"
                  name="addr"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Recipient Address"
                />
              </div>
              <div className="my-3">
                <input
                  name="ether"
                  type="text"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount "
                />
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              {connected_chain === '0x4'?'Pay':'Switch Network'}
            </button>
            <TxList txs={txs} />
          </footer>
        </div>
      </form>
      <form className="m-4" onSubmit={(e) => handleSubmit(e, 1)}>
        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              BNB
            </h1>
            <div className="">
              <div className="my-3">
                <input
                  type="text"
                  name="addr"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Recipient Address"
                />
              </div>
              <div className="my-3">
                <input
                  name="ether"
                  type="text"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount "
                />
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              {connected_chain === '0x56'?'Pay':'Switch Network'}

            </button>
            <TxList txs={txs} />
          </footer>
        </div>
      </form>
      <form className="m-4" onSubmit={(e) => handleSubmit(e, -1)}>
        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              BUSD
            </h1>
            <div className="">
              <div className="my-3">
                <input
                  type="text"
                  name="addr"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Recipient Address"
                />
              </div>
              <div className="my-3">
                <input
                  name="ether"
                  type="text"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount "
                />
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              {connected_chain === '0x56'?'Pay':'Switch Network'}
            </button>

            <TxList txs={txs} />
          </footer>
        </div>
      </form>
    </>
  );
}
