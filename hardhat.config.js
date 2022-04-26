require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    ropsten: {
      url: "https://ropsten.infura.io/v3/7ad0013ab05b4eadbe8b74f253810015",
      accounts: [`0xb70d0fd82f0852d6106ad73456892d5ff879217913595db6f6912cccd9509940`]
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/7ad0013ab05b4eadbe8b74f253810015",
      accounts: [`0xb70d0fd82f0852d6106ad73456892d5ff879217913595db6f6912cccd9509940`]
    }
  },
};
