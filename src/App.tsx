import { Component, createEffect, createMemo } from "solid-js";

import {InjectedConnector} from '@web3-react/injected-connector'
import {solidWeb3, Web3Provider} from '@chiuzon/solidweb3'

import {ethers} from 'ethers'

const injectedConnector = new InjectedConnector({supportedChainIds: [41]})

const rpcProvider = new ethers.providers.JsonRpcProvider("https://testnet.telos.net/evm")

const useWeb3 = () => {
  const { library } = solidWeb3()
  
  return createMemo(() => {
      return library() || rpcProvider
  })
}

const ERC20Abi = [
  "function balanceOf(address) external view returns(uint256)"
]

const erc20Contract = (address: string) => {
  const lib = useWeb3()

  if(!ethers.utils.getAddress(address)){
    return undefined
  }

  return createMemo(() => {
    return new ethers.Contract(address, ERC20Abi, lib())
  })
}

const InnerApp: Component = () => {
  const {activate, library, account} = solidWeb3()
  
  const web3Lib = useWeb3()

  createEffect(() => {
    console.log(web3Lib())
  })

  async function connectButton() {
    await activate(injectedConnector, (error) => {
      console.log(error)
    })
  }

  return (
    <>
        {account()}
        <h1>Example</h1>
        <button onClick={connectButton}>Connect</button>
    </>
  )
}

const App: Component = () => {

  return (
    <Web3Provider getLibrary={(provider) => {
        const _provider = new ethers.providers.Web3Provider(provider)
        _provider.pollingInterval = 1500;
        return _provider;
    }}>
        <InnerApp />
    </Web3Provider>
  );
};

export default App;
