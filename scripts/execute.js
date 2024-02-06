const hre = require("hardhat");
require("dotenv").config();

const FACTORY_ADDRESS = "0x0E0a6a938b5FCe4766e104d31BaCcB47dE827911";
const PM_ADDR = "0x7f35B3259dB9ce146eD52bC762ac320e1b3C73D6";
const EP_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

async function main() {
  const [signer0, signer1] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();
  // const address1 = await signer1.getAddress();

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);
  let sender;
  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (e) {
    console.log(e.data);
    sender = "0x" + e.data.slice(-40);
  }
  console.log(`Sender Address: ${sender}`);

  const code = await hre.ethers.provider.getCode(sender);
  if (code !== "0x") {
    initCode = "0x";
  }

  const Account = await hre.ethers.getContractFactory("Account");
  const callData = Account.interface.encodeFunctionData("execute");

  const userOp = {
    sender,
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData,
    paymasterAndData: PM_ADDR,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  const { preVerificationGas, verificationGasLimit, callGasLimit } =
    await hre.ethers.provider.send("eth_estimateUserOperationGas", [
      userOp,
      EP_ADDR,
    ]);

  const { maxFeePerGas } = await hre.ethers.provider.getFeeData();

  const maxPriorityFeePerGas = await ethers.provider.send(
    "rundler_maxPriorityFeePerGas"
  );

  userOp.preVerificationGas = preVerificationGas;
  userOp.verificationGasLimit = verificationGasLimit;
  userOp.callGasLimit = callGasLimit;
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const opHash = await hre.ethers.provider.send("eth_sendUserOperation", [
    userOp,
    EP_ADDR,
  ]);

  console.log(opHash);

  setTimeout(async () => {
    const { transactionHash } = await hre.ethers.provider.send(
      "eth_getUserOperationByHash",
      [opHash]
    );

    console.log(transactionHash);
  }, 5000);

  // const tx = await entryPoint.handleOps([userOp], address0);
  // const receipt = await tx.wait();
  // console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
