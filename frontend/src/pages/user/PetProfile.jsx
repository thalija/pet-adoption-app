import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPets } from "../../services/petsApi";
import "./PetProfile.css";

export default function PetProfile() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPets({ petId }); // fetch single pet
        if (data && data.length > 0) {
          setPet(data[0]);
        } else {
          setPet(null);
        }
      } catch (err) {
        setError(err.message || "Failed to load pet");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  if (loading) return <p>Loading pet profile…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!pet) return <p>Pet not found.</p>;

  return (
    <div className="pet-profile-container">
      <div className="pet-profile-card">
        <h1 className="pet-profile-title">{pet.name}</h1>

        <div className="pet-profile-main">
          {pet.petPhoto && (
            <img
              src={pet.petPhoto}
              alt={pet.name}
              className="pet-profile-image"
            />
          )}

          <div className="pet-profile-details">
            <p>
              <strong>Type:</strong> {pet.animalType}
            </p>
            <p>
              <strong>Breed:</strong> {pet.breed}
            </p>
            <p>
              <strong>Energy Level:</strong> {pet.energy}
            </p>
            <p>
              <strong>Availability:</strong> {pet.availability}
            </p>

            <div className="pet-profile-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => navigate("/shelter")}
              >
                Interested?
              </button>
            </div>
          </div>
        </div>

        <section className="pet-profile-section">
          <h3>Description</h3>
          <p className="pet-profile-description">{pet.description}</p>
        </section>

        <section className="pet-profile-section">
          <h3>Traits</h3>
          <p>
            <strong>Good With Children:</strong>{" "}
            {pet.goodWithChildren ? "Yes" : "No"}
          </p>
          <p>
            <strong>Good With Animals:</strong>{" "}
            {pet.goodWithAnimals ? "Yes" : "No"}
          </p>
          <p>
            <strong>Must Be Leashed:</strong> {pet.leashed ? "Yes" : "No"}
          </p>
        </section>

        <section className="pet-profile-section">
          <h3>News Item</h3>
          <p>{pet.newsItem}</p>
        </section>
      </div>
    </div>
  );
}