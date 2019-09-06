import React from "react";
import Nav from "../components/Nav.jsx";

export default class ProductPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      status: 'idle'//'idle', 'pending', 'ready', 'error'
    }
  }

  loadData() {
    this.setState({status: 'pending'});
    fetch(`/api/product?${this.props.match.params}`)
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

  render() {
    if (this.state.status === 'pending') {
      return <div className="alert alert-secondary" role="alert">
        Загрузка...
      </div>;
    }
    if (this.state.status === 'error') {
      return <div className="alert alert-danger" role="alert">
        Ошибка загрузки товара.
      </div>;
    }
    if (!this.state.products) {
      return <div className="alert alert-warning" role="alert">
        Товар не найден.{this.props.match.params}
      </div>;
    }

    return <React.Fragment>
      <div className="product bg-light">
        <h2>{this.state.products[0].title}</h2>
        <Nav 
          tabs={["Описание", "Характеристики", "Отзывы"]}
          navClass={"nav nav-tabs"}
        />
          
        <div className="row">
          <div className="product-image col-3">
            <img src={this.state.products[0].img} alt="Product image"/>
          </div>
          <div className="product-description col-9">
            <p>{this.state.products[0].description}</p>
            <div className="button-section">
              <button className="btn btn-primary">Заказать</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}