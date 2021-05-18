import {Nav, OverlayTrigger, Popover, FormControl, Image, ButtonGroup, Button, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function NavBarFilters(props) {
    const location = useLocation();

    return (
        <Col md={1} className='d-none d-lg-block align-items-center text-center p-0'>
            <Nav id='filter-navbar' className='d-flex flex-column bg-primary position-fixed text-center' style={{ minHeight: '100%', width: '5rem' }}>
                <ButtonGroup vertical className='pt-5 align-items-center'>
                    {props.filters.map(filter => {
                        return (
                            <Link key={`filter-${filter.label}`} to={`/${filter.label}`} className='w-100'>
                                <Button
                                    id={`filter-${filter.label}`}
                                    className='pt-3 pb-3 btn-primary'
                                    variant='link'
                                    block
                                    onClick={ () => props.setFilter(filter.label) }>
                                    <i id={`filter-${filter.label}-icon`} className={`bi ${(`/${filter.label}` === location.pathname)? `bi-${filter.icon}-fill` : `bi-${filter.icon}`} d-flex justify-content-center text-light`} aria-label={filter.label} style={{ fontSize: '1.5em' }}/>
                                </Button>
                            </Link>);
                    })}

                    <Search setFilter={props.setFilter} filters={props.filters}/>

                </ButtonGroup>

                <div className='pe-auto'>
                    <Image id='profile-image' src='https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg' roundedCircle style={{ marginTop: '5rem', width: '3em', height: '3em' }}></Image>
                </div>
            </Nav>
        </Col>);
}

function Search (props) {
    return (
        <OverlayTrigger placement='right' overlay={
            <Popover id='search-popover'>
                <Popover.Title as='h3'>Search task</Popover.Title>
                <Popover.Content>
                    <FormControl
                        autoFocus
                        className='mx-2 w-auto'
                        placeholder='Type to filter...'
                        onChange={(e) => {
                            if(e.target.value.length <= 15) props.setFilter(e.target.value);
                        }}/>
                </Popover.Content>
            </Popover>
        }>
            <Button id='search' key='search' className='pt-3 pb-3 btn-primary text-light' variant='link' block><i className='bi bi-search d-flex justify-content-center' aria-label='Search' style={{ fontSize: '1.5rem' }}></i></Button>
        </OverlayTrigger>
    );
}

export default NavBarFilters;
