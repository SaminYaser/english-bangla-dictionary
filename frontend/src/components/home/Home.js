import React, { useState } from 'react';
import './Home.css'
import { Form, FormControl, Button, Container } from 'react-bootstrap';
import { CgSearch } from 'react-icons/cg';

function Home() {
    const [searchText, setSearchText] = useState();

    function parseSearchText(e){
        setSearchText(categoryParse(e.target.value));
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <Container fluid="md" className="parentContainer">
            <div className="headerText">
                English to Bangla Dictionary
            </div>
            <div className="searchBarDiv">
                <Form className="searchBar" onSubmit={handleSubmit}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <FormControl type="text" placeholder="Search Words" className="mr-sm-2" 
                            onChange={parseSearchText}/>
                        <Button variant="custom" type="submit" size='sm'>
                        <CgSearch size='2em'/>
                        </Button>
                    </div>
                </Form>
            </div>
            <div className="resultDiv">
                
            </div>
        </Container>
    );
  }
  
export default Home;