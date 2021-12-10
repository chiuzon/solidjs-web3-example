import type { Component } from "solid-js";

import {InjectedConnector} from '@web3-react/injected-connector'
import {solidWeb3, Web3Provider} from '@chiuzon/solidweb3'

import {ethers} from 'ethers'

const injectedConnector = new InjectedConnector({supportedChainIds: [1]})

const InnerApp: Component = () => {
  const {activate, store} = solidWeb3()

  async function connectButton() {
    await activate(injectedConnector, (error) => {
      console.log(error)
    })
  }

  return (
    <>
        {store.account}
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
