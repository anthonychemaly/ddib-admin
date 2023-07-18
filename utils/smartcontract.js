const hedera = require("@hashgraph/sdk");
const operator = require("./operator");

const contract = require("../artifacts/contracts/SSID.sol/SelfSovereignIdentity.json");
const { writeJSONToFile } = require("./output");

const bytecode = contract.bytecode;

async function deployContract() {
  // Init client
  console.log("Initializing admin client...");
  client = await operator.initOperator();

  //Create the transaction
  console.log("Create and execute transaction to deploy contract...");
  const contractTx = await new hedera.ContractCreateFlow()
    .setGas(1000000)
    .setBytecode(bytecode)
    .setConstructorParameters(
      new hedera.ContractFunctionParameters()
        .addString("UZHSSID")
        .addString("ZHID")
    )
    .execute(client);

  const receipt = await contractTx.getReceipt(client);

  console.log("The new contract ID is " + receipt.contractId);
  console.log(
    `Check it out on hashscan: https://hashscan.io/testnet/contract/${receipt.contractId}`
  );
  console.log("✅✅✅ Contract deployed successfully \n");

  writeJSONToFile("./contractInfo.json", {
    contractId: receipt.contractId.toString(),
  });

  return receipt.contractId;
}

async function callMintFunction(contractId, accountId) {
  console.log("Initializing admin client...");
  client = await operator.initOperator();

  console.log("Create and execute mint query");
  const contractExecTx = await new hedera.ContractExecuteTransaction()
    .setGas(1000000)
    .setContractId(contractId)
    .setFunction(
      "createIdentity",
      new hedera.ContractFunctionParameters()
        .addString("A")
        .addString("C")
        .addUint256(1033682400)
        .addString("C")
        .addString("S")
        .addString("D")
        .addString("M")
        .addString("S")
        .addString("D")
        .addAddress("0x" + accountId.toSolidityAddress())
    )
    .execute(client);

  const receipt = await contractExecTx.getReceipt(client);

  console.log(`✅ The transaction status is ${receipt.status.toString()}`);
}

async function callGetMyIdentityFunction(contractId, accountId, privateKey) {
  console.log("\n");
  console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
  console.log("Initializing identity holder client...");
  client = await operator.initCustomOperator(accountId, privateKey);

  const contractQuery = await new hedera.ContractCallQuery()
    .setGas(100000)
    .setContractId(contractId)
    .setFunction("getMyIdentity")
    .setQueryPayment(new hedera.Hbar(2))
    .execute(client);

  const firstName = contractQuery.getString(0);
  const lastName = contractQuery.getString(1);
  const dateOfBirth = contractQuery.getUint256(2);
  const fatherName = contractQuery.getString(3);
  const motherName = contractQuery.getString(4);
  const placeOfBirth = contractQuery.getString(5);
  const gender = contractQuery.getString(6);
  const socialStatus = contractQuery.getString(7);
  const city = contractQuery.getString(8);

  console.log("\n");
  console.log({
    firstName,
    lastName,
    dateOfBirth,
    fatherName,
    motherName,
    placeOfBirth,
    gender,
    socialStatus,
    city,
  });
  console.log("\n");
}

module.exports = {
  deployContract,
  callMintFunction,
  callGetMyIdentityFunction,
};
