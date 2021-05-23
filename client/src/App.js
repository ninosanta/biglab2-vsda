import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import API from './Api/API';
import NavBarFilters from './Components/NavBarFilters';
import NavBarMobile from './Components/NavBarMobile';
import TasksList from './Components/Task';
import ModalTask from './Components/ModalTask';
import { useEffect } from 'react';

const filters = [
  { label: 'All', icon: 'inbox' },
  { label: 'Important', icon: 'bookmark-star' },
  { label: "Today's", icon: 'sunset' },
  { label: "Next week's", icon: 'calendar-week' },
  { label: 'Private', icon: 'eye-slash' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalTask, setModalTask] = useState({ show: false, task: undefined });
  const [search, setSearch] = useState('');
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    if (update) {
      //setTimeout(() => {
        API.getTasks().then((t) => {
          setTasks(t);
          setUpdate(false);
        });
      //}, 1000);
    }
  }, [update]);

  const handleModalTask = (show, task) => {
    setModalTask({ show: show, task: task });
  };

  const handleTaskList = {
    addTask: (task) => {
      setTasks(oldTasks => [{ id: oldTasks.length + 1, completed: task.completed, description: task.description, important: task.important, private: task.private, deadline: task.deadline }, ...oldTasks]);
      API.addTask(task).then(()=>setUpdate(true));
    },

    setEditTask: (task) => {
      handleModalTask(true, task);
    },

    editTask: (task) => {
      setTasks(oldTasks => oldTasks.map((t) => { return t.id === task.id ? task : t }));
      API.updateTask(task).then(()=>setUpdate(true));
    },

    deleteTask: (id) => {
      setTasks(oldTask => oldTask.filter(t => t.id !== id));
      API.deleteTask(id).then(()=>setUpdate(true));
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
        <Container fluid={true} className='pe-3 m-0'>
          <Col className='p-0 m-0'>
            <Row className='d-block d-lg-none bg-primary mb-5'><NavBarMobile open={open} setOpen={setOpen} filters={filters} setFilter={selectFilter} setSearch={setSearch} /></Row>
            <Row>
              <NavBarFilters filters={filters} setFilter={selectFilter}/>
              <Col className='p-5 m-0 mr-md-4'>
                <TasksList update={update} tasks={tasks} filters={filters} handleTaskList={handleTaskList} search={search} />
              </Col>
            </Row>
          </Col>
          <Button className='btn btn-lg btn-primary position-fixed rounded-circle' style={{ width: '3.5rem', height: '3.5rem', bottom: '2rem', right: '2rem', zIndex: '2' }} onClick={() => handleModalTask(true, undefined)}>
            <i className='bi bi-plus-circle-dotted text-light d-flex justify-content-center' style={{ fontSize: '2rem' }} />
          </Button>
          {(modalTask.show) ? <ModalTask show={modalTask.show} task={modalTask.task} handleModalTask={handleModalTask} handleTaskList={handleTaskList} /> : <></>}
        </Container>
    </Router>
  );
}

export default App;