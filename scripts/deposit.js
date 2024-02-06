const hre = require("hardhat");
require("dotenv").config();

const EP_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PM_ADDR = "0x7f35B3259dB9ce146eD52bC762ac320e1b3C73D6";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);

  await entryPoint.depositTo(PM_ADDR, {
    value: hre.ethers.parseEther(".1"),
  });

  console.log("Deposit was successful");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
