// Import utility functions
const utils = require("./utils");

async function main() {
  const { accountId, privateKey } = await utils.createAccount();

  // Create identity
  const identity = {
    firstName: "Max",
    lastName: "Mustermann",
    dateOfBirth: 1033682400, // Time in UNIX format
    fatherName: "John Mustermann",
    motherName: "Erika Mustermann",
    placeOfBirth: "Zürich",
    gender: "Male",
    socialStatus: "Single",
    city: "Zürich",
    imgUrl: "https://bruinlife.s3.us-west-1.amazonaws.com/wp-content/uploads/2018/05/02172440/2B8_5799.jpg",
  };

  // Deploy contract
  const contractId = await utils.deployContract();

  // Call create identity function on Hedera Hashgraph
  await utils.callMintFunction(contractId, accountId, identity);
  // Call fetch identity function on Hedera Hashgraph
  await utils.callGetMyIdentityFunction(contractId, accountId, privateKey);

  // End process
  process.exit();
}

// Execute main function
main();
