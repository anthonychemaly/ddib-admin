const account = require("./account");
const operator = require("./operator");

const smartcontract = require("./smartcontract");

module.exports = {
  ...account,
  ...operator,
  ...smartcontract,
};
