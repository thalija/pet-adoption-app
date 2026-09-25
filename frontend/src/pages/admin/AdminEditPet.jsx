/* --------------------------
   Admin page to edit an existing pet profile
   - Loads pet from backend by petId
   - Saves changes back to backend
------------------------- */

// Citation for: localStorage
// Date: 02/01/2026
// Adapted from
// Source URL: https://www.robinwieruch.de/local-storage-react/

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PetForm from "../../components/admin/PetForm";
import "../../components/admin/PetForm.css";

// API service between React components and backend API
import { getPets, updatePet as updatePetApi } from "../../services/petsApi";

export default function AdminEditPet() {
  const { petId } = useParams(); // Grabs the petId from the URL
  const numericPetId = Number(petId);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pet, setPet] = useState(null); // null=loading pet data, object=found pet data
  const [noPet, setNoPet] = useState(false); // false=found pet, true=not found

  // Load pet by id (from backend)
  useEffect(() => {
    const loadPet = async () => {
      setLoading(true);

      try {
        // If we're passed a petID send the backend a request with it
        // This should return an array (0 or 1 pet) based on getPets()
        const data = await getPets({ petId: numericPetId });

        // If backend returns [], pet isn't found
        if (!Array.isArray(data) || data.length === 0) {
          setNoPet(true);
          setPet(null); // Pet not found
        } else {
          const petToEdit = data[0];

          // Create a copy to edit to avoid updating the source values
          // If left value is null/undefined, use right value
          setPet({
            petId: petToEdit.petId,
            name: petToEdit.name ?? "",
            animalType: petToEdit.animalType ?? "dog",
            breed: petToEdit.breed ?? "",
            description: petToEdit.description ?? "",
            availability: petToEdit.availability ?? "available",
            petPhoto: petToEdit.petPhoto ?? "",
            newsItem: petToEdit.newsItem ?? "",
            goodWithChildren: Boolean(petToEdit.goodWithChildren),
            goodWithAnimals: Boolean(petToEdit.goodWithAnimals),
            leashed: Boolean(petToEdit.leashed),
            energy: petToEdit.energy ?? "medium",
          });

          setNoPet(false);
        }
      } catch (err) {
        console.error(err);
        setNoPet(true);
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [numericPetId]);

  // Send API request to backend server to update pet profile
  // and wait for the response
  const updatePet = async () => {
    if (!pet) return;

    setLoading(true);

    try {
      await updatePetApi(numericPetId, pet);

      alert("Pet profile successfully updated.");
      navigate("/admin/pets");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update pet profile.");
    } finally {
      setLoading(false);
    }
  };

  // Still loading pet data
  if (loading && pet === null && noPet === false) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  // If pet isn't found
  if (noPet === true) {
    return (
      <div style={{ padding: 24 }}>
        <p>Couldn’t load pet #{petId}.</p>
        <button className="btn btn-secondary" onClick={() => navigate("/admin/pets")}>
          Back
        </button>
      </div>
    );
  }

  // If pet data hasn’t loaded yet, show loading
  if (pet === null) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  // Page name formatting
  return (
    <article className="create-pet-page">
      <h1>
        Edit Pet:&nbsp;&nbsp;
        <span style={{ color: "#1976d2", fontWeight: 600 }}>{pet.name}</span>
        <span style={{ color: "#777", fontSize: "1em", marginLeft: 8 }}>
          (ID #{petId})
        </span>
      </h1>

      {/* Populate fields with data found */}
      <PetForm
        pet={pet}
        setPet={setPet}
        onSubmit={updatePet}
        submitLabel="Save Changes"
        loading={loading}
        onCancel={() => navigate("/admin/pets")}
      />
    </article>
  );
}
