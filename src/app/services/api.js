import { createApi } from '@reduxjs/toolkit/query/react';
import { request, gql, ClientError } from 'graphql-request';

const graphqlBaseQuery =
	({ baseUrl }) =>
	async ({ body }) => {
		try {
			const result = await request(baseUrl, body);
			return { data: result };
		} catch (error) {
			if (error instanceof ClientError) {
				return { error: { status: error.response.status, data: error } };
			}
			return { error: { status: 500, data: error } };
		}
	};

function providesPartialList(resultsWithIds, tagType) {
	return resultsWithIds?.results
		? [
				{ type: tagType, id: 'PARTIAL_LIST' },
				...resultsWithIds.data.lessons.nodes.map(({ databaseId }) => ({ type: tagType, databaseId })),
		  ]
		: [{ type: tagType, id: 'PARTIAL_LIST' }];
}

export const api = createApi({
	baseQuery: graphqlBaseQuery({
		baseUrl: process.env.REACT_APP_API_BASE_URL,
	}),
	tagTypes: ['Post'],
	endpoints: (builder) => ({
		getLessons: builder.query({
			query: () => ({
				body: gql`
					query {
						lessons(first: 100) {
							nodes {
								databaseId
								date
								slug
								title
								featuredImage {
									node {
										sourceUrl
									}
								}
								lessonTopics {
									nodes {
										slug
										name
									}
								}
								lessonAudiences {
									nodes {
										slug
										name
									}
								}
								lessonsMeta {
									lessonNumber
									activeSections
									estimatedTime
									readSection {
										audioTrack {
											mediaItemUrl
										}
										track {
											content
											timestampsSeconds
										}
									}
									playSection {
										headline
										content
									}
									rememberSection {
										audioTrack {
											mediaItemUrl
										}
										track {
											content
											timestampsSeconds
										}
									}
									reviewSection {
										fields {
											title
											type
											choices {
												label
											}
										}
									}
									resources {
										resourceTitle
										thumbnail {
											mediaItemUrl
											mediaDetails {
												sizes {
													sourceUrl
													name
												}
											}
										}
										fileOrVideo
										file {
											uri
											guid
											fileSize
										}
										videoLink
										videoLength
									}
								}
							}
						}
					}
				`,
			}),
			transformResponse: (response) => {
				let lessons = [...response.lessons.nodes];

				return lessons.map((lesson) => {
					let permalink = `/${lesson.lessonTopics?.nodes?.length > 0 ? lesson.lessonTopics.nodes[0].slug : 'NO_TOPIC'}/${
						lesson.lessonAudiences?.nodes?.length > 0 ? lesson.lessonAudiences.nodes[0].slug : 'NO_AUDIENCE'
					}/${lesson.lessonsMeta?.lessonNumber !== null ? lesson.lessonsMeta.lessonNumber : 'NO_NUMBER'}/${lesson.slug}`;
					lesson.permalink = permalink;

					return lesson;
				});
			},
			providesTags: (result) => providesPartialList(result, 'Lesson'),
		}),
		getCharacters: builder.query({
			query: () => ({
				body: gql`
					query {
						characters {
							charactersMetadata {
								charactersList {
									carouselIdleAudio {
										mediaItemUrl
									}
									carouselRiveAnimation {
										mediaItemUrl
									}
									carouselSelectedAudio {
										mediaItemUrl
									}
									description
									name
									primaryGradientBottomColor
									primaryGradientTopColor
									secondaryColor
									faceThumbnail {
										mediaItemUrl
									}
									lessonCompleteAsset {
										mediaItemUrl
									}
									lessonCompleteAudio {
										mediaItemUrl
									}
									sectionPopupAsset {
										mediaItemUrl
									}
									sectionPopupAudio {
										mediaItemUrl
									}
								}
							}
						}
					}
				`,
			}),
			transformResponse: (response) => response.characters?.charactersMetadata?.charactersList,
		}),
		getLessonBySlug: builder.query({
			query: (lessonSlug) => ({
				body: gql`
					query {
						lesson(id: "${lessonSlug}", idType: SLUG) {
    						databaseId
							slug
							title
							featuredImage {
								node {
									sourceUrl
								}
							}
							lessonTopics {
								nodes {
									slug
									name
								}
							}
							lessonAudiences {
								nodes {
									slug
									name
								}
							}
							lessonsMeta {
								lessonNumber
								activeSections
								estimatedTime
								readSection {
									audioTrack {
										mediaItemUrl
									}
									track {
										content
										timestampsSeconds
									}
								}
								playSection {
									headline
									content
								}
								rememberSection {
									audioTrack {
										mediaItemUrl
									}
									track {
										content
										timestampsSeconds
									}
                  				}
								reviewSection {
									fields {
										title
										type
										choices {
											label
										}
									}
								}
								resources {
									resourceTitle
									thumbnail {
										mediaItemUrl
										mediaDetails {
											sizes {
												sourceUrl
												name
											}
										}
									}
									fileOrVideo
									file {
										uri
										guid
										fileSize
									}
									videoLink
									videoLength
								}
							}
						}
					}
				`,
			}),
			transformResponse: (response) => {
				let lesson = response.lesson;

				lesson.permalink = `/${lesson.lessonTopics?.nodes?.length > 0 ? lesson.lessonTopics.nodes[0].slug : 'NO_TOPIC'}/${
					lesson.lessonAudiences?.nodes?.length > 0 ? lesson.lessonAudiences.nodes[0].slug : 'NO_AUDIENCE'
				}/${lesson.lessonsMeta?.lessonNumber ? lesson.lessonsMeta.lessonNumber : 'NO_NUMBER'}/${lesson.slug}`;

				return lesson;
			},
			providesTags: (result) => [{ type: 'LESSON', id: result?.lesson ? result.lesson.databaseId : 'NULL' }],
		}),
	}),
});

export const { useGetLessonBySlugQuery, useGetLessonsQuery, useGetCharactersQuery } = api;
