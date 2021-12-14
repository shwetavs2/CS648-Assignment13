import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filterText: '',
            products: PRODUCTS
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.handleSave = this.handleSave.bind(this)
	this.getProducts=this.getProducts.bind(this)
    }
	


	componentDidMount(){
        this.getProducts();
    }

    getProducts() {
        fetch('http://localhost:3000/product/get/', {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               }
        }).then(results => results.json())
            .then(data => {
                console.log(data);
                this.setState({ products: data });
            })
    }

    handleFilter(filterInput) {
        this.setState(filterInput)
    }

    handleSave(product) {
        if (!product.id) {
            product.id = new Date().getTime()
        }
        fetch('http://localhost:3000/product/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product
            })
        }).then(() => {this.getProducts()});
    }

    handleDestroy(productId) {
        fetch(`http://localhost:3000/product/delete/${productId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product: productId
            })
        }).then(() => {this.getProducts()});
    }

    render () {
        return (
            <div>
                <h1>My Inventory</h1>
                <Filters 
                    onFilter={this.handleFilter}></Filters>
                <ProductTable 
                    products={this.state.products}
                    filterText={this.state.filterText}
                    onDestroy={this.handleDestroy}></ProductTable>
                <ProductForm
                    onSave={this.handleSave}></ProductForm>
            </div>
        )
    }
}

export default Products