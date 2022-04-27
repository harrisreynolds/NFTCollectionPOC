<template>
  <div class="my-2">

    <h2>Ethers.js Example</h2>

    <div v-if="wallet" class="alert alert-primary" role="alert">
      <strong>Wallet: </strong>{{ wallet }}
    </div>

    <div v-else>
      <button @click="onConnectWalletClick" class="btn btn-primary">Connect Wallet</button>
    </div>

    <div v-if="wallet">

      <div class="my-3">
        <label for="factoryContractInput" class="form-label">Factory Contract Address</label>
        <input v-model="factoryAddress" type="text" class="form-control" id="factoryContractInput">
        <div class="form-text">This is the address of a deployed WeBaseCollectionFactory contract. Note the
          network it is deployed to should match the network your Metamask walled is connected to.
        </div>
      </div>

      <div v-if="collectionAddress" class="alert alert-primary" role="alert">
        <strong>Collection Name: </strong>{{ collectionName }}<br>
        <strong>Collection Symbol: </strong>{{ collectionSymbol }}<br>
        <strong>NFT Collection Address: </strong>{{ collectionAddress }}<br>
      </div>

      <div v-else>
        <div class="my-3">
          <label for="nameInput" class="form-label">Collection Name</label>
          <input v-model="collectionName" type="text" class="form-control" id="nameInput">
        </div>

        <div class="my-3">
          <label for="symbolInput" class="form-label">Collection Symbol</label>
          <input v-model="collectionSymbol" type="text" class="form-control" id="symbolInput">
        </div>
      </div>

      <button v-if="!collectionAddress" @click="onCreateCollectionClick" class="btn btn-primary">
        Create Collection <i v-if="loading" class="mx-2 fas fa-spinner fa-spin"></i>
      </button>
      <button v-if="collectionAddress" @click="onTestClick" class="btn btn-primary mx-2">Test Collection</button>

      <div v-if="collectionAddress" class="my-3">
        <h4>NFT</h4>
        <img src="@/assets/nft.jpeg" class="img-thumbnail" width="200" >
        <button @click="onMintClick" class="btn btn-primary mx-2">
          Mint NFT <i v-if="loading" class="mx-2 fas fa-spinner fa-spin"></i></button>
      </div>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {ethers} from 'ethers'
import WeBaseCollectionFactory from '../contracts/WeBaseCollectionFactory.json'
import MintableERC721 from '../contracts/MintableERC721.json'

export default {
  name: 'Home',
  data() {
    return {
      factoryAddress: '0xd1f1162D12E7f4917f2De1f26d72D3Fc866343FD', // deployed to Ropsten
      wallet: '',
      collectionAddress: '0xF6551b19629ed0a00Ba784460AC842c46006905A', // set to empty string to create collection
      collectionName: 'WeBase NFT Collection',
      collectionSymbol: 'WBNC',
      ifpsUrl: '@/assets/nft.jpeg',
      loading: false
    }
  },
  methods: {

    async onTestClick() {
      const contract = this.getCollectionContract()
      try {
        const collectionName = await contract.name()
        const collectionSymbol = await contract.symbol()
        alert(`Collection found, name: ${collectionName}, symbol: ${collectionSymbol}`)
      } catch (err) {
        console.log("Error: ", err)
      }
    },

    async onCreateCollectionClick() {
      this.loading = true
      const ethereumProvider = this.getProvider()
      const provider = new ethers.providers.Web3Provider(ethereumProvider)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(this.factoryAddress, WeBaseCollectionFactory.abi, signer)

      contract.on("NFTContractCreated", (contractAddress) => {
        console.log('***** new contract address *****')
        console.log(contractAddress)
        this.collectionAddress = contractAddress
      });


      try {
        const transaction = await contract.deploy721Contract(this.collectionName, this.collectionSymbol)
        console.log('Transaction')
        console.log(transaction)
        const result = await transaction.wait()
        console.log('wait complete')
        console.log(result)
        this.loading = false
      } catch (err) {
        console.log("Error: ", err)
        this.loading = false
      }

    },

    async onMintClick() {
      console.log('onMintClick')
      const contract = this.getCollectionContract()
      const toAddress = this.wallet
      const tokenUri = 'ifps://bogus-token-url-here'
      this.loading = true
      const transaction = await contract.safeMint(toAddress, tokenUri)
      console.log(transaction)
      const result = await transaction.wait()
      console.log('NFT mint transaction complete')
      console.log(result)
      this.loading = false
    },

    onConnectWalletClick() {
      console.log('Connecting wallet')
      const provider = this.getProvider()
      provider.request({method: 'eth_requestAccounts'}).then((response) => {
        console.log('Connect wallet success')
        console.log(response)
        this.wallet = response[0]
        // this.saveWallet()
      }).catch((error) => {
        console.log('Connect wallet error')
        console.log(error)
      });
    },

    getCollectionContract() {
      const ethereumProvider = this.getProvider()
      const provider = new ethers.providers.Web3Provider(ethereumProvider)
      console.log(provider)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(this.collectionAddress, MintableERC721.abi, signer)
      return contract
    },

    getProvider() {
      // 1. Getting ethereum object out of global JS object
      if (window.ethereum) {
        const {ethereum} = window
        return ethereum;
      }
      // 2. If ethereum property does not exist it means that user needs to install Metamask
      else {
        alert("Please install Metamask")
      }
    },
  }
}
</script>
