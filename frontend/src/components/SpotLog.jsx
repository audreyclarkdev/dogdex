import { useState, useEffect } from "react";

// API Urls - points at the Express backend running in /backend (port 3000)
const breedsUrl = "http://localhost:3000/api/breeds";
const spotsUrl = "http://localhost:3000/api/spots";

// what a fresh, empty form looks like
const emptyForm = {
  breedId: "",
  dogName: "",
  location: "",
  spottedAt: "",
  notes: "",
};

// SpotLog page - a form for logging a dog you spotted in the wild.
// Submits to /api/spots, which stores it as its own Spot document
// (separate from the Breed data, since a breed can be spotted many times).
function SpotLog() {
  const [breeds, setBreeds] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  // status drives the submit button label and the confirmation/error message
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  // load the breed list once, for the dropdown
  useEffect(function () {
    fetch(breedsUrl)
      .then((res) => res.json())
      .then((data) => setBreeds(data))
      .catch((err) => console.log(err));
  }, []);

  // one handler for every text/select/textarea input, keyed by its name attribute
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const selectedBreed = breeds.find((breed) => breed.id === formData.breedId);
    if (!selectedBreed) {
      setStatus("error");
      setErrorMessage("Please choose a breed.");
      return;
    }

    // build the payload to match the Spot schema. Leave out spottedAt
    // entirely if the user didn't pick a date, so the backend's
    // default (Date.now) kicks in instead of sending an empty string.
    const payload = {
      breedId: selectedBreed.id,
      breedName: selectedBreed.name,
      dogName: formData.dogName,
      location: formData.location,
      notes: formData.notes,
    };
    if (formData.spottedAt) {
      payload.spottedAt = formData.spottedAt;
    }

    setStatus("submitting");
    setErrorMessage("");

    fetch(spotsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body) => {
            throw new Error(body.message || "Failed to save sighting");
          });
        }
        return res.json();
      })
      .then(() => {
        setStatus("success");
        setFormData(emptyForm);
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(err.message);
      });
  };

  return (
    <div className="page">
      <h1>Add a new spotted dog!</h1>
      <p className="subtitle">
        Have a dog sighting you want to add to your collection?
      </p>

      <section className="section-card section-card--plum">
        <form onSubmit={handleSubmit} className="spot-form">
          <label htmlFor="breedId">Breed</label>
          <select
            id="breedId"
            name="breedId"
            value={formData.breedId}
            onChange={handleChange}
            required>
            <option value="">Select a breed...</option>
            {breeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>

          <label htmlFor="dogName">Dog's name (optional)</label>
          <input
            id="dogName"
            name="dogName"
            type="text"
            value={formData.dogName}
            onChange={handleChange}
            maxLength={50}
          />

          <label htmlFor="location">Location (optional)</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Riverside Park"
            value={formData.location}
            onChange={handleChange}
            maxLength={200}
          />

          <label htmlFor="spottedAt">Date spotted (optional)</label>
          <input
            id="spottedAt"
            name="spottedAt"
            type="date"
            value={formData.spottedAt}
            onChange={handleChange}
          />

          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
          />

          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Saving..." : "Log this sighting"}
          </button>

          {status === "success" ? (
            <p className="form-success" role="status">
              Sighting logged! Check your profile to see your full log.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}

export default SpotLog;
