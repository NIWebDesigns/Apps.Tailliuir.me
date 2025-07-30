const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/vote-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Schema for the apps and their vote counts
const appSchema = new mongoose.Schema({
  name: String,
  votes: { type: Number, default: 0 }
});

const App = mongoose.model('App', appSchema);

// Get all apps and their vote counts
app.get('/api/apps', async (req, res) => {
  try {
    const apps = await App.find().sort({ votes: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching apps' });
  }
});

// Update vote count for an app
app.post('/api/vote', async (req, res) => {
  const { appId, vote } = req.body;

  try {
    const app = await App.findById(appId);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    app.votes += vote;
    await app.save();
    res.json({ message: 'Vote added' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating vote' });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
