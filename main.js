// Import utility functions
const utils = require("./utils");

async function main() {
  const { accountId, privateKey } = await utils.createAccount();

  const contractId = await utils.deployContract();
  await utils.callMintFunction(contractId, accountId);
  await utils.callGetMyIdentityFunction(contractId, accountId, privateKey);

  // End process
  process.exit();
}

// Execute main function
main();
