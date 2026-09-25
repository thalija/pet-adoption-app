/* --------------------------------------------------------
   User homepage listing all available pets for adoption
   --------------------------------------------------------*/



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPets } from "../../services/petsApi";
import "../../App.css";


export default function UserHome() {
    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // Store the current value of the search form
    const [searchInput, setSearchInput] = useState({
        type: "",
        breed: "",
        availability: "",
        dateCreated: "",
        dispositions: [],
    });
    // Store the applied search input to filter the pets list
    const [filters, setFilters] = useState({
        type: "",
        breed: "",
        availability: "",
        dateCreated: "",
        dispositions: [],
    });

    // Fetch pets from backend on mount
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPets(); // fetch all pets
        setPets(data);
      } catch (err) {
        setError(err.message || "Failed to load pets");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

    // Update search form state when the user changes a select, checkbox, or date input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type == "checkbox") {
            // Add/Remove the checkbox value in the dispositions array
            setSearchInput(prev => ({
                ...prev,
                dispositions: checked
                    ? [...prev.dispositions, value]
                    : prev.dispositions.filter(disposition => disposition !== value)
            }));
        } else {
            // For select or date inputs, update the related field
            setSearchInput(prev => ({
                ...prev, [name]: value
            }));
        }
    };
    // Apply filters when search button is clicked 
    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(searchInput);
    };

    // Unique, sorted list of breeds for the Breed dropdown (limited to the selected animal type)
    const breedOptions = [...new Set(
        pets
            .filter((pet) => !searchInput.type || pet.animalType === searchInput.type)
            .map((pet) => pet.breed)
            .filter(Boolean)
    )].sort();

    // Create a new array of pets that only includes pets matching the search input
    const filteredPets = pets.filter((pet) => {
    let petDateOnly = "";
    if (pet?.dateCreated) {
      const d = new Date(pet.dateCreated);
      if (!Number.isNaN(d.getTime())) petDateOnly = d.toISOString().split("T")[0];
    }
      
        return (
          (!filters.type || pet.animalType === filters.type) &&
          (!filters.breed || pet.breed === filters.breed) &&
          (!filters.availability || pet.availability === filters.availability) &&
          (!filters.dateCreated || petDateOnly === filters.dateCreated) &&
          (filters.dispositions.length === 0 ||
            filters.dispositions.every((disposition) => pet[disposition]))
        );
      });
    if (loading) return <p>Loading pets...</p>;
    if (error) return <p className="error">{error}</p>;
    return (
        <div>

        <h1>User Home Page</h1>
        {/* Form for Seearch Functionality */}
        <form onSubmit={handleSearch} className="search-form">
            <h2>Search for Pet</h2>
            {/* Animal Type */}
            <div className="form-group">
                <label>
                    Type:
                    <select name="type" onChange={handleChange}>
                        <option value="">All</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="other">Other</option>
                    </select>
                </label>
            </div>
            {/* Breed */}
            <div className="form-group">
                <label>
                    Breed:
                    <select name="breed" onChange={handleChange}>
                        <option value="">All</option>
                        {/* Breeds come from the pets that are actually listed */}
                        {breedOptions.map((breed) => (
                            <option key={breed} value={breed}>{breed}</option>
                        ))}
                    </select>
                </label>
            </div>
            {/* Disposition */}
            <div className="form-group">
                <fieldset>
                    <legend>Disposition:</legend>
                    <label>
                        <input
                            type="checkbox"
                            name="dispositions"
                            value="goodWithAnimals"
                            onChange={handleChange}
                        />
                        Good with other animals
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="dispositions"
                            value="goodWithChildren"
                            onChange={handleChange}
                        />
                        Good with children
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="dispositions"
                            value="leashed"
                            onChange={handleChange}
                        />
                        Animal must be leashed at all times
                    </label>
                </fieldset>
            </div>
            {/* Date Created */}
            <div className="form-group">
                <label>
                    Date Created:
                    <input
                        type="date"
                        name="dateCreated"
                        onChange={handleChange}
                    />
                </label>
            </div>
            {/* Availability */}
            <div className="form-group">
                <label>
                    Availability:
                    <select name="availability" onChange={handleChange}>
                        <option value="">All</option>
                        <option value="not_available">Not Available</option>
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="adopted">Adopted</option>
                    </select>
                </label>
            </div >
            <div className="form-group">
                <button type="submit">Search</button>
            </div>
        </form>
        {/* Pets table */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: 10 }}>Type</th>
                <th style={{ padding: 10 }}>Breed</th>
                <th style={{ padding: 10 }}>Name</th>
                <th style={{ padding: 10 }}>Availability</th>
                <th style={{ padding: 10 }}>Photo</th>
                <th style={{ padding: 10 }}>View</th>
              </tr>
        </thead>
        <tbody>
            {filteredPets.map(pet => (
                <tr key={pet.petId}>
                    <td>{pet.animalType}</td>
                    <td>{pet.breed}</td>
                    <td>{pet.name}</td>
                    <td>{pet.availability}</td>
                    {/* Pet Photo */}
                    <td style={{ padding: 10 }}>
                        <img 
                            src={pet.petPhoto} 
                            alt={pet.name} 
                            width="44" 
                            height= "44" 
                        />
                    </td>
                    <td>
                    <button onClick={() => navigate(`/pets/${pet.petId}`)}>View</button>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>
        </div>
        </div>
    );
}     

