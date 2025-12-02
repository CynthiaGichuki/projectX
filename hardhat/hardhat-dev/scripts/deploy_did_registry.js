const { ethers } = require("hardhat");
const { keccak256 } = require("ethers/lib/utils");

async function main() {
  const [deployer] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("DIDRegistry");

  // Create the initialization code for the contract
  const bytecode = factory.bytecode;
  const constructorTypes = ["address"];
  const constructorArgs = [deployer.address];
  const initCode = bytecode + ethers.utils.defaultAbiCoder.encode(constructorTypes, constructorArgs).slice(2);

  // Define a salt for deterministic address generation
  const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DIDRegistrySalt"));

  // Calculate the deterministic address
  const create2Address = ethers.utils.getCreate2Address(deployer.address, salt, keccak256(initCode));
  console.log(`Expected DIDRegistry address: ${create2Address}`);

  // Deploy the contract using create2
  const tx = await deployer.sendTransaction({
    from: deployer.address,
    data: initCode,
    gasLimit: 1000000,
    nonce: await deployer.getTransactionCount(),
  });

  await tx.wait();

  console.log("DIDRegistry deployed to:", create2Address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
