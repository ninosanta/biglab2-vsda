import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import getTasks from './Api/API'
import NavBarFilters from './Components/NavBarFilters';
import NavBarMobile from './Components/NavBarMobile';
import TasksList from './Components/Task';
import ModalTask from './Components/ModalTask';
import { useEffect } from 'react';
import dayjs from 'react-dayjs'

const baseURL = "/api";

const fakeTasks = [ // id: 0 is "false" so we should start from 1
  { id: 1, completed: 'false', description: 'task1', important: 'true', private: 'false', deadline: '2021-04-29T12:00' },
  { id: 2, completed: 'true', description: 'task2', important: 'false', private: 'false', deadline: '' },
  { id: 3, completed: 'true', description: 'pizza', important: 'false', private: 'true', deadline: '2021-05-12T08:30' },
  { id: 4, completed: 'false', description: 'lasagna', important: 'false', private: 'false', deadline: '1999-01-01T00:00' }
];

const filters = [
  { label: 'All', icon: 'inbox' },
  { label: 'Important', icon: 'bookmark-star' },
  { label: "Today's", icon: 'sunset' },
  { label: "Next week's", icon: 'calendar-week' },
  { label: 'Private', icon: 'eye-slash' },
];

const daytimeFilters = ['All', 'Morning', 'Afternoon', 'Evening', 'Night'];

function App() {
  const [tasks, setTasks] = useState(fakeTasks);
  const [open, setOpen] = useState(false);
  const [modalTask, setModalTask] = useState({ show: false, task: undefined });
  const [search, setSearch] = useState('');
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    if (update) {
      console.log("dentro useEffect");
      getTasks().then((t) => {
        setTasks(t);
        setUpdate(false);
        console.log("finito update");
        console.log(tasks)
      });
    }
  }, [update]);

  const handleModalTask = (show, task) => {
    setModalTask({ show: show, task: task });
  }

  const handleTaskList = {
    addTask: (task) => {
      setTasks(oldTasks => [{ id: oldTasks.length + 1, completed: task.completed, description: task.description, important: task.important, private: task.private, deadline: task.deadline }, ...oldTasks]);
    },

    setEditTask: (task) => {
      handleModalTask(true, task);
    },

    editTask: (task) => {

      setTasks(oldTasks => oldTasks.map((t) => { return t.id === task.id ? task : t }));
    },

    deleteTask: (id) => {
      setTasks(oldTask => oldTask.filter(t => t.id !== id));
    }
  }

  function selectFilter(filter) {
    let icon;
    filters.forEach(f => {
      if (f.label === filter) icon = f.icon;
      document.getElementById(`filter-${f.label}-icon`).classList.replace(`bi-${f.icon}-fill`, `bi-${f.icon}`);
      document.getElementById(`filter-mobile-${f.label}-icon`).classList.replace(`bi-${f.icon}-fill`, `bi-${f.icon}`);
    });
    if (filters.map(f => f.label).includes(filter)) {
      setSearch('');
      document.getElementById(`filter-${filter}-icon`).classList.replace(`bi-${icon}`, `bi-${icon}-fill`);
      document.getElementById(`filter-mobile-${filter}-icon`).classList.replace(`bi-${icon}`, `bi-${icon}-fill`);
    } else {
      setSearch(filter);
    }
  }

  return (
    <Router>
      {update ? <></> :
        <Container fluid={true} className='pe-3 m-0'>
          <Col className='p-0 m-0'>
            <Row className='d-block d-lg-none bg-primary mb-5'><NavBarMobile open={open} setOpen={setOpen} filters={filters} setFilter={selectFilter} setSearch={setSearch} /></Row>
            <Row>
              <NavBarFilters filters={filters} setFilter={selectFilter} setSearch={setSearch} />
              <Col className='p-5 m-0 mr-md-4'>
                <TasksList tasks={tasks} filters={filters} handleTaskList={handleTaskList} search={search} />
              </Col>
            </Row>
          </Col>
          <Button className='btn btn-lg btn-primary position-fixed rounded-circle' style={{ width: '3.5rem', height: '3.5rem', bottom: '2rem', right: '2rem', zIndex: '2' }} onClick={() => handleModalTask(true, undefined)}>
            <i className='bi bi-plus-circle-dotted text-light d-flex justify-content-center' style={{ fontSize: '2rem' }} />
          </Button>
          <Modal show={modalTask.show} task={modalTask.task} handleModalTask={handleModalTask} handleTaskList={handleTaskList} />
        </Container>}
    </Router>
  );
}

function Modal(props) {
  if (props.show)
    return (<ModalTask show={props.show} task={props.task} handleModalTask={props.handleModalTask} handleTaskList={props.handleTaskList}></ModalTask>);
  return (<></>);
}

export default App;