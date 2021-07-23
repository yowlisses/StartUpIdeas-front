import { api } from '../../services/api';

import style from '/styles/IdeaPage.module.css';

import TopButtonWrapper from '../../components/TopButtonWrapper';
import { Comment } from '../../components/Comment';
import { CommentEntry } from '../../components/CommentEntry';
import DefaultPageLayout from '../../components/DefaultPageLayout';

export async function getStaticProps(context) {
	const idea = await api.get('/idea/' + context.params.id);
	const comments = await api.get(`/idea/${context.params.id}/comments`);

	return {
		props: { idea: idea.data, comments: comments.data },
	};
}

export default function IdeaPage(props) {
	const { idea, comments } = props;
	return (
		<DefaultPageLayout>
			<TopButtonWrapper />
			<div>
				<div className='paper-like' id={style.idea}>
					<div>
						{/* <Image
								src='/images/idea.svg'
								alt='light bulb'
								width={30}
								height={30}
								style={{ display: 'inline' }}
							/> */}
						<h1>{(idea && idea.title) || 'loading...'}</h1>
						<p>{(idea && idea.description) || 'loading...'}</p>
					</div>
					{/* <VoteBox id={id} /> */}
				</div>
				<div className='paper-like'>
					<CommentEntry id={props.idea.id} addCallback={() => {}} />
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
						<div />
					)}
				</div>
			</div>
			<div style={{ marginTop: '30px', paddingBottom: '4px' }}>
				<h3>May interest you</h3>
			</div>
			{/* <IdeasLoader /> */}
		</DefaultPageLayout>
	);
}

export async function getStaticPaths() {
	return {
		//which routes will be pre rendered
		paths: [{ params: { id: '1' } }],
		fallback: true,
	};
}
