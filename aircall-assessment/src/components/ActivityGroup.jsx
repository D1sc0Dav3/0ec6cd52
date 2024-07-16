import Activity from './Activity.jsx'
import moment from 'moment';
import { useState, useEffect } from 'react'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function ActivityGroup({activityGroup, isArchived}) {
    
    const formattedDate = moment(activityGroup.date).format('MMMM DD YYYY');

    const [show, setShow] = useState(false);
    const [activityById, setActivity] = useState({})
    let buttonText = "Archive";
        let buttonVariant = "danger"
        if (activityById.is_archived){
            buttonText = "Unarchive"
            buttonVariant = "success"
        }

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        fetch('https://aircall-backend.onrender.com/activities/' + id).then((response) => {
            console.log(response)
            return response.json()
        }).then((data) => {
            const activityData = data
            setActivity(activityData)
            console.log(data)
            setShow(true);
        })
        
    }

    const updateActivity = () => {
        fetch('https://aircall-backend.onrender.com/activities/' + activityById.id, 
            {
                method: "PATCH",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }, 
                body: JSON.stringify({is_archived: !activityById.is_archived})}).then((response) => {
                    setShow(false);
                    location.reload()
                })
    }
    
    return (
        <div className="activityGroup">
            <p className="dateText">{formattedDate}</p>
            {activityGroup.activity.filter((activity) => {
                    return activity.is_archived == isArchived
                }).map((activity) => (
                    <div key={activity.id} onClick={() => handleShow(activity.id)}>
                    <Activity key={activity.id} activity={activity} ></Activity>
                    </div>
                ))}

            <Modal show={show} onHide={handleClose} centered size="sm">
                <Modal.Header closeButton>
                <Modal.Title>Call Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Call from {activityById.from}<br />
                    Duration: {moment.utc(activityById.duration*1000).format('HH:mm:ss')}<br />
                    Date: {moment(activityById.created_at).format('MMMM DD YYYY')} at {moment(activityById.created_at).format('h:mm a')} <br />
                    Direction: {activityById.direction}<br />
                    To: {activityById.to}<br />
                    Via: {activityById.via}<br />
                </Modal.Body>
                <Modal.Footer>
                <Button variant={buttonVariant} size="sm" onClick={updateActivity}>
                    {buttonText}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default ActivityGroup