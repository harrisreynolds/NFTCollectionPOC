<template>
  <div class="about">
    <h1>Web3.js Example</h1>
    <button @click="onDeployClick">Deploy</button>
  </div>
</template>
<script>

import Web3 from 'web3'
import WeBaseCollectionFactory from '../contracts/WeBaseCollectionFactory.json'

export default {
  name: 'About',
  methods: {
    async onDeployClick() {
      const factoryAddress = '0x95DbcaDc4191f6498ab908a4FC86d01Ac81C0Cd6'
      console.log(Web3.givenProvider)
      const web3 = new Web3("http://127.0.0.1:9545");
      console.log(web3)

      console.log(this.getMethods(web3.currentProvider))

      const networkId = await web3.eth.net.getId();
      console.log('Network id: ' + networkId)
      const chainId = await web3.eth.getChainId();
      console.log('Chain id: ' + chainId)
      // const accounts = await this.requestAccount()
      // console.log(accounts)
      // console.log(web3.eth)
      web3.eth.getAccounts(console.log);
      const contract = new web3.eth.Contract(WeBaseCollectionFactory.abi, factoryAddress)
      console.log(contract)
      console.log(contract.methods)

      contract.methods.deploy721Contract('Great Faith Token', 'GFT').send({from: '0xde1d9f1d23067807cb3bbb573d5ea1834eb91255'})
          .then((newContract) => {
            console.log(newContract)
          }).catch((error) => {
        console.log(error)
      });

      // try {
      //   const transaction = await contract.deploy721Contract('Great Faith Token', 'GFT')
      //   console.log('Transaction')
      //   console.log(transaction)
      //   const result = await transaction.wait()
      //   console.log('wait complete')
      //   console.log(result)
      // } catch (err) {
      //   console.log("Error: ", err)
      // }
    },

    async requestAccount() {
      await window.ethereum.request({method: 'eth_requestAccounts'})
    },

    getMethods(obj) {
      let properties = new Set()
      let currentObj = obj
      do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
      } while ((currentObj = Object.getPrototypeOf(currentObj)))
      return [...properties.keys()].filter(item => typeof obj[item] === 'function')
    }
  }
}

</script>
