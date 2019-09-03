import React from 'react';
import {withRouter} from 'react-router-dom';
import Loading from '../common/Loading';
import { API_URL } from '../config' ;
import { handleResponse } from '../helpers';
import './Search.css';

export default class Search extends React.Component{
    constructor(){
        super();

        this.state = {
            searchResults: [],
            searchQuery: '',
            loading: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    handleChange(event){
        const searchQuery = event.target.value;

        this.setState({searchQuery});

        if(!searchQuery){
            return '';
        }

        this.setState({loading: true})

        fetch(`${API_URL}/autocomplete?searchQuery=${searchQuery}`)
        .then(handleResponse)
        .then((result) => {
            this.setState({
            loading: false,
            searchResults: result,
            });
        });
    }

    handleRedirect(currencyId){
        //Clear input value and close autocomplete container
        //By clearing searchQuery state
        this.setState({
            searchQuery: '',
            searchResults: [],
        })

        this.props.history.push(`/currency/${currencyId}`);
    }

    rendersearchResults(){
        const { searchResults, searchQuery, loading } = this.state;

        if (!searchQuery){
            return '';
        }

        if (searchResults.length > 0){
            return(
                <div className="Search-result-container">
                    {searchResults.map(result =>(
                        <div 
                            key={result.id}
                            className="Search-result"
                            onClick={()=> this.handleRedirect(result.id)}
                        >
                            {result.name} ({result.symbol})
                        </div>
                    ))}
                </div>
            )
        }

        if (!loading){
            return(
                <div className="Search-result-container">
                    <div className="Search-no-result">
                        No Result Found
                    </div>
                </div>
            ) 
        }  
    }

    render(){
        const {searchQuery, loading} = this.state;
        return(
            <div className="Search">
                <span className="Search-icon"/>

                <input 
                    className="Search-input" 
                    type="text" 
                    placeholder="Currency Name" 
                    onChange={this.handleChange}
                    value={searchQuery}
                />

                {
                    loading && 
                    <div className="Search-loading">
                        <Loading width='12px' height='12px'/>
                    </div>
                }

                {this.rendersearchResults()}
                
            </div>
        )
    }
}