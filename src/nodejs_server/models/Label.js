let labelIdCounter = 1;
let labels = [];

// Return all user labels
function getAllLabels(userId) {
  return labels.filter(label => label.owner === userId);
}

// Create a new label
function createLabel(name, userId) {
  const newLabel = { id: labelIdCounter++, name: name, owner: userId };
  labels.push(newLabel);
  return newLabel;
}

// Return the label that matches the given ID and belongs to the specified user.
function getLabel(id, userId) {
  return labels.find(label => label.owner === userId && label.id === id);
}

// Updates the name of the label with the given ID for the specified user.
const updateLabel = (id, newName, userId) => {
  const label = labels.find(label => label.owner === userId && label.id === id)
  if (!label) return null

  label.name = newName
  return label
}

// Deletes the label with the specified ID that belongs to the given user.
const deleteLabel = (id, userId) => {
  const index = labels.findIndex(label => label.owner === userId && label.id === id)
  if (index === -1) return null

  labels.splice(index, 1)
  return true
}

module.exports = {
  createLabel,
  getAllLabels,
  getLabel,
  deleteLabel,
  updateLabel
};