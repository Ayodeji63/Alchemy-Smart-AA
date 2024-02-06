const hre = require("hardhat");

const FACTORY_NOUNCE = 1;
const EP_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PM_ADDR = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const [signer0, signer1] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NOUNCE,
  });

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const initCode = "0x";
  // FACTORY_ADDRESS +
  // AccountFactory.interface
  //   .encodeFunctionData("createAccount", [address0])
  //   .slice(2);

  console.log(`Sender Address: ${sender}`);

  const balance = hre.ethers.formatEther(await entryPoint.balanceOf(PM_ADDR));

  console.log(`Sender Balance: ${balance}`);

  if (balance < 1) {
    await entryPoint.depositTo(PM_ADDR, {
      value: hre.ethers.parseEther("100"),
    });
  }

  const Account = await hre.ethers.getContractFactory("Account");
  const callData = Account.interface.encodeFunctionData("execute");

  const userOp = {
    sender,
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData,
    callGasLimit: 400_000,
    verificationGasLimit: 400_000,
    preVerificationGas: 50_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: PM_ADDR,
    signature: "0x",
  };

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
