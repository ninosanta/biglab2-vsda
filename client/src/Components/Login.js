import { Modal, Button, Form, Col, Alert, InputGroup } from 'react-bootstrap';
import React, { useState } from 'react';

function Login (props) {
    const [validated, setValidated] = useState(false);
    const [signup, setSignup] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if(event.currentTarget.checkValidity()) {
            if(signup) {
                if(password !== repassword) {
                    setRepassword('');
                    setMessage("Passwords missmatch");
                    setValidated(true);
                    return;
                }
                if(password.length < 6){
                    setPassword('');
                    setRepassword('');
                    setMessage("Password must be more 6 characters long");
                    setValidated(true);
                    return;
                }
            }
            setMessage('');
            props.login({ username, password });
        } else {
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(username)) setMessage("Invalid email format");
            else setMessage("All fields are mandatory");
            setValidated(true);
        }
    }

    const handleChange = (component, text) => {
        setMessage('');
        setValidated(false);
        switch(component){
            case 'username':
                setUsername(text);
                break;
            case 'password':
                setPassword(text);
                break;
            case 'repassword':
                setRepassword(text);
                break;
            default: // clear
                setUsername('');
                setPassword('');
                setRepassword('');
                break;
        }
    }

    return (
        <Modal show={true} centered>
            <Modal.Header><Modal.Title>{(signup) ? 'Signup' : 'Login'}</Modal.Title></Modal.Header>
            <Modal.Body className='bg-light'>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Row>
                        <Form.Group controlId='username' as={Col}>
                            <Form.Label>Username</Form.Label>
                            <InputGroup className='mb-3' hasValidation>
                                <Form.Control id='form-username' type='email' placeholder='E-mail' aria-describedby='email-addon' required value={username} onChange={e => {handleChange('username', e.target.value)}} />
                                <InputGroup.Text id='email-addon'>@</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group controlId='password' as={Col}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control id='loginform-password' type='password' placeholder='Password' required value={password} onChange={e => {handleChange('password', e.target.value)}} />
                        </Form.Group>
                    </Form.Row>
                    {signup ?
                        <Form.Row>
                            <Form.Group controlId='repassword' as={Col}>
                                <Form.Control id='loginform-password' type='password' placeholder='Reenter password' required value={repassword} onChange={e => {handleChange('repassword', e.target.value)}} />
                            </Form.Group>
                        </Form.Row> : 
                        <></>
                    }
                    <Form.Row><Form.Group controlId='link' as={Col}><a className='text-primary' onClick={() => setSignup(!signup)}>{(signup)? 'Login' : 'Sign up'}</a></Form.Group></Form.Row>
                    <Form.Row>{(message !== '') ? <Alert variant='danger'>{message}</Alert> : <></>}</Form.Row>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={handleChange}>Clear</Button>
                        <Button type='submit'>{(signup)? 'Sign up' : 'Login'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default Login;