import { useState } from "react";

function Matching() {

  const [matches] = useState([
    {
      user1: "John",
      user2: "Alex",
      score: 85
    },
    {
      user1: "Sarah",
      user2: "Emma",
      score: 72
    },
    {
      user1: "David",
      user2: "Chris",
      score: 65
    }
  ]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Suggested Roommates</h2>

      {matches.map((m, index) => (
        <div key={index} style={{
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px 0",
          borderRadius: "8px"
        }}>
          <p><b>{m.user1}</b> ↔ <b>{m.user2}</b></p>
          <p>Compatibility Score: {m.score}%</p>
        </div>
      ))}
    </div>
  );
}

export default Matching;