/* --------------------------
   Shelter Info Page (single shelter for all pets)
   ------------------------- */
   import React from "react";
   import "./ShelterInfo.css";
   
   export default function ShelterInfo() {
     const shelter = {
       name: "Happy Tails Animal Shelter",
       address1: "1234 Shelter Rd",
       address2: "San Diego, CA 92101",
       phone: "(619) 555-0123",
       email: "adoptions@example.org",
       hours: [
         "Mon–Fri: 10:00 AM – 6:00 PM",
         "Sat: 10:00 AM – 4:00 PM",
         "Sun: Closed",
       ],
     };
   
     const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
       `${shelter.address1}, ${shelter.address2}`
     )}`;
   
     return (
       <div className="shelter-page">
         <h1 className="shelter-title">Shelter Information</h1>
   
         <div className="shelter-card">
           <h2 className="shelter-name">{shelter.name}</h2>
   
           <div className="shelter-section">
             <h3>Address</h3>
             <p>{shelter.address1}</p>
             <p>{shelter.address2}</p>
             <a className="shelter-link" href={mapsUrl} target="_blank" rel="noreferrer">
               Open in Google Maps
             </a>
           </div>
   
           <div className="shelter-section">
             <h3>Contact</h3>
             <p>
               Phone:{" "}
               <a className="shelter-link" href={`tel:${shelter.phone}`}>
                 {shelter.phone}
               </a>
             </p>
             <p>
               Email:{" "}
               <a className="shelter-link" href={`mailto:${shelter.email}`}>
                 {shelter.email}
               </a>
             </p>
           </div>
   
           <div className="shelter-section">
             <h3>Business Hours</h3>
             <ul className="shelter-hours">
               {shelter.hours.map((h) => (
                 <li key={h}>{h}</li>
               ))}
             </ul>
           </div>
         </div>
       </div>
     );
   }