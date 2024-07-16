
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import moment from 'moment';
import Card from 'react-bootstrap/Card';

function Activity({activity}) {
    let callNumber = ""
    let icon = ""
    if (activity.direction == "inbound"){
        callNumber = activity.from
    } else {
        callNumber = activity.to
    }

    if (activity.call_type == "missed"){
        icon = "phone_missed"
    } else if (activity.call_type == "voicemail"){
        icon = "voicemail"
    } else if (activity.call_type == "answered"){
        icon = "phone_in_talk"
    }

    const formattedTime = moment(activity.created_at).format('h:mm a')
    
    return (
        <Card style={{margin: '15px 0'}}>   
            <Container fluid="md">
                <Row className="align-items-center" style={{height: '50px'}}>
                    <Col md={2}>
                        <span className="material-symbols-outlined">
                            {icon}
                        </span>
                    </Col>
                    <Col md={6}><h3>{callNumber}</h3></Col>
                    <Col md={4}>
                        <div className="verticalLine">
                            <h3>{formattedTime}</h3>
                        </div>
                        
                    </Col>
                </Row>
            </Container>
        </Card>
    )
}

export default Activity