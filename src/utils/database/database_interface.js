const mongoose = require("mongoose");
const data_sanitisation = require("./../utilities/data_sanitisation");

//Create
module.exports.createSingleRecord = async (model, payload) => {
  try {
    const resultSet = await new model(payload);
    //console.log("resultSet", resultSet);
    if (!resultSet) {
      prepareResponse("Result Set is not appropriate.");
    }

    await resultSet.save();
    return prepareResponse("Records created successfully.", true, resultSet);
  } catch (error) {
    console.log(error);
    return prepareResponse("Error occured while creating record.");
  }
};

//Read
module.exports.getRecord = async (model, query) => {
  try {
    const resultSet = await model.findOne(query);
    if (!resultSet) {
      return prepareResponse("Result Set is not appropriate.");
    }
    if (data_sanitisation.isObjectOrArrayEmpty(resultSet)) {
      return prepareResponse("Record details empty.", false, resultSet);
    }
    return prepareResponse("Record details found.", true, resultSet);
  } catch (error) {
    console.log(error);
    return prepareResponse("An error while fetching record.");
  }
};

module.exports.getRecords = async (model, query, sort = { createdAt: 1 }) => {
  try {
    console.log(query);
    const resultSet = await model.find(query).sort(sort);
    if (!resultSet || resultSet.length === 0) {
      return prepareResponse("No records found");
    }
    return prepareResponse("Record list found", true, resultSet);
  } catch (error) {
    return prepareResponse("Unable to fetch records");
  }
};

//Update
module.exports.updateRecord = async (model, query, payload) => {
  try {
    const resultSet = await model.findOneAndUpdate(query, payload, {
      new: true,
    });
    if (!resultSet) {
      return prepareResponse("No records updated");
    }
    return prepareResponse("Records updated successfully", true, resultSet);
  } catch (error) {
    console.log("Error:", error);
    return prepareResponse("Unable to update records");
  }
};

//Delete record
module.exports.deleteRecord = async (model, query) => {
  try {
    const resultSet = await model.findOneAndDelete(query);
    if (!resultSet) {
      return prepareResponse("No records deleted.");
    }
    return prepareResponse("Records deleted successfully.", true, resultSet);
  } catch (error) {
    console.log("Error:", error);
    return prepareResponse("Unable to deleted records.");
  }
};

const prepareResponse = (message, hasData = false, resultSet = null) => {
  return { message, hasData, resultSet };
};
