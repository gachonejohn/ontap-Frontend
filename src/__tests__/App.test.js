
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import { ReduxProvider } from '../store/provider'; 

test('renders Employee Dashboard Home when navigating to /dashboard/employees', () => {

  render(
    <ReduxProvider>
      <Router>
        <App />
      </Router>
    </ReduxProvider>
  );


  window.history.pushState({}, 'Employees Page', '/dashboard/employees');


  expect(screen.getByText(/Employee Dashboard Home/i)).toBeInTheDocument();
});
