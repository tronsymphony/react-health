// import { useEffect } from 'react';
// import ReactGA from 'react-ga4';
import { useAuth0 } from '@auth0/auth0-react';

const SsoGate = ({ children }) => {
	const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

	// useEffect(() => {
	// 	if (!user) return;

	// 	ReactGA.event({
	// 		category: 'User',
	// 		action: 'Login',
	// 		label: user.sub,
	// 	});
	// }, [user]);

	if (window.location.origin.includes('pixelsmith') || window.location.origin.includes('localhost')) return children;

	return isLoading ? null : isAuthenticated ? children : loginWithRedirect({ appState: { returnTo: window.location.pathname } });
};

export default SsoGate;
