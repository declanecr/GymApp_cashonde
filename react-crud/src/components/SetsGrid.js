import PropTypes from 'prop-types';
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

SetsGrid.propTypes = {
  sets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      reps: PropTypes.number.isRequired,
      weight: PropTypes.number.isRequired
    })
  ).isRequired
};

export default SetsGrid;