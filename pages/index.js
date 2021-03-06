import DefaultPageLayout from '../components/DefaultPageLayout';
import IdeasLoader from '../components/IdeasLoader';
import TopButtonWrapper from '../components/TopButtonWrapper';
import { api } from '../services/api';

import Head from 'next/head';

export default function index(props) {
	return (
		<DefaultPageLayout>
			<Head>
				<title>StartUpIdeas</title>
			</Head>
			<TopButtonWrapper />
			<IdeasLoader data={props.data} maxIndex={props.maxIndex} />
		</DefaultPageLayout>
	);
}

export const getStaticProps = async () => {
	const res = await api.get('/idea');
	const maxIndex = await api.get('/ideas_total_count');

	return {
		props: {
			data: res.data,
			maxIndex: maxIndex.data.count,
		},
		revalidate: 1,
	};
};
