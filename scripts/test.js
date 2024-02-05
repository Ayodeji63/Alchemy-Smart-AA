const hre = require("hardhat");

const EP_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ACCOUNT_ADDR = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
const PM_ADDR = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const code = await hre.ethers.provider.getCode(EP_ADDR);
  const count = await account.count();
  console.log(`Count is: ${count}`);

  console.log(
    `account balance`,
    await hre.ethers.provider.getBalance(ACCOUNT_ADDR)
  );

  const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);

  console.log(`Account balance on EP`, await ep.balanceOf(ACCOUNT_ADDR));
  console.log(`Paymaster balance on EP`, await ep.balanceOf(PM_ADDR));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
