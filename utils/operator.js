const hedera = require("@hashgraph/sdk");
const operatorConfig = require("../operator.json");

/**
 * This function initializes a client using the Hedera Hashgraph SDK.
 * The client is set up for the testnet network and the operator is set using an operator ID and private key.
 * The operator ID and private key are fetched from an 'operator.json' file.
 *
 * @returns {Object} client - An instance of the Hedera Hashgraph client connected to the testnet network and configured with the operator
 */
async function initOperator() {
  const operatorAccountId = hedera.AccountId.fromString(
    operatorConfig.operatorAccountId
  );
  const operatorPrivateKey = hedera.PrivateKey.fromString(
    operatorConfig.operatorPrivateKey
  );
  // Create a client and return it
  const client = hedera.Client.forTestnet();
  client.setOperator(operatorAccountId, operatorPrivateKey);
  return client;
}

async function initCustomOperator(
  customOperatorAccountId,
  customOperatorPrivateKey
) {
  const operatorAccountId = hedera.AccountId.fromString(
    customOperatorAccountId.toString()
  );
  const operatorPrivateKey = hedera.PrivateKey.fromString(
    customOperatorPrivateKey.toString()
  );
  // Create a client and return it
  const client = hedera.Client.forTestnet();
  client.setOperator(operatorAccountId, operatorPrivateKey);
  return client;
}

module.exports = {
  initOperator,
  initCustomOperator,
};
