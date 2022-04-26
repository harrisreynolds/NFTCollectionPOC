<template>
  <div class="my-2">

    <h1>Ethers.js Example</h1>

    <button @click="onDeployClick">Deploy</button>
    <button @click="onMintClick">Get Erc Contract</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {ethers} from 'ethers'
import WeBaseCollectionFactory from '../contracts/WeBaseCollectionFactory.json'
import MintableERC721 from '../contracts/MintableERC721.json'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {

    async onMintClick() {
      const collectionAddress = '0x221e6b0C27d8250ffdd82B10146A3a6111990207'

      if (typeof window.ethereum !== 'undefined') {
        await this.requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log(provider)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(collectionAddress, MintableERC721.abi, signer)
        console.log(contract)
        try {
          const collectionName = await contract.name()
          console.log('collectionName')
          console.log(collectionName)
          const collectionSymbol = await contract.symbol()
          console.log('collectionSymbol')
          console.log(collectionSymbol)
        } catch (err) {
          console.log("Error: ", err)
        }
      } else {
        console.log('Cannot find ethereum')
      }

    },

    async onDeployClick() {
      console.log('Deploy')
//      const factoryAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' // localhost
      // const factoryAddress = '0x32754f9aD1E1b3dfA38b69B9F7909B7940868003' // rinkeby
      const factoryAddress = '0x178314Fedf8103269183aB2c4F6d71e132eF2e12' // ropsten
      if (typeof window.ethereum !== 'undefined') {
        await this.requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log(provider)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(factoryAddress, WeBaseCollectionFactory.abi, signer)

        contract.on("NFTContractCreated", (contractAddress) => {
          console.log('***** new contract address *****')
          console.log(contractAddress);
        });

        console.log(contract)
        try {
          const transaction = await contract.deploy721Contract('Great Faith Token', 'GFT')
          console.log('Transaction')
          console.log(transaction)
          const result = await transaction.wait()
          console.log('wait complete')
          console.log(result)
        } catch (err) {
          console.log("Error: ", err)
        }
      } else {
        console.log('Cannot find ethereum')
      }
    },

    async requestAccount() {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    },
  }
}
</script>
