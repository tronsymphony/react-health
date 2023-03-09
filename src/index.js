import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

const AuthProviderWithHistory = ({ children }) => {
	const navigate = useNavigate();
	const isStaging = window.location.origin.includes('pixelsmith') || window.location.origin.includes('localhost');

	return (
		<Auth0Provider
			domain={isStaging ? process.env.REACT_APP_AUTH0_CLIENT_DOMAIN : process.env.REACT_APP_PRODUCTION_AUTH0_CLIENT_DOMAIN}
			clientId={isStaging ? process.env.REACT_APP_AUTH0_CLIENT_ID : process.env.REACT_APP_PRODUCTION_AUTH0_CLIENT_ID}
			redirectUri={window.location.origin}
			onRedirectCallback={(appState) => {
				console.log(appState);
				if (appState?.returnTo) navigate(appState.returnTo);
			}}>
			{children}
		</Auth0Provider>
	);
};

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<AuthProviderWithHistory>
				<App />
			</AuthProviderWithHistory>
		</BrowserRouter>
	</Provider>
);
