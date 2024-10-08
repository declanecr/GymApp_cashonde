/**
 * This file provides a higher-order component (HOC) for wrapping React components
 * with router-related props using React Router v6 hooks.
 */

import { useLocation, useNavigate, useParams } from "react-router-dom";

/**
 * withRouter Higher-Order Component
 * 
 * @param {React.Component} Component - The component to be wrapped
 * @returns {React.Component} A new component with router props
 * @purpose Inject router-related props into a component
 * @sends Wrapped component to the calling code
 */
export const withRouter = (Component) => {
  function ComponentWithRouterProp(props) {
    // Get current location, navigation function, and URL parameters
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    // Render the wrapped component with additional router props
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
};