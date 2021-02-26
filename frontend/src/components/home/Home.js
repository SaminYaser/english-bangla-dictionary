import React, { useState } from 'react';
import './Home.css'
import { Form, FormControl, Button, Container } from 'react-bootstrap';
import { CgSearch } from 'react-icons/cg';
import Axios from 'axios';
import { serverUrl } from '../../util';

function serverQuery(searchText, setResultText){
    Axios
    .get(`${serverUrl}/dictionary?word=${searchText}`)
    .then(({data: res}) => {
        setResultText(res);
    })
    .catch((error) => {
        console.error(error);
        console.log('failed to load result');
    });
}

function Home() {
    const [searchText, setSearchText] = useState();
    const [resultText, setResultText] = useState();

    function parseSearchText(e){
        setSearchText(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        serverQuery(searchText, setResultText);
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
                {resultText &&
                    <div>Bangla Meaning:</div>
                }
                <div>
                    {resultText}
                </div>
            </div>
        </Container>
    );
  }
  
export default Home;