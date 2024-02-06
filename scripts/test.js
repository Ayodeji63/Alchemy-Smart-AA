const hre = require("hardhat");

const EP_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const ACCOUNT_ADDR = "0x98036e4d72591ab407306d346a3ece19edaac859";
const ACCOUNT_ADDR1 = "0x3d4e1ace6bc725766899f1c9d0c05f4a03bae528";
const PM_ADDR = "0x7f35B3259dB9ce146eD52bC762ac320e1b3C73D6";
async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR1);
  const count = await account.count();
  console.log(`Count is: ${count}`);

  console.log(
    `account balance`,
    await hre.ethers.provider.getBalance(ACCOUNT_ADDR1)
  );

  const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);

  console.log(`Account balance on EP`, await ep.balanceOf(ACCOUNT_ADDR1));
  console.log(`Paymaster balance on EP`, await ep.balanceOf(PM_ADDR));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
