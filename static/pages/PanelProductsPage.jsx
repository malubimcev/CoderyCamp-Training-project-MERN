import React from "react";
import Nav from "../components/Nav.jsx";
import ProductCard from "./ProductCard.jsx";

export default class PanelProductsPage extends React.Component {

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
          this.state.products.map(function(product) {
            return <ProductCard product={product} route="panel/product"/>
          })
        }
      </div>
    </React.Fragment>
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
    return <React.Fragment>
      <header className="row bg-warning">

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

          { this.state.product && this.renderForm() }
          { this.renderProducts() }
        
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