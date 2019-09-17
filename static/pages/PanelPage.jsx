import React from "react";
import Nav from "../components/Nav.jsx";
// import ProductPage from "./ProductPage.jsx";
import { Link } from "react-router-dom";

export default class PanelProductsPage extends React.Component {

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
            
            <Link to={`/panel/product`}>
              <div className="alert alert-info" role="alert">
                  Каталог товаров.
              </div>
            </Link>
          
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