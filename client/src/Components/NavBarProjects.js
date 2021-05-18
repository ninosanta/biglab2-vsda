import { Col, Button, Card } from 'react-bootstrap';
import img from './foto.png';
import img2 from './foto2.jpeg';


function NavBarProjects(props) {
    return (
        <Col id='projects-navbar' className='overflow-auto p-3' style={{ minHeight: '100vh'}}>
            <div className='d-flex justify-content-center pb-3'>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant='top' src={img} />
                    <Card.Body>
                        <Card.Title>Web Application I</Card.Title>
                        <Card.Text>
                            The course aims at presenting the main techniques for creating distributed web applications.
                        </Card.Text>
                        <Button variant='primary'>Visualize</Button>
                    </Card.Body>
                </Card>
            </div>
            <div className='d-flex justify-content-center pb-3'>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant='top' src={img2} />
                    <Card.Body>
                        <Card.Title>Programmazione Di Sistema</Card.Title>
                        <Card.Text>
                            Il corso si articola in due parti: la prima affronta gli
                            aspetti interni ...
                        </Card.Text>
                        <Button variant='primary'>Visualize</Button>
                    </Card.Body>
                </Card>
            </div>
        </Col>);
}

export default NavBarProjects;