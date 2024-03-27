import React from 'react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import PropTypes from 'prop-types'; // Import PropTypes if needed

function App({ router }) {
  return (
    <BrowserRouter>
      {router} {/* Render the router */}
    </BrowserRouter>
  );
}

App.propTypes = {
  router: PropTypes.element.isRequired, // Add PropTypes validation
};

export default App;
