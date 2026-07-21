const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const DogModel = require("./models/DogModel");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// root route
app.get("/", (req, res) => {
  res.send("DogDex API server is running!");
});

// GET - all dogs
app.get("/dogs", (req, res) => {
  DogModel.find()
    .then((dogs) => {
      res.json(dogs);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Failed to fetch dogs", error: err.message });
    });
});

// GET - single dog by id
app.get("/dogs/:id", (req, res) => {
  DogModel.findById(req.params.id)
    .then((dog) => {
      if (!dog) {
        return res
          .status(404)
          .json({ message: `Dog with id:${req.params.id} was not found!` });
      }
      res.json(dog);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Failed to fetch dog", error: err.message });
    });
});

// POST - create a new dog
app.post("/dogs", (req, res) => {
  DogModel.create(req.body)
    .then((newDog) => {
      res.status(201).json(newDog);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Failed to create dog", error: err.message });
    });
});

// PUT - update a dog
app.put("/dogs/:id", (req, res) => {
  DogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedDog) => {
      if (!updatedDog) {
        return res
          .status(404)
          .json({ message: `Dog with id:${req.params.id} was not found!` });
      }
      res.json(updatedDog);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Failed to update dog", error: err.message });
    });
});

// DELETE - remove a dog
app.delete("/dogs/:id", (req, res) => {
  DogModel.findByIdAndDelete(req.params.id)
    .then((deletedDog) => {
      if (!deletedDog) {
        return res
          .status(404)
          .json({ message: `Dog with id:${req.params.id} was not found!` });
      }
      res.json({ message: "Dog deleted", dog: deletedDog });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Failed to delete dog", error: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`DogDex server running on port ${PORT}`);
});
