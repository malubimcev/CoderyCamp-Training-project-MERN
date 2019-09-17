import React from "react";
import Nav from "../components/Nav.jsx";

// const queryString = require('query-string');

export default class PanelProductPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: {
        title: 'no title',
        description: 'no description',
        img: ''
      },
      status: 'idle'// 'idle' | 'pending' | 'ready' | 'error'
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  loadData() {
    this.setState({status: 'pending'});
    
    fetch(`/api/product/${this.props.match.params.id}`)
      .then(function(response) {
        return response.json();
      }.bind(this))
      .then(function(json) {
        this.setState({
          product: {
            key: json.key,
            slug: json.slug,
            title: json.title,
            description: json.description,
            img: json.img
          },
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

  handleInputChange(event) {
    const name = event.target.name;
    this.state.product[name] = event.target.value;
    this.forceUpdate();
  }

  onSave(event) {
    event.preventDefault();
    fetch(`/api/product/${this.props.match.params.id}`, {
      method: "put",
      body: JSON.stringify(this.state.product),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => console.log(res));
  }

  renderForm() {
    return <form>
        <div class="form-group">
          <div class="form-group row">
            <label class="col-md-1 offset-md-2 col-sm-1 offset-sm-1 col-form-label">Наименование товара</label>
            <input
              name="title"
              type="text"
              class="col-md-8 col-sm-7 form-control form-control-lg"
              placeholder="Наименование товара"
              value={this.state.product.title}
              onChange={this.handleInputChange}
            />
          </div>
          <div class="form-group row">        
            <label class="col-md-1 offset-md-2 col-sm-1 offset-sm-1 col-form-label">Описание товара</label>
            <textarea
              name="description"
              // type="text"
              class="col-md-8 col-sm-7 form-control form-control-lg"
              rows="4"
              placeholder="Описание товара"
              value={this.state.product.description}
              onChange={this.handleInputChange}
            ></textarea>
          </div>
          <div class="form-group row"> 
            <label class="col-md-1 offset-md-2 col-sm-1 offset-sm-1 col-form-label">Ключ</label>
            <input
              name="key"
              type="text"
              class="col-md-8 col-sm-7 form-control form-control-lg"
              placeholder="Ключ"
              value={this.state.product.key}
              onChange={this.handleInputChange}
            />
          </div>
          <div class="form-group row">           
            <label class="col-md-1 offset-md-2 col-sm-1 offset-sm-1 col-form-label">Слаг</label>
            <input
              name="slug"
              type="text"
              class="col-md-8 col-sm-7 form-control form-control-lg"
              placeholder="Слаг"
              value={this.state.product.slug}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="row">
            <button type="submit" class="btn btn-primary col-md-1 offset-md-3" onClick={this.onSave}>Сохранить</button>
          </div>
        </div>
      </form>
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

        { this.state.product && this.renderForm() }

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