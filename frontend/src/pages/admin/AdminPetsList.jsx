/* --------------------------
   Admin homepage, search for pets, edit, and delete pet profiles
   ------------------------- */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPets, deletePet } from "../../services/petsApi";

export default function AdminPetsList() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load all pets on page load
  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      setError("");

      try {
        // Get all pet profiles from backend
        const data = await getPets();
        setPets(data);
      } catch (err) {
        setError(err.message || "Failed to load pets");
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  // Pets search function to not refresh page and use admin input as search id
  const petSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Search pets by Pet ID (calls backend instead of filtering fake data)
      const data = await getPets({ petId: searchInput });
      setPets(data);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Clear button - removes inputs and reloads full pets list from backend
  const clearSearch = async () => {
    setSearchInput("");

    setLoading(true);
    setError("");

    try {
      // Reload all pet profiles
      const data = await getPets();
      setPets(data);
    } catch (err) {
      setError(err.message || "Failed to reload pets");
    } finally {
      setLoading(false);
    }
  };

  // Delete confirmation
  const confirmDelete = async () => {
    const id = confirmDeleteId;
    // reset pet ID to null
    setConfirmDeleteId(null);
    setLoading(true);
    setError("");

    try {
      // Delete pet in backend
      await deletePet(id);

      // Reload list from backend
      const data = await getPets();
      setPets(data);
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Loop through pets array and find matching pet ID to delete
  const petToDelete = pets.find(
    (pet) => String(pet.petId) === String(confirmDeleteId)
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>Manage Pet Profiles</h1>

      {/*Pet ID search box format */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "16px 0" }}>
        <form onSubmit={petSearch} style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Search by Pet ID"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          {/*Search button - results don't get filtered until search is pressed */}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Search
          </button>

          {/*Clear button - removes inputs */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={clearSearch}
            disabled={loading}
          >
            Clear
          </button>
        </form>
      </div>

      {/* Loading and error messages for API calls */}
      {loading && <div style={{ marginBottom: 12 }}>Loading…</div>}
      {error && <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>}

      {/* Table Style and Fields */}
      <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th style={{ padding: 10 }}>ID</th>
              <th style={{ padding: 10 }}>Type</th>
              <th style={{ padding: 10 }}>Breed</th>
              <th style={{ padding: 10 }}>Name</th>
              <th style={{ padding: 10 }}>Availability</th>
              <th style={{ padding: 10 }}>Photo</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/*Filtered Pet Result Style */}
            {pets.map((pet) => (
              <tr key={pet.petId} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{pet.petId}</td>
                <td style={{ padding: 10 }}>{pet.animalType}</td>
                <td style={{ padding: 10 }}>{pet.breed}</td>
                <td style={{ padding: 10 }}>{pet.name}</td>
                <td style={{ padding: 10 }}>{pet.availability}</td>

                {/* Photo thumbnail */}
                <td style={{ padding: 10 }}>
                  {pet.petPhoto ? (
                    <img
                      src={pet.petPhoto}
                      alt={pet.name ? `${pet.name} photo` : "Pet photo"}
                      style={{
                        width: 44,
                        height: 44,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        display: "block",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        // Hide broken images instead of showing a broken-image icon
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        border: "1px dashed #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#777",
                      }}
                    >
                      —
                    </div>
                  )}
                </td>

                <td style={{ padding: 10, display: "flex", gap: 7 }}>
                  <button
                    type="button"
                    className="btn btn-sm"
                    // Match route path from App.jsx pets:/:petId/edit
                    onClick={() => navigate(`/admin/pets/${pet.petId}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => setConfirmDeleteId(pet.petId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* If no pets are found after searching, default message */}
            {pets.length === 0 && !loading && (
              <tr>
                <td style={{ padding: 14 }} colSpan={7}>
                  No pet profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation window for deleting, yes or cancel  */}
      {confirmDeleteId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div style={{ background: "white", padding: 25, borderRadius: 10, width: 350 }}>
            {/*Display the pet name and pet ID with confirmation*/}
            <p>
              Delete pet <strong>{petToDelete?.name} </strong> (ID: {confirmDeleteId})?
            </p>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>

              <button type="button" className="btn btn-sm" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

