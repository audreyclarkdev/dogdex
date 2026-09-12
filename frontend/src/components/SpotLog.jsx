import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/react";

// API Urls - points at the Express backend running in /backend (port 3000)
const breedsUrl = "http://localhost:3000/api/breeds";
const spotsUrl = "http://localhost:3000/api/spots";

// what a fresh, empty form looks like
const emptyForm = {
  breedId: "",
  dogName: "",
  location: "",
  spottedTimestamp: "",
  notes: "",
};

// SpotLog page - a form for logging a dog you spotted in the wild.
// Submits to /api/spots, which stores it as its own Spot document
// (separate from the Breed data, since a breed can be spotted many times).
function SpotLog() {
  // This page is only reachable signed in (see ProtectedRoute in
  // App.jsx), so getToken() should always resolve to a real token here.
  const { getToken } = useAuth();
  const [breeds, setBreeds] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  // status drives the submit button label and the confirmation/error message
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  // The photo lives outside formData: a <input type="file"> can't be a
  // controlled input (its value can only be set by the user, not by
  // React), so we track the chosen File object separately.
  const [photoFile, setPhotoFile] = useState(null);
  // A local, temporary URL for showing the chosen photo before it's
  // uploaded anywhere - not the Cloudinary URL, which only exists after submit.
  const [previewUrl, setPreviewUrl] = useState(null);
  // Lets handleSubmit clear the actual <input type="file"> element after
  // a successful submit - React can reset formData's text fields, but it
  // can't reset a file input's displayed filename by changing state.
  const fileInputRef = useRef(null);

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

  // called when the user picks or takes a photo
  const handlePhotoChange = (event) => {
    const file = event.target.files[0] || null;
    setPhotoFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  // Object URLs aren't garbage-collected automatically, so release the
  // current one whenever it's replaced (a new photo picked, the photo
  // cleared after submit) or the component unmounts.
  useEffect(
    function () {
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      };
    },
    [previewUrl],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedBreed = breeds.find((breed) => breed.id === formData.breedId);
    if (!selectedBreed) {
      setStatus("error");
      setErrorMessage("Please choose a breed.");
      return;
    }

    // FormData (not JSON) because the photo needs to travel as
    // multipart/form-data. Leave spottedTimestamp out entirely if the
    // user didn't pick a date, so the backend's default (Date.now)
    // kicks in instead of sending an empty string.
    const payload = new FormData();
    payload.append("breedId", selectedBreed.id);
    payload.append("breedName", selectedBreed.name);
    payload.append("dogName", formData.dogName);
    payload.append("location", formData.location);
    payload.append("notes", formData.notes);
    if (formData.spottedTimestamp) {
      payload.append("spottedTimestamp", formData.spottedTimestamp);
    }
    if (photoFile) {
      payload.append("photo", photoFile);
    }

    setStatus("submitting");
    setErrorMessage("");

    const token = await getToken();

    // No Content-Type header here on purpose - the browser sets
    // multipart/form-data with the correct boundary itself. Setting it
    // manually would drop the boundary and the server couldn't parse the body.
    // Authorization carries the Clerk session token so the backend can
    // verify who's making the request and stamp userId itself.
    fetch(spotsUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
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
        setPhotoFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
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

          <label htmlFor="spottedTimestamp">Date spotted (optional)</label>
          <input
            id="spottedTimestamp"
            name="spottedTimestamp"
            type="date"
            value={formData.spottedTimestamp}
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

          <label htmlFor="photo">Photo (optional)</label>
          {/* capture="environment" hints mobile browsers to offer the
              rear camera directly; on desktop (or if the user taps the
              gallery option on mobile) this is a normal file picker. */}
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            ref={fileInputRef}
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview of the photo you selected"
              className="photo-preview"
            />
          ) : null}

          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Saving..." : "Add this dog"}
          </button>

          {status === "success" ? (
            <p className="form-success" role="status">
              Dog logged! Check your collection to see your spotted dogs.
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
