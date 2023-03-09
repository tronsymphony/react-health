import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
// import ReactGA from 'react-ga4';
import * as Views from './views';
import { LoadingScreen, LoginForm, SsoGate } from './components';
import { useSoundEffects } from './helpers/useSoundEffects';

function App() {
	const { loadingScreenActive, soundEffectsLoading } = useSelector((state) => state.ui);
	const { preloadSounds } = useSoundEffects();

	const isLoading = useSelector((state) => {
		return Object.values(state.api.queries).some((query) => {
			return query && query.status === 'pending';
		});
	});

	// ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {
	// 	testMode: process.env.NODE_ENV === 'development',
	// 	debug: process.env.NODE_ENV === 'development',
	// });

	useEffect(() => {
		preloadSounds();
	}, [preloadSounds]);

	return (
		<SsoGate>
			<LoadingScreen visible={isLoading || loadingScreenActive || soundEffectsLoading} />
			<Routes>
				<Route path="/">
					<Route index element={<LoginForm />} />
					<Route path="utility" element={<Views.Home />} />
					<Route path="playground" element={<Views.Playground />} />
					<Route path=":lessonSlug" element={<Views.Lesson />} />
					<Route path=":lessonSlug/:sectionSlug" element={<Views.Lesson />} />
					<Route path=":topic/:audience/:lessonNumber/:lessonSlug" element={<Views.Lesson />} />
					{/* <Route path=":topic/:audience/:lessonSlug/:sectionSlug" element={<Views.Lesson />} /> */}
					<Route path=":topic/:audience/:lessonNumber/:lessonSlug/:sectionSlug" element={<Views.Lesson />} />
				</Route>
			</Routes>
		</SsoGate>
	);
}

export default App;
