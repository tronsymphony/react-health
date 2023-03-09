import { useGetLessonsQuery } from '../../app/services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentLesson } from '../../app/uiSlice';

const Home = (props) => {
	const { data } = useGetLessonsQuery();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	return (
		<div className="container">
			<h2 className="mb-4">Lessons:</h2>
			{data && (
				<ul className="space-y-10">
					{data.map((lesson) => (
						<li key={lesson.databaseId} className="space-y-1">
							<p className="text-sm">
								{lesson.lessonTopics?.nodes?.length > 0 ? lesson.lessonTopics.nodes[0].name : 'NO_TOPIC'} &mdash;{' '}
								{lesson.lessonAudiences?.nodes?.length > 0 ? lesson.lessonAudiences.nodes[0].slug : 'NO_AUDIENCE'}
							</p>
							<h4>
								<button
									className="link"
									onClick={() => {
										dispatch(setCurrentLesson(lesson));
										navigate(lesson.permalink ? `${lesson.permalink}/checkin` : `/${lesson.slug}/checkin`);
									}}>
									{lesson.title}
								</button>
							</h4>
							<p className="text-sm">
								<b>Read section audio:</b> {lesson.lessonsMeta?.readSection?.audioTrack?.mediaItemUrl}
							</p>
							<p className="text-sm">
								<b>Remember section audio:</b> {lesson.lessonsMeta?.rememberSection?.audioTrack?.mediaItemUrl}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Home;
