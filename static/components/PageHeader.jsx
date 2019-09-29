import React from "react";
import Nav from "./Nav.jsx";

export default class PageHeader extends React.Component {

    render() {
        return <header className={`row ${this.props.headerClass}`}>
            <nav className="col-md-10 offset-md-1 col-sm-12">
            <Nav 
                tabs={["Каталог", "Доставка", "Гарантии", "Контакты"]}
                navClass="nav"
            />
            </nav>
        </header>
    }
}