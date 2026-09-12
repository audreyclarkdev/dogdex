import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

// Turns a stored ISO date string into the yyyy-mm-dd shape
// <input type="date"> expects.
function toDateInputValue(isoString) {
  return isoString ? isoString.slice(0, 10) : "";
}

// SpotLog page - doubles as both "log a new sighting" (POST) and "edit
// an existing one" (PUT), depending on whether a spot :id is in the
// URL. Reusing one form for both avoids maintaining two nearly
// identical ones - see App.jsx for the /spot-log and /spot-log/:id routes.
function SpotLog() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  // This page is only reachable signed in (see ProtectedRoute in
  // App.jsx), so getToken() should always resolve to a real token here.
  const { getToken } = useAuth();
  const [breeds, setBreeds] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  // status drives the submit button label and the confirmation/error message
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  // Only relevant in edit mode, while the existing spot is being fetched
  const [loadStatus, setLoadStatus] = useState(
    isEditing ? "loading" : "loaded",
  );

  // The photo lives outside formData: a <input type="file"> can't be a
  // controlled input (its value can only be set by the user, not by
  // React), so we track the chosen File object separately.
  const [photoFile, setPhotoFile] = useState(null);
  // A local, temporary URL for showing a newly chosen photo before it's
  // uploaded anywhere - not the Cloudinary URL, which only exists after submit.
  const [previewUrl, setPreviewUrl] = useState(null);
  // The photo already saved on this spot, when editing one that has
  // one - shown until the user picks a different photo to replace it.
  const [existingImageUrl, setExistingImageUrl] = useState(null);
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

  // In edit mode, fetch the existing spot and pre-fill the form with it
  useEffect(
    function () {
      if (!isEditing) return;

      getToken()
        .then((token) =>
          fetch(`${spotsUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        )
        .then((res) => {
          if (!res.ok) throw new Error("Couldn't load that sighting.");
          return res.json();
        })
        .then((spot) => {
          setFormData({
            breedId: spot.breedId,
            dogName: spot.dogName || "",
            location: spot.location || "",
            spottedTimestamp: toDateInputValue(spot.spottedTimestamp),
            notes: spot.notes || "",
          });
          setExistingImageUrl(spot.imageUrl || null);
          setLoadStatus("loaded");
        })
        .catch((err) => {
          console.log(err);
          setLoadStatus("error");
        });
    },
    [id, isEditing, getToken],
  );

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
    fetch(isEditing ? `${spotsUrl}/${id}` : spotsUrl, {
      method: isEditing ? "PUT" : "POST",
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
        if (isEditing) {
          // Editing is a "go do this, then go back" action - the
          // updated card is more useful to see than a bare form.
          navigate("/spotted-dogs");
          return;
        }
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

  if (loadStatus === "loading") {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );
  }

  if (loadStatus === "error") {
    return (
      <div className="page">
        <p className="form-error" role="alert">
          Couldn't load that sighting. It may not exist, or it may belong to
          someone else.
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{isEditing ? "Edit Sighting" : "Add a new spotted dog!"}</h1>
      <p className="subtitle">
        {isEditing
          ? "Update the details of this dog."
          : "Have a dog sighting you want to add to your collection?"}
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

          <label htmlFor="photo">
            {isEditing ? "Replace photo (optional)" : "Photo (optional)"}
          </label>
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
          {/* A newly chosen photo takes priority over whatever's already
              saved - only fall back to the existing one otherwise. */}
          {previewUrl || existingImageUrl ? (
            <img
              src={previewUrl || existingImageUrl}
              alt={
                previewUrl
                  ? "Preview of the photo you selected"
                  : "Current photo for this sighting"
              }
              className="photo-preview"
            />
          ) : null}

          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting"
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Add this dog"}
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
