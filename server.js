const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const DogModel = require('./models/Dog');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// root route
app.get('/', function (req, res) {
  res.send('DogDex API server');
});

// GET - all dogs
app.get('/dogs', async function (req, res) {
  try {
    const dogs = await DogModel.find();
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dogs', error: err.message });
  }
});

// GET - single dog by id
app.get('/dogs/:id', async function (req, res) {
  try {
    const dog = await DogModel.findById(req.params.id);
    if (!dog) {
      return res.status(404).json({ message: `Dog with id:${req.params.id} was not found!` });
    }
    res.json(dog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dog', error: err.message });
  }
});

// POST - create a new dog
app.post('/dogs', async function (req, res) {
  try {
    const newDog = await DogModel.create(req.body);
    res.status(201).json(newDog);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create dog', error: err.message });
  }
});

// PUT - update a dog
app.put('/dogs/:id', async function (req, res) {
  try {
    const updatedDog = await DogModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedDog) {
      return res.status(404).json({ message: `Dog with id:${req.params.id} was not found!` });
    }
    res.json(updatedDog);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update dog', error: err.message });
  }
});

// DELETE - remove a dog
app.delete('/dogs/:id', async function (req, res) {
  try {
    const deletedDog = await DogModel.findByIdAndDelete(req.params.id);
    if (!deletedDog) {
      return res.status(404).json({ message: `Dog with id:${req.params.id} was not found!` });
    }
    res.json({ message: 'Dog deleted', dog: deletedDog });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete dog', error: err.message });
  }
});

app.listen(PORT, function () {
  console.log(`DogDex server running on port ${PORT}`);
});
