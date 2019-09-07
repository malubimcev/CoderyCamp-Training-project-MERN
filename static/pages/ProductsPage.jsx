import React from "react";
import Nav from "../components/Nav.jsx";
// import ProductPage from "./ProductPage.jsx";
import { Link } from "react-router-dom";

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
      fetch("/api/product")
        .then(function(response) {
          return response.json();
        }.bind(this))
        .then(function(json) {
          this.setState({
            products: json,
            status: 'ready'
          });
        }.bind(this))
        .catch(function(err){
          this.setState({status: 'error'});
        }.bind(this));
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
            this.state.products.map(function(product, index) {
              return <div className="card col-md-3 offset-md-3 col-sm-4 offset-sm-1" key={index}>
                <Link to={`/product/${product.key}-${product.slug}`}>
                  <img className="card-img" src={product.img} alt="Card image cap" />
                </Link>
                <div className="card-body-right">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">Цена: <span className="card-price">{product.price} руб.</span></p>
                  <Link to={`/product/${product.key}-${product.slug}`}>Купить</Link>
                </div>
              </div>
            })
          }
        </div>
      </React.Fragment>
    }

    render() {
      return <React.Fragment>
        <header className="row bg-primary">

          <nav className="col-md-8 offset-md-2 col-sm-10 offset-sm-1">
            <Nav 
              tabs={["Каталог", "Доставка", "Гарантии", "Контакты"]}
              navClass="nav"
            />
          </nav>
          
        </header>
        
        <main className="row">

          <div className="col-md-8 offset-md-2 col-sm-10 offset-sm-1 bg-light paper">

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item"><a href="#">Library</a></li>
                <li className="breadcrumb-item active" aria-current="page">Data</li>
              </ol>
            </nav>
            
            { 
              this.renderProducts()
            }
          
          </div>  

        </main>
        
        <footer className="row bg-dark">
          <div className="col-md-8 offset-md-2 col-sm-10 offset-sm-1">
            &copy; Codery Camp, 2019
          </div>
        </footer>
      </React.Fragment>
    }

  }