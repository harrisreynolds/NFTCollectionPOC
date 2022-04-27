<template>
  <div class="my-2">
    <h2>Rarible Example</h2>

    <div v-if="wallet" class="alert alert-primary" role="alert">
      <strong>Wallet: </strong>{{ wallet }}
    </div>

    <div v-else>
      <button @click="onConnectWalletClick" class="btn btn-primary">Connect Wallet</button>
    </div>

    <div>
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

    <button @click="onTestClick" class="btn btn-primary mx-2">Test Collection</button>

    <div v-if="wallet && collectionAddress" class="my-3">
      <h4>NFT</h4>
      <img src="@/assets/nft.jpeg" class="img-thumbnail" width="200" >
      <button @click="onMintClick" class="btn btn-primary mx-2">
        Mint NFT <i v-if="loading" class="mx-2 fas fa-spinner fa-spin"></i></button>
    </div>

  </div>
</template>

<script>
import Web3 from "web3";
import {Web3Ethereum} from "@rarible/web3-ethereum";
import {EthereumWallet} from "@rarible/sdk-wallet";
import {Blockchain} from "@rarible/api-client";
import {createRaribleSdk} from "@rarible/sdk";
import {ethers} from "ethers";
import MintableERC721 from "@/contracts/MintableERC721.json";
import {
  convertEthereumContractAddress,
  convertEthereumToUnionAddress
} from "@rarible/sdk/build/sdk-blockchains/ethereum/common";

export default {
  name: "RaribleExample",
  data() {
    return {
      wallet: '',
      collectionAddress: '0x5142A3A08Fd4F16E052Fdb1B0441134c05fc6916', // remove to re-create collection, rinkeby collection
      collectionName: 'WeBase NFT Collection',
      collectionSymbol: 'WBNC',
      ifpsUrl: '@/assets/nft.jpeg',
      loading: false
    }
  },
  methods: {

    async onMintClick() {
      console.log('onMintClick')

      const web3 = new Web3(window.ethereum)
      const web3Ethereum = new Web3Ethereum({web3: web3, from: this.wallet})
      const ethWallet = new EthereumWallet(web3Ethereum, Blockchain.ETHEREUM)
      const environment = 'staging'
      const sdk = createRaribleSdk(ethWallet, environment)

      const sender = convertEthereumToUnionAddress(this.wallet, Blockchain.ETHEREUM)
      const contract = convertEthereumContractAddress(this.collectionAddress, Blockchain.ETHEREUM)
      const collection = await sdk.apis.collection.getCollectionById({
        collection: contract,
      })

      console.log(collection)

      const tokenId = await sdk.nft.generateTokenId({
        collection: contract,
        minter: sender,
      })

      console.log(tokenId)

      const action = await sdk.nft.mint({
        collection,
        tokenId: tokenId,
      })

      const result = await action.submit({
        uri: "ipfs://ipfs/webase-ifps-url-here",
        creators: [{
          account: sender,
          value: 10000,
        }],
        royalties: [],
        lazyMint: false,
        supply: 1,
      })

      console.log('Token minted')
      console.log(result)
    },


    async onCreateCollectionClick() {
      console.log('onCreateCollectionClick')
      console.log(window.ethereum)

      const web3 = new Web3(window.ethereum)
      const web3Ethereum = new Web3Ethereum({web3: web3, from: this.wallet})
      const ethWallet = new EthereumWallet(web3Ethereum, Blockchain.ETHEREUM)

      // prod (mainnet), ChainID: 1
      // dev (ropsten), ChainID: 3
      // staging (rinkeby), ChainID: 4

      const chainId = await ethWallet.ethereum.getChainId()
      console.log(chainId) // the chain ID the wallet is connected to needs to match the environment
      // can also call ethereum.request({ method: 'eth_chainId' }).

      const environment = 'staging'
      const raribleSdk = createRaribleSdk(ethWallet, environment)

      console.log('createCollection begin')
      const { address, tx } = await raribleSdk.nft.createCollection({
        blockchain: Blockchain.ETHEREUM,
        asset: {
          assetType: "ERC721",
          arguments: {
            name: this.collectionName,
            symbol: this.collectionSymbol,
            baseURI: "https://ipfs.rarible.com",
            contractURI: "https://ipfs.rarible.com",
            isUserToken: false,
          },
        },
      })

      console.log('createCollection txn wait begin')
      await tx.wait()
      console.log('createCollection txn wait end')
      console.log(tx)
      console.log(address)

      // const network = 'ropsten'
      // const createCollectionCommand = new EthereumCreateCollection(raribleSdk, network)
      // console.log(createCollectionCommand)
      // console.log('startCreateCollection begin')
      // console.log(contractDetails.arguments.name)
      // console.log(contractDetails.assetType)
      // createCollectionCommand.startCreateCollection(contractDetails).then((response) => {
      //   console.log('startCreateCollection success')
      //   console.log(response.tx)
      //   console.log(response.address)
      // }).catch((error) => {
      //   console.log('startCreateCollection error')
      //   console.log(error)
      // })

      // console.log('Deploying contract')
      // console.log(contractDetails)
      // return raribleSdk.nft.deploy(contractDetails)
    },

    onConnectWalletClick() {
      console.log('Connecting wallet')
      const provider = window.ethereum
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

    async onTestClick() {
      console.log('onTestClick')
      const contract = this.getCollectionContract()
      try {
        const collectionName = await contract.name()
        const collectionSymbol = await contract.symbol()
        alert(`Collection found, name: ${collectionName}, symbol: ${collectionSymbol}`)
      } catch (err) {
        console.log("Error: ", err)
      }
    },

    getCollectionContract() {
      const ethereumProvider = window.ethereum
      const provider = new ethers.providers.Web3Provider(ethereumProvider)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(this.collectionAddress, MintableERC721.abi, signer)
      return contract
    },
  }
}
</script>
