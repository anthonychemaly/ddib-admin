// Import hedera SDK
const hedera = require("@hashgraph/sdk");
const operator = require("./operator");
const operatorConfig = require("../operator.json");
const { writeJSONToFile } = require("./output");

/**
 * This function generates a new ED25519 key pair and uses it to create a new Hedera account.
 * It then retrieves and prints the account ID, Private Key and Public Key of the new account.
 *
 * @returns {Object} - Object with the new account's ID, private key, and public key
 */

async function createAccount() {
  // Create new ED25519 key pair
  console.log("Generating a new ECDSA key pair...");
  const newAccountPrivateKey = hedera.PrivateKey.generateECDSA();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  // Print the PrivatKey and Public Key
  console.log(`PrivatKey: ${newAccountPrivateKey.toString()}`);
  console.log(`PublicKey: ${newAccountPublicKey.toString()}`);

  // Init operator
  console.log("Initializing the client...");
  client = await operator.initOperator();

  // Create a new account with 10 Hbar starting balance
  console.log("Creating a new account with 100 Hbar starting balance...");
  const newAccount = await new hedera.AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(new hedera.Hbar(100))
    .setMaxAutomaticTokenAssociations(2)
    .execute(client);

  // Get the new account ID
  console.log("Fetching the new account ID...");
  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  //Log the account ID
  console.log(`The new account ID is: ${newAccountId}`);

  writeJSONToFile("./identityHolderAccount.json", {
    operatorAccountId: newAccountId.toString(),
    operatorPrivateKey: newAccountPrivateKey.toString(),
    operatorPublicKey: newAccountPublicKey.toString(),
  });

  return {
    accountId: newAccountId,
    privateKey: newAccountPrivateKey,
    publicKey: newAccountPublicKey,
  };
}

/**
 * This function approves a specified amount of Hbar to be spent from the operator's account by another Hedera account.
 *
 * @param {string} spenderAccountId - The ID of the account that the allowance is being granted to
 * @param {number} amount - The amount of Hbar to approve for allowance
 */
async function transferHbar(receiverAccountId, amount) {
  // Init operator
  console.log("Initializing the client...");
  client = await operator.initOperator();

  // Create the transfer transaction
  console.log("Creating the transfer transaction...");
  const transaction = new hedera.TransferTransaction()
    .addHbarTransfer(operatorConfig.operatorAccountId, new hedera.Hbar(-amount))
    .addHbarTransfer(receiverAccountId, new hedera.Hbar(amount));

  console.log(
    `Going to transfer ${amount}Hbar from ${operatorConfig.operatorAccountId} to ${receiverAccountId}`
  );

  // Sign with the client operator key and submit the transaction to a Hedera network
  console.log("Signing and submitting the transaction...");
  const txId = await transaction.execute(client);

  // Request the receipt of the transaction
  console.log("Requesting the transaction receipt...");
  const receipt = await txId.getReceipt(client);

  // Get the transaction consensus status
  const transactionStatus = receipt.status;

  console.log("The transaction consensus status is " + transactionStatus);
}

// Export Module
module.exports = {
  createAccount,
  transferHbar,
};
