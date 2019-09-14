import React from "react";
import Nav from "../components/Nav.jsx";
const queryString = require('query-string');

export default class ProductPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: 'none',
      description: 'no desc',
      img: 'img1.png',
      status: 'idle'// 'idle' | 'pending' | 'ready' | 'error'
    }
  }

  loadData() {
    this.setState({status: 'pending'});

    const [key, ...slugArray] = this.props.match.params.product.split('-');
    const slug = slugArray ? slugArray.join('-') : '';
    const params = queryString.stringify({key, slug});
    
    fetch(`/api/product?${params}`)
      .then(function(response) {
        return response.json();
      }.bind(this))
      .then(function(json) {
        this.setState({
          title: json.title,
          description: json.description,
          img: json.img,
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
    if (!this.state.title) {
      return <div className="alert alert-warning" role="alert">
        Товар не найден.
      </div>;
    }

    return <React.Fragment>
      <div className="product bg-light">
        <h2>{this.state.title}</h2>
        <Nav 
          tabs={["Описание", "Характеристики", "Отзывы"]}
          navClass={"nav nav-tabs"}
        />
          
        <div className="row">
          <div className="product-image col-3">
            <img src={`/${this.state.img}`} alt="Product image"/>
          </div>
          <div className="product-description col-9">
            <p>{this.state.description}</p>
            <div className="button-section">
              <button className="btn btn-primary">Заказать</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}