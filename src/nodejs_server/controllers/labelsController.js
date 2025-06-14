const Label = require('../models/Label.js')

exports.getUserLabels = (req, res) => {
    const userId = req.user.userId;
    // Return all the user labels
    const labels = Label.getAllLabels(userId);
    res.status(200).json(labels);
}

exports.createLabel = (req, res) => {
  const userId = req.user.userId;
  // Check if 'name' is present
  const name = req.body.name
  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }
  const existing = Label.getAllLabels(userId).find(l => l.name === name);
  if (existing) {
    return res.status(409).json({ error: 'Label already exists' });
  }
  const newLabel = Label.createLabel(name, userId)
  // Return the location of the new label
  res.status(201).location(`/api/labels/${newLabel.id}`).end()
}

exports.getLabelById = (req, res) => {
  const userId = req.user.userId;
  const label = Label.getLabel(parseInt(req.params.id), userId)
  // Check if a label with this ID exists
  if (!label) {
    return res.status(404).json({ error: 'Label not found' })
  }
  // Return the label
  res.status(200).json(label);
}

exports.updateLabel = (req, res) => {
  const userId = req.user.userId;
  const id = parseInt(req.params.id)
  const newName = req.body.name
  // Check if 'newName' is present
  if (!newName) {
    return res.status(400).json({ error: 'Name is required' })
  }
  const updatedLabel = Label.updateLabel(id, newName, userId)
  // Return error if the label not exist
  if (!updatedLabel) {
    return res.status(404).json({ error: 'Label not found' })
  }
  // Return 204 on successful update with no content
  res.status(204).end();
}

exports.deleteLabel = (req, res) => {
  const userId = req.user.userId;
  const id = parseInt(req.params.id)
  const success = Label.deleteLabel(id, userId)
  // Return 404 error if the label does not exist
  if (!success) {
    return res.status(404).json({ error: 'Label not found' })
  }
  // Return 204 on successful delete with no content
  res.status(204).end();
}