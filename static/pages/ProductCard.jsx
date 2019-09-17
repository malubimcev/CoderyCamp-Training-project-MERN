import React from "react";
import { Link } from "react-router-dom";

export default class ProductCard extends React.Component {

    render() {
        const product = this.props.product;
        const route = this.props.route;
        const link = route === 'panel/product' ? `${product._id}` : `${product.key}-${product.slug}`

        return <React.Fragment>
             <div className="card col-md-3 offset-md-3 col-sm-4 offset-sm-1" key={product.key}>
                <Link to={`/${route}/${link}`}>
                    <img className="card-img" src={`/${product.img}`} alt="Card image cap" />
                </Link>
                <div className="card-body-right">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">Цена: <span className="card-price">{product.price} руб.</span></p>
                    <Link to={`/${route}/${link}`}>Купить</Link>
                </div>
            </div>
        </React.Fragment>
    }
}