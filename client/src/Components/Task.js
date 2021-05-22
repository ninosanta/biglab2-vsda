import { useState } from 'react';
import { ListGroup, Badge, Form, Row, Col } from 'react-bootstrap';
import DayJS from 'react-dayjs';
import { Switch, Route, Redirect } from 'react-router-dom';
import getTasks from '../Filters';
import Spinners from './Loading';
import { useLocation } from 'react-router-dom';

function TasksList (props) {
    const location = useLocation();
    
    return (
        <>
            {props.search !== '' ? <Redirect to='/search'/> : <></>}
            {(location.pathname === '/search' && props.search === '') ? <Redirect to='/'/> : <></>}
            <Switch>
                <Route exact path='/'>
                    <Redirect to={`/${props.filters[0].label}`}/>
                </Route>
                <Route path='/search'>
                    <Row className='d-flex flex-row'><h1 id='filter-title' className='mt-4'>{props.search}</h1></Row>
                    <ListGroup variant='flush'>
                        {getTasks(props.tasks, props.search).map( (task) => <Task key={`task-${task.id}`} task={task} handleTaskList={props.handleTaskList}/>)}
                    </ListGroup>
                </Route>
                {props.filters.map(filter => {
                    return (
                        <Route key={`route-${filter.label}`} path={`/${filter.label}`}>
                            <Row className='d-flex flex-row'><h1 id='filter-title' className='mt-4'>{filter.label}</h1></Row>
                            {(props.update)?
                                <Spinners/> : 
                                <ListGroup variant='flush'>
                                    {getTasks(props.tasks, filter.label).map( (task) => <Task key={`task-${task.id}`} task={task} handleTaskList={props.handleTaskList}/>)}
                                </ListGroup>}
                        </Route>
                )})}
            </Switch>
        </>
    );
}

function Task(props) {
    const [taskCompleted, setCompleted] = useState(props.task.completed === 'true' || props.task.completed === true);

    return (
        <Row >
            <ListGroup.Item id={`task-${props.task.id}`} className='list-group-item d-flex w-100' action>
                <Col>
                    <Row>
                        <Col xs={4}> <TaskDescription id={props.task.id} completed={taskCompleted} description={props.task.description} setCompleted={ event => setCompleted(event.target.checked) } important={props.task.important === 'true' || props.task.important === true}/> </Col>
                        <Col xs={1}> <TaskPrivateIcon id={props.task.id} private={props.task.private === 'true' || props.task.private === true}/> </Col>
                        <Col>
                            <Row>
                                <Col className='d-inline-flex flex-row-reverse'> <TaskDeadline id={props.task.id} deadline={props.task.deadline}/> </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs={1} className='d-inline-flex flex-row-reverse'>
                    <Row>
                        <TaskControls task={props.task} handleTaskList={props.handleTaskList}/>
                    </Row>
                </Col>
            </ListGroup.Item>
        </Row>
    );
}

function TaskDescription (props) {
    return (
        <Form>
            <Form.Check id={`task-${props.id}-checkbox`} custom>
                <Form.Check.Input type='checkbox' defaultChecked={props.completed} value={props.completed} onChange={props.setCompleted}/>
                <Form.Check.Label className={props.important ? 'text-danger' : ''}>{props.description}</Form.Check.Label>
            </Form.Check>
        </Form>
    );
}

function TaskPrivateIcon (props) {
    if(props.private) return (<i id={`task-${props.id}-private`} className='bi bi-eye-slash-fill ml-3' aria-label='Private' variant='secondary' style={{ fontSize: '1em' }}></i>);
    return (<></>);
}

function TaskDeadline (props) {
    if (props.deadline) return (
        <Badge id={`task-${props.id}-date`} variant='dark'>
            <DayJS format='MMMM D, YYYY h:mm A'>{props.deadline}</DayJS>
        </Badge>);
    return (<></>);
}

function TaskControls(props) {
    return (
        <Row>
            <div className='pr-2' onClick={() => props.handleTaskList.setEditTask(props.task)}>
                <i id={`task-${props.task.id}-edit`} className='bi bi-pencil-square text-primary' aria-label='Edit'></i>
            </div>
            <div className='pr-2' onClick={() => props.handleTaskList.deleteTask(props.task.id)}>
                <i id={`task-${props.task.id}-delete`} className='bi bi-trash text-danger' aria-label='Delete'></i>
            </div>
        </Row>
    );
}

export default TasksList;