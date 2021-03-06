import { api } from '../../services/api';

import style from '/styles/IdeaPage.module.css';

import TopButtonWrapper from '../../components/TopButtonWrapper';
import { Comment } from '../../components/Comment';
import { CommentEntry } from '../../components/CommentEntry';
import DefaultPageLayout from '../../components/DefaultPageLayout';
import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';

import Head from 'next/head';
import IdeasLoader from '../../components/IdeasLoader';
import { StickyShareButtons } from 'sharethis-reactjs';
// import { VoteBox } from '../../components/VoteBox';

export default function IdeaPage(props) {
	const { idea } = props;

	const router = useRouter();

	let [comments, setComments] = useState([]);

	function addCallback(res) {}

	return (
		<DefaultPageLayout>
			<Head>
				<title>{(idea && idea.title) || 'StartUpIdeas'}</title>
			</Head>
			<TopButtonWrapper />
			<div>
				<div className='paper-like' id={style.idea}>
					<div>
						<h1>{(idea && idea.title) || 'loading...'}</h1>
						<p>{(idea && idea.description) || 'loading...'}</p>
					</div>
					{/* <VoteBox id={id} /> */}
					<StickyShareButtons
						config={{
							alignment: 'left', // alignment of buttons (left, right)
							color: 'white', // set the color of buttons (social, white)
							enabled: true, // show/hide buttons (true, false)
							font_size: 14, // font size for the buttons
							hide_desktop: false, // hide buttons on desktop (true, false)
							labels: 'cta', // button labels (cta, counts, null)
							language: 'en', // which language to use (see LANGUAGES)
							min_count: 0, // hide react counts less than min_count (INTEGER)
							networks: [
								// which networks to include (see SHARING NETWORKS)
								'facebook',
								'twitter',
								'pinterest',
								'reddit',
								'tumblr',
							],
							padding: 11, // padding within buttons (INTEGER)
							radius: 11, // the corner radius on each button (INTEGER)
							show_total: true, // show/hide the total share count (true, false)
							show_mobile: true, // show/hide the buttons on mobile (true, false)
							show_toggle: true, // show/hide the toggle buttons (true, false)
							size: 44, // the size of each button (INTEGER)
							top: 160, // offset in pixels from the top of the page
						}}
					/>
				</div>
				<div className='paper-like'>
					<CommentEntry id={idea && idea.id} addCallback={addCallback} />
					{comments.map((item) => {
						return <Comment key={item.id} {...item}></Comment>;
					})}
					{!comments.length ? (
						<div
							style={{
								fontFamily: "'Kalam', cursive",
								color: '#0007',
								textAlign: 'center',
							}}
						>
							It looks like there are no comments yet... Would you like to be
							the first?
						</div>
					) : (
						<div></div>
					)}
				</div>
			</div>
			<div style={{ marginTop: '30px', paddingBottom: '4px' }}>
				<h3>May interest you</h3>
			</div>
			<IdeasLoader data={props.data || []} maxIndex={props.maxIndex || 3} />
		</DefaultPageLayout>
	);
}

export const getStaticProps = async (context) => {
	const res = await api.get('/idea');
	const maxIndex = await api.get('/ideas_total_count');
	const idea = await api.get('/idea/' + context.params.id);

	return {
		props: {
			data: res.data,
			idea: idea.data,
			maxIndex: maxIndex.data.count,
		},
		revalidate: 1,
	};
};

export async function getStaticPaths() {
	// Call an external API endpoint to get posts
	const res = await api.get('/ideas_ids');
	const ids = await res.data;

	// Get the paths we want to pre-render based on posts
	const paths = ids.map((id) => ({
		params: { id: '' + id.id },
	}));

	// We'll pre-render only these paths at build time.
	return { paths, fallback: 'blocking' };
}
