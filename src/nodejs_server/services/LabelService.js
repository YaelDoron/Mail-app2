const Label = require('../models/Label');
const Mail = require('../models/Mail');

// Return all user labels
const getAllLabels = async (userId) => {
  return await Label.find({ owner: userId });
}

// Create a new label
const createLabel = async (name, userId) => {
  const newLabel = await Label.create({ name: name, owner: userId });
  return newLabel;
}

// Return the label that matches the given ID and belongs to the specified user.
const getLabel = async (id, userId) => {
  return await Label.findOne({owner: userId, _id: id});
}

// Updates the name of the label with the given ID for the specified user.
const updateLabel = async (id, newName, userId) => {
  const label = await Label.findOne({owner: userId, _id: id})
  if (!label) return null

  label.name = newName
  await label.save();
  return label
}

// Deletes the label with the specified ID that belongs to the given user.
const deleteLabel = async (id, userId) => {
  const label = await Label.findOne({owner: userId, _id: id})
  if (!label) return null

  await label.deleteOne();

  // Removes the label ID from all of the user's emails.
  await Mail.updateMany(
    { owner: userId },
    { $pull: { labels: id } }  
  );
  return true
}

module.exports = {
  createLabel,
  getAllLabels,
  getLabel,
  deleteLabel,
  updateLabel
};