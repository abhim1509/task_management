const db_calls = require("./database_interface");

module.exports.createSingleRecord = async (model, payload) => {
  return await db_calls.createSingleRecord(model, payload);
};

module.exports.getRecord = async (model, query) => {
  return await db_calls.getRecord(model, query);
};

module.exports.updateRecord = async (model, query, payload) => {
  return await db_calls.updateRecord(model, query, payload);
};

module.exports.getRecords = async (model, query, sort) => {
  return await db_calls.getRecords(model, query, sort);
};

module.exports.deleteRecord = async (model, id) => {
  return await db_calls.deleteRecord(model, id);
};
