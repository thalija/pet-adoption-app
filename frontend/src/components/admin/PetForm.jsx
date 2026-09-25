/* --------------------------
   Form used to create a new pet profile.
   Inputs and UI are maintained here, states/API calls/routing
   is handled by the AdminNewPet.jsx code.
   ------------------------- */

// Citation for the following: ... Copying old states and fields
// Date: 02/01/2026
// Adapted from
// Source URL: https://react.dev/learn/updating-objects-in-state

import "./PetForm.css";

// Receive inputs from AdminNewPet wrapper
export default function PetForm({
  pet,
  setPet,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  onCancel,
}) {
  return (
    <div className="pet-form-wrapper">
      {/* Pet Photo Display */}
      <div className="pet-photo-float">
        {pet.petPhoto ? (
          <img
            src={pet.petPhoto}
            // If image fails to load
            alt={pet.name ? `${pet.name} photo` : "Pet photo"}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="pet-photo-placeholder">No photo URL yet</div>
        )}
      </div>

      <table className="AddPetTable">
        <tbody>
          <tr>
            {/* Pet name entry */}
            <td>
              <div className="form-field">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={pet.name}
                  onChange={(e) => setPet({ ...pet, name: e.target.value })}
                />
              </div>
            </td>

            {/* Pet type entry */}
            <td>
              <div className="form-field">
                <label className="form-label">Animal Type</label>
                <select
                  className="form-control"
                  value={pet.animalType}
                  onChange={(e) => setPet({ ...pet, animalType: e.target.value })}>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </td>

            {/* Pet breed entry */}
            <td>
              <div className="form-field">
                <label className="form-label">Breed {" "}
                  <span 
                    title="Pick from the suggestions or type breed in manually."
                    style={{cursor: "help"}}>
                      ⓘ

                  </span>
                </label>
                <input
                  className="form-control"
                  value={pet.breed}
                  onChange={(e) => setPet({ ...pet, breed: e.target.value })}
                  list={
                    pet.animalType === "dog" ? "dog-breeds"
                    : pet.animalType === "cat" ? "cat-breeds" 
                    : pet.animalType === "other" ? "other-breeds"
                    : undefined 
                  }
                />
                {/* DOG BREEDS */}
                <datalist id="dog-breeds">
                  <option value="Beagle" />
                  <option value="Bulldog" />
                  <option value="Corgi" />
                  <option value="Doodle" />
                  <option value="German Shepherd" />
                  <option value="Golden Retriever" />
                  <option value="Labrador Retriever" />
                  <option value="Maltese" />
                  <option value="Poodle" />
                  <option value="Mixed" />
                </datalist>

                {/* CAT BREEDS */}
                <datalist id="cat-breeds">
                  <option value="Domestic Longhair" />
                  <option value="Domestic Mediumhair" />
                  <option value="Domestic Shorthair" />
                  <option value="Maine Coon" />
                  <option value="Ragdoll" />
                  <option value="Siamese" />
                  <option value="Mixed" />
                  </datalist>

                {/* OTHER BREEDS */}
                <datalist id="other-breeds">
                  <option value="Bearded Dragon" />
                  <option value="Cockatiel" />
                  <option value="Guinea Pig" />
                  <option value="Hamster" />
                  <option value="Rabbit" />
                  <option value="Snake" />
                  <option value="Tortoise" />
                  </datalist>

              </div>
            </td>

            {/* Pet energy entry */}
            <td>
              <div className="form-field">
                <label className="form-label">Energy</label>
                <select
                  className="form-control"
                  value={pet.energy}
                  onChange={(e) => setPet({ ...pet, energy: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </td>

            {/* Pet availability entry (NO small photo here anymore) */}
            <td>
              <div className="form-field">
                <label className="form-label">Availability</label>
                <select
                  className="form-control"
                  value={pet.availability}
                  onChange={(e) => setPet({ ...pet, availability: e.target.value })}>
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="not_available">Not Available</option>
                  <option value="adopted">Adopted</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Traits Check Boxes */}
      <div className="traits-row">
        <strong>Traits:</strong>
        <div className="traits-options">
          <label>
            <input
              type="checkbox"
              checked={Boolean(pet.goodWithChildren)}
              onChange={(e) =>
                setPet({ ...pet, goodWithChildren: e.target.checked ? 1 : 0 })}
            />{" "}
            Good with children
          </label>

          <label>
            <input
              type="checkbox"
              checked={Boolean(pet.goodWithAnimals)}
              onChange={(e) =>
                setPet({ ...pet, goodWithAnimals: e.target.checked ? 1 : 0 })}
            />{" "}
            Good with other animals
          </label>

          <label>
            <input
              type="checkbox"
              checked={Boolean(pet.leashed)}
              onChange={(e) => setPet({ ...pet, leashed: e.target.checked ? 1 : 0 })}
            />{" "}
            Animal must be leashed at all times
          </label>
        </div>
      </div>

      {/* Description Entry */}
      <div className="form-section">
        <label className="form-label">Description</label>
        <p className="helper-text">Add accurate information about the pet.</p>
        <textarea
          className="form-control form-textarea"
          value={pet.description}
          onChange={(e) => setPet({ ...pet, description: e.target.value })}
          rows={5}
        />
      </div>

      {/* Photo URL */}
      <div className="form-section">
        <label className="form-label">Photo URL</label>
        <input
          className="form-control"
          value={pet.petPhoto}
          onChange={(e) => setPet({ ...pet, petPhoto: e.target.value })}
        />
      </div>

      {/* News */}
      <div className="form-section">
        <label className="form-label">News Item (optional)</label>
        <textarea
          className="form-control form-textarea"
          value={pet.newsItem}
          onChange={(e) => setPet({ ...pet, newsItem: e.target.value })}
          rows={4}
          placeholder={`Updates such as: 
          - Foster status
          - Medical notes
          - Where to contact for meetups`}
        />
      </div>

      {/* Buttons */}
      <div className="button-panel">
        <button
          type="button"
          className="btn btn-primary"
          disabled={loading}
          onClick={onSubmit}
        >
          {loading ? "Saving..." : submitLabel}
        </button>

        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}