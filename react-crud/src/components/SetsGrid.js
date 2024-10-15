import React from 'react';

const SetsGrid = ({ sets }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Reps</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {sets.map(set => (
          <tr key={set.id}>
            <td>{new Date(set.date).toLocaleDateString()}</td>
            <td>{set.reps}</td>
            <td>{set.weight}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SetsGrid;