const hre = require("hardhat");

async function main() {
  const af = await hre.ethers.deployContract("AccountFactory");

  await af.waitForDeployment();

  console.log(`AF deployed to ${af.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
