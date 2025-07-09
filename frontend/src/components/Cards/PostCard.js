import { Fragment, useState, useEffect } from 'react';
import { Col, Placeholder, Row, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { DeletedCard } from './DeletedCard';
import ImageGallery from '../ImageGallery';
import DeleteResourceModal from '../Modals/DeleteResourceModal';
import BlockModal from '../Modals/BlockModal';
import SocialInteractions from '../UserInteractions/SocialInteractions';
import { handleTimeDifference } from '../../functions/handlers';
import { useDeleteResource } from '../../hooks/api/use-delete-resource';
import { useMiddleViewPort } from '../../hooks/misc/use-middle-viewport';

import '../../assets/styling/PostCard.css';

function PostCard({ post, isAuthenticated }) {
	const [showBlock, setShowBlock] = useState(false);
	const [blocked, setBlocked] = useState(false);
	const [aboveMid, setAboveMid] = useMiddleViewPort();
	const [showDelete, setShowDelete] = useState(false);
	const { data: isDeleted, mutate: setIsDeleted } = useDeleteResource('posts');
	const navigate = useNavigate();

	useEffect(() => {
		if(blocked) {
			window.location.reload();
		}
	}, [blocked])

	function handleMoreClick() {
		return (
			<Fragment>
				{ post.is_current_user ?
					<Dropdown.Item onClick={() => { setShowDelete(true) }}>
						Delete Post
					</Dropdown.Item>
				:
					<Dropdown.Item onClick={() => setShowBlock(true) }>
						Block user
					</Dropdown.Item>
				}
			</Fragment>
		)
	}

	function handleNavigate(e) {
		e.preventDefault();
		navigate(`/${post.article.creator.username}`);
	}

	function handleDelete() {
		setShowDelete(() => {
			setIsDeleted(post.id);
			return false;
		});
	}

	if(isDeleted) {
		return <DeletedCard />;
	} else {
		return (
			<>
				<BlockModal show={ showBlock } setShow={ setShowBlock } setBlocked={ setBlocked } username={ post ? post.article.creator.username : null } />
				<DeleteResourceModal show={ showDelete } setShow={ setShowDelete } handleDelete={ handleDelete } />
				<Card>
					<a href={
						post.article.creator.username ?
						post ? `/${post.article.creator.username}/${post.id}` : `/deleted/${post.id}`
					:
						'/'
					}
						className='obj-link'
					>
						<Card.Body>
							<Card.Title>
								<Row className='center-row-items'>
									<Col>
										<div className='creator-container'>
											{ post && post.article.creator.username ?
												<button className='link-as-button' onClick={ e => handleNavigate(e) }>
													@{ post.article.creator.username }
												</button>
											:
												'[Deleted]'
											}
										</div>
									</Col>
									<Col className='time-col' id='time-col'>
										<Row className='center-row-items'>
											<Col>
												{ post ? handleTimeDifference(post.article.date_created) : <Placeholder xs={4} /> }
											</Col>
											<Col className='more-col'>
												<DropdownButton
													className='base-btn rounded-btn'
													drop={ aboveMid ? 'up-centered' : 'down-centered' }
													onClick={ e => setAboveMid(e) }
													disabled={ !isAuthenticated }
													variant='secondary'
													title={ <BsThreeDots /> }>
														{ handleMoreClick() }
												</DropdownButton>
											</Col>
										</Row>
									</Col>
								</Row>
							</Card.Title>
							<div className='image-gallery' id='image-gallery'>
								{ post ? <ImageGallery gallery={ post.image } /> : <ImageGallery gallery={null} uploaded={false} /> }
							</div>
							{ post ?
								<Card.Text>
									{ post.content }
								</Card.Text> :
								<Placeholder as={Card.Text} animation='wave'>
									<Placeholder xs={ 7 } /> <Placeholder xs={ 4 } /> <Placeholder xs={ 4 } />{ ' ' }
									<Placeholder xs={ 6 } /> <Placeholder xs={ 8 } />
								</Placeholder>
							}
						</Card.Body>
					</a>
					<Card.Footer className='no-select'>
						<SocialInteractions resource={ 'posts' } obj={ post } />
					</Card.Footer>
				</Card>
			</>
		);
	}
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(PostCard);