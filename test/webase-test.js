const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WeBaseCollectionFactory", function () {
  it("Should return the new Erc721 Contract", async function () {
    const WeBaseCollectionFactory = await ethers.getContractFactory("WeBaseCollectionFactory");
    const factory = await WeBaseCollectionFactory.deploy();
    await factory.deployed();
    const collectionName = "WeBase Test Collection"
    const collectionSymbol = "WBTC"
    const newErc721Contract = await factory.deploy721Contract(collectionName, collectionSymbol)
    console.log(newErc721Contract)
    // expect(newErc721Contract.name()).to.equal(collectionName);
    // expect(newErc721Contract.symbol()).to.equal(collectionSymbol);
  });
});
