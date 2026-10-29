import { useState, useEffect } from 'react'
import { HelpMessage } from './help/HelpMessageContainer'
import { Definitions } from './def/DefinitionsContainer'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { QRCode } from 'react-qrcode-logo'
import { compressToEncodedURIComponent } from 'lz-string'

/* realmathAR viewer; payload goes in ?z= (see AGENTS.md) */
const BASE_URL = 'https://nd-dac-dome.github.io/realmathAR/?z='

/* helper */
const ModalType = (label) => {
	let type = label
	switch (label) {
		case null:
			type = 0
			break
		case 'DEF':
			type = 1
			break
		case 'HELP':
			type = 2
			break
	}
	console.log(type)
	return type
}

export const RamenModal = ({parentState, handleClose, GraphKeys}) =>
{
	/* LISTEN FOR NEW MODAL */
	const [type, setType] = useState(1)
	useEffect(() => {
		if (parentState.vis === true) {
			console.log(`parent called modal visible with label ${parentState.label}`)
			setType(ModalType(parentState.label))
		}
	}, [parentState.modalCalls])
	
	/* GETTER FUNCTIONS */
	const getShow = () => {
		return parentState.vis
	}

	const getLabel = () => {
		switch (type) {
			case 0:
				return 'AR Visualization'
				break
			case 1:
				return `${GraphKeys[parentState.component]} DEFINITION`
				break
			case 2:
				return 'HELP/FAQ'
				break
			default:
				return `${type}`
		}
	}

	/* TYPE SWITCH DETERMINES MODAL DISPLAY
	*	*	0 = QR Modal
	*	*	1 = Definition Modal
	*	*	2 = Help Modal
	*	*	any other type displays as indicated in label/content input
	*/
	const getContent = () => {
		switch (type) {
			case 0:
				console.log(compressToEncodedURIComponent(parentState.content))
				const url = `${BASE_URL}${compressToEncodedURIComponent(parentState.content)}`
				return(
					<Modal.Body>
						<p>
							Your graph has been sent to the AR visualizer! Scan the QR code with your mobile device to view it.
						</p>
						<div className="rm-qr-layout">
							<div>
								<p className="mb-2">
									Already on mobile? Tap{" "}
									<a id="qrLink" href={url}>here</a>{" "}
									to open the visualizer.
								</p>
								<p className="mb-0 text-secondary" style={{fontSize: "0.9rem"}}>
									Requires a phone with a camera and gyroscope.
								</p>
							</div>
							<div>
								<QRCode value={url} quietZone={8} size={160}/>
							</div>
						</div>
					</Modal.Body>
				)
				break
			case 1:
				return(
					<Modal.Body>
						<Definitions component={parentState.component}/>
					</Modal.Body>
				)
				break
			case 2:
				return(
					<Modal.Body>
						<HelpMessage/>
					</Modal.Body>
				)
				break
			default:
				return (
					<Modal.Body>
						{parentState.content}
					</Modal.Body>
				)
		}
	}

	return (
		<Modal show={getShow()} onHide={handleClose} size='lg' centered>
			<Modal.Header closeButton>
				<Modal.Title>{getLabel()}</Modal.Title>
			</Modal.Header>
			{getContent()}
		</Modal>
	)
}