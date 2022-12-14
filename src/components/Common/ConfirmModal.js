import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import HTMLReactParser from 'html-react-parser';

import './ConfirmModal.scss';

import { MODAL_ACTION_CONFIRM, MODAL_ACTION_CLOSE } from 'utilities/constants';

function ConfirmModal({ title, content, show, onAction }) {
    return (
        <Modal show={show} onHide={() => onAction('close')} backdrop="static" keyboard={false} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title className="h5">{HTMLReactParser(title)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{HTMLReactParser(content)}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onAction(MODAL_ACTION_CLOSE)}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => onAction(MODAL_ACTION_CONFIRM)}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
export default ConfirmModal;
