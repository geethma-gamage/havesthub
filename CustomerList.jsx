import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomerList() {

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/admin/customers")
      .then(res => setCustomers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Customer Details</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Business</th>
            <th>Showrooms</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.full_name}</td>
              <td>{c.email}</td>
              <td>{c.address}</td>
              <td>{c.contact_number}</td>
              <td>{c.business_name}</td>
              <td>{c.showroom_count}</td>
              <td>{c.created_at}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default CustomerList;