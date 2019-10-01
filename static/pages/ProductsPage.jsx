import React from "react";
import PageHeader from "../components/PageHeader.jsx";
import PageFooter from "../components/PageFooter.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

export default class ProductsPage extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        products: [],
        status: 'idle'//'idle', 'pending', 'ready', 'error'
      }
    }

    loadData() {
      this.setState({status: 'pending'});
      fetch("/api/product", {
        method: "get",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          this.setState({
            products: json,
            status: 'ready'
          });
        })
        .catch(err => {
          this.setState({status: 'error'});
        });
    }

    componentDidMount() {
        this.loadData();
    }

    renderProducts() {
      if (this.state.status === 'error') {
        return <div className="alert alert-danger" role="alert">
          Ошибка загрузки списка товаров.
        </div>;
      }
      if (!this.state.products) {
        return false;
      }
      return <React.Fragment>
        <div className="alert alert-primary" role="alert">
          Список товаров.
        </div>
        <div className="card-deck bg-light row mx-auto">
          {
            this.state.products.map(function(product) {
              return <ProductCard product={product} route="product" key={product._id} />
            })
          }
        </div>
      </React.Fragment>
    }

    render() {
      return <React.Fragment>
        <PageHeader 
          headerClass='bg-primary'
        />
        
        <main className="row">
          <div className="col-md-8 offset-md-2 col-sm-10 offset-sm-1 bg-light paper">
            <Breadcrumbs />
            
            { this.renderProducts() }
          
          </div>  
        </main>
        
        <PageFooter />
      </React.Fragment>
    }

  }