import React from "react";
import Nav from "../components/Nav.jsx";
import PanelProductForm from "./PanelProductForm.jsx";

export default class PanelProductPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: {
        key: 0,
        slug: '',
        title: '',
        description: '',
        img: '',
        price: 0
      },
      status: 'idle'// 'idle' | 'pending' | 'ready' | 'error'
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  loadData() {
    this.setState({status: 'pending'});
    
    fetch(`/api/product/${this.props.match.params.id}`, {
      method: "get",
      credentials: "same-origin",
      // body: JSON.stringify(this.state.credentials),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          product: {
            key: json.key,
            slug: json.slug,
            title: json.title,
            description: json.description,
            img: json.img,
            price: json.price
          },
          status: 'ready'
        });
      })
      .catch(err => {
        this.setState({status: 'error'});
        console.log(err.message);
      });
  }
  
  componentDidMount() {
    this.loadData();
  }

  handleInputChange(event) {
    const name = event.target.name;
    this.state.product[name] = event.target.value;
    this.forceUpdate();
  }

  onSave(event) {
    event.preventDefault();
    fetch(`/api/product/${this.props.match.params.id}`, {
      method: "put",
      credentials: "same-origin",
      body: JSON.stringify(this.state.product),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => this.forceUpdate());
  }

  renderFormComponent() {
    return <PanelProductForm 
      product={this.state.product}
      changeHandler={this.handleInputChange}
      submitHandler={this.onSave}
    />
  }

  render() {
    if (this.state.product.status === 'pending') {
      return <div className="alert alert-secondary" role="alert">
        Загрузка...
      </div>;
    }
    if (this.state.product.status === 'error') {
      return <div className="alert alert-danger" role="alert">
        Ошибка загрузки товара.
      </div>;
    }
    if (!this.state.product.title) {
      return <div className="alert alert-warning" role="alert">
        Товар не найден.
      </div>;
    }

    return <React.Fragment>
      <div className="product bg-light">
        <h2>{this.state.product.title}</h2>

        { this.state.product && this.renderFormComponent() }

        <Nav 
          tabs={["Описание", "Характеристики", "Отзывы"]}
          navClass={"nav nav-tabs bg-warning"}
        />

        <div className="row bg-ligt">
          <div className="product-image col-3">
            <img src={`/${this.state.product.img}`} alt="Product image"/>
          </div>
          <div className="product-description col-9">
            <p>{this.state.product.description}</p>
            <div className="button-section">
              <button className="btn btn-primary">Заказать</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }
}