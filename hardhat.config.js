require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

/** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   defaultNetwork: "arb",
//   solidity: {
//     version: "0.8.19",
//     networks: {
//       arb: {
//         url: process.env.RPC_URL,
//         accounts: [process.env.PRIVATE_KEY],
//       },
//     },
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 1000,
//       },
//     },
//   },
// };

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
};
