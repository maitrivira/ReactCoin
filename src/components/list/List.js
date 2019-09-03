import React from 'react';
import Loading from '../common/Loading';
import Table from './Table';
import { API_URL } from "../config";
import Pagination from "./Pagination";

class List extends React.Component{
    constructor(){
        super()

        this.state = {
            loading: false,
            currencies: [],
            error: null,
            totalPages: 0,
            page: 1,
        };
    }

    componentWillMount(){
        this.fetchCurrencies();
    }

    fetchCurrencies(){
        this.setState({loading: true});

        const { page } = this.state;

        fetch(`${API_URL}/cryptocurrencies?page=${page}&perPage=20`)
        .then(response =>{
            return response.json().then(json =>{
                return response.ok ? json : Promise.reject(json);
            });
        })
        .then((data) => {
            const {currencies, totalPages} = data;
            this.setState({
                currencies, 
                loading: false, 
                totalPages
            })
            console.log('Success', data);
        })
        .catch((error) =>{
            this.setState({error: error.errorMessage, loading: false})
            console.log('Error', error);
        })
    }

    handlePaginationClick = (direction) => {
        let nextPage = this.state.page;

        // if (direction === 'next'){
        //     nextPage++;
        // }

        // Increment nextPage if direction variable is next, otherwise decrement
        nextPage = direction === 'next' ? nextPage + 1 : nextPage - 1;

        this.setState({ page: nextPage }, () => {
            // call fetchCurrencies function inside setState's callback
            // because we have to make sure first page state is updated
            this.fetchCurrencies();
        });
    }

    render(){
        const { loading, error, currencies, page, totalPages } = this.state;
        console.log(this.state);

        // render only loading component, if loading state is set to true
        if(loading){
            return <div className="loading-cotainer"><Loading/></div>
        }

        // render only error message, if error occurred while fetching data
        if(error){
            return <div className="error">{error}</div>
        }

        return(
            <div>

                <Table currencies={currencies}/>
                <Pagination page={page} totalPages={totalPages} handlePaginationClick={this.handlePaginationClick}/>

            </div>
            
        )
    }
}

export default List;