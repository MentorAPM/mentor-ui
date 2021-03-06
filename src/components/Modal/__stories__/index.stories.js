import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean, } from '@storybook/addon-knobs';

import useState from 'storybook-useState';
import { Modal } from '../index';

import Button from '../../Button';



storiesOf('Modal', module)
	.addDecorator(withKnobs)
	.add('general', () => {

		const [modalVisibility, setModalVisibility] = useState(false);
		return (
			<React.Fragment>
				<Button onClick={() => setModalVisibility(true)}>
					Open The Modal By Clicking Here
				</Button>
				<Modal
					closeOnOutsideClick={boolean('closeOnOutsideClick', true)}
					display={modalVisibility}
					hideCloseButton={boolean('hideCloseButton', false)}
					onClose={() => setModalVisibility(false)}
					height={number('Override height', null)}
					width={number('Override width', null)}
				>
					Modal Content
				</Modal>
			</React.Fragment>
		);
	})
	.addWithJSX('nested modals', () => {

		const [modal1Visibility, setModal1Visibility] = useState(false);
		const [modal2Visibility, setModal2Visibility] = useState(false);
		return (
			<React.Fragment>
				<Button onClick={() => setModal1Visibility(true)}>
					Open The Modal By Clicking Here
				</Button>
				<Modal
					closeOnOutsideClick={boolean('closeOnOutsideClick', true)}
					display={modal1Visibility}
					onClose={() => setModal1Visibility(false)}
					height={300}
					width={300}
				>
					<p>Modal 1 Content</p>
					<Button onClick={() => setModal2Visibility(true)}>
						Open The Inner Modal By Clicking Here
					</Button>
					<Modal
						display={modal2Visibility}
						// overlayStyle={{ background: 'none' }}
						height={400}
						onClose={() => setModal2Visibility(false)}
						width={400}
					>
						<p>Modal 2 Content</p>
					</Modal>
				</Modal>
			</React.Fragment>
		);
	});
