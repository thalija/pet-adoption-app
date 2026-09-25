/* --------------------------
   Admin creates new pet profiles, wrapper for the pet form.
   Handles the new pet states, API calls, and transfers data.
   ------------------------- */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetForm from "../../components/admin/PetForm";

// API service to communicate with backend
import { createPet } from "../../services/petsApi";

export default function AdminNewPet() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Pass in these default values for pet object
  const [pet, setPet] = useState({
    name: "",
    animalType: "dog",
    breed: "",
    description: `- Age:
	- Gender:
	- Spayed/Neutered: 
	- Personality: 
    
	Description:
  
`,
    availability: "available",
    petPhoto: "",
    newsItem: "",
    goodWithChildren: false,
    goodWithAnimals: false,
    leashed: false,
    energy: "medium",
  });

  // Send API request to backend server to create a new pet profile
  // and wait for the response
  const handleCreatePet = async () => {
    try {
      setLoading(true);

      // Use API adapter
      await createPet(pet);

      alert("Pet profile successfully added.");
      navigate("/admin/pets");
    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Failed, pet not added. Could not connect network or server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="create-pet-page">
      <h1>Add New Pet Profile</h1>
      <p>All fields are required and must be completed.</p>

      <PetForm
        pet={pet}               // Send pet form the object details
        setPet={setPet}         // Gives pet form permission to update fields
        onSubmit={handleCreatePet}
        submitLabel="Save Pet"
        loading={loading}
        onCancel={() => navigate("/admin/pets")}
      />
    </article>
  );
}
