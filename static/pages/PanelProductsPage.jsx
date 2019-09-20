import React from "react";
import Nav from "../components/Nav.jsx";
import ProductCard from "./ProductCard.jsx";
import PanelProductForm from "./PanelProductForm.jsx";

export default class PanelProductsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      products: [],
      newProduct: {
        key: 0,
        slug: '',
        title: '',
        description: '',
        img: '',
        price: 0 
      },
      status: 'idle'//'idle', 'pending', 'ready', 'error'
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    this.setState({status: 'pending'});
    fetch("/api/product")
      .then(function(response) {
        return response.json();
      })
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

  handleInputChange(event) {
    const name = event.target.name;
    this.state.newProduct[name] = event.target.value;
    this.forceUpdate();
  }

  onSave(event) {
    event.preventDefault();
    console.log(JSON.stringify(this.state.newProduct));
    fetch(`/api/product`, {
      method: "post",
      body: JSON.stringify(this.state.newProduct),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        return response.json();
      }.bind(this))
      .then(json => {
        this.setState({
          newProduct: {
            key: json.key,
            slug: json.slug,
            title: json.title,
            description: json.description,
            img: json.img,
            price: json.price
          }
        }.bind(this));
        this.state.products.push(newProduct);
        this.forceUpdate();
      });
  }

  renderFormComponent() {
    return <PanelProductForm 
      product={this.state.newProduct}
      changeHandler={this.handleInputChange}
      submitHandler={this.onSave}
    />
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
            return <ProductCard product={product} route="panel/product" key={product._id}/>
          })
        }
      </div>
    </React.Fragment>
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

          {/* { this.renderForm() } */}
          { this.renderFormComponent() }
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