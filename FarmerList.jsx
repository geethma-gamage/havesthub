import React, { useEffect, useState } from "react";
import axios from "axios";

function FarmerList() {

  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/admin/farmers")
      .then(res => setFarmers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (

    <div>
      <h2>Farmer Details</h2>

      <table border="1" width="100%">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Farm Name</th>
            <th>Location</th>
            <th>Contact</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>

          {farmers.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.full_name}</td>
              <td>{f.email}</td>
              <td>{f.farm_name}</td>
              <td>{f.location}</td>
              <td>{f.contact_number}</td>
              <td>{f.created_at}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default FarmerList;