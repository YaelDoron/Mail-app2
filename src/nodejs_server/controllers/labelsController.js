const labelService = require('../services/LabelService');

exports.getUserLabels = async (req, res) => {
    const userId = req.user.userId;
    // Return all the user labels
    const labels = await labelService.getAllLabels(userId);
    res.status(200).json(labels);
}

exports.createLabel = async (req, res) => {
  const userId = req.user.userId;
  // Check if 'name' is present
  const name = req.body.name
  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }
  const existing = await labelService.getAllLabels(userId);
  if (existing.find(l => l.name === name)) {
    return res.status(409).json({ error: 'Label already exists' });
  }
  const newLabel = await labelService.createLabel(name, userId)
  // Return the location of the new label
  res.status(201).location(`/api/labels/${newLabel._id}`).end()
}

exports.getLabelById = async (req, res) => {
  const userId = req.user.userId;
  const label = await labelService.getLabel(req.params.id, userId)
  // Check if a label with this ID exists
  if (!label) {
    return res.status(404).json({ error: 'Label not found' })
  }
  // Return the label
  res.status(200).json(label);
}

exports.updateLabel = async (req, res) => {
  const userId = req.user.userId;
  const id = req.params.id
  const newName = req.body.name
  // Check if 'newName' is present
  if (!newName) {
    return res.status(400).json({ error: 'Name is required' })
  }
  // Check if another label with the same name already exists.
  const existing = await labelService.getAllLabels(userId);
  if (existing.find(l => l.name === newName && l._id.toString() !== id)) {
    return res.status(409).json({ error: 'Label already exists' });
  }
  const updatedLabel = await labelService.updateLabel(id, newName, userId)
  // Return error if the label not exist
  if (!updatedLabel) {
    return res.status(404).json({ error: 'Label not found' })
  }
  // Return 204 on successful update with no content
  res.status(204).end();
}

exports.deleteLabel = async (req, res) => {
  const userId = req.user.userId;
  const id = req.params.id
  const success = await labelService.deleteLabel(id, userId)
  // Return 404 error if the label does not exist
  if (!success) {
    return res.status(404).json({ error: 'Label not found' })
  }
  // Return 204 on successful delete with no content
  res.status(204).end();
}