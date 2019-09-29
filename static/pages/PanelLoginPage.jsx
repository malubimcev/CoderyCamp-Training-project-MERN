import React from "react";
import PageHeader from "../components/PageHeader.jsx";
import PageFooter from "../components/PageFooter.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

export default class PanelLoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      credentials: {
        login: "",
        password: ""
      },
      status: "idle" // idle | pending | ready | error
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // this.loadData();
  }

  clearUserData() {
    this.setState({
      credentials: {
        login: "",
        password: ""
      }
    });
    this.forceUpdate();
  }

  onSubmit(event) {
    event.preventDefault();
    fetch(`/api/login`, {
      method: "post",
      credentials: "same-origin",
      body: JSON.stringify(this.state.credentials),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          credentials: {
            login: json.email,
            password: json.slug,
          }
        });
        this.state.products.push(this.state.newProduct);
        // this.forceUpdate();
        this.clearUserData();
      })
      .catch(err => {
        this.setState({
          status: "error"
        });
        console.log(err.message);
      });
  }

  renderForm() {
    return (
      <form>
        <div className="form-group">
          <div className="form-group row">
            <label className="col-md-2 offset-md-1 col-sm-1 offset-sm-1 col-form-label">
              Имя пользователя
            </label>
            <input
              name="login"
              type="text"
              className="col-md-4 col-sm-3 form-control form-control-lg"
              placeholder="Login"
              // value={this.state.product.title}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group row">
            <label className="col-md-2 offset-md-1 col-sm-1 offset-sm-1 col-form-label">
              Пароль
            </label>
            <input
              name="password"
              type="password"
              className="col-md-4 col-sm-3 form-control form-control-lg"
              placeholder="password"
              // value={this.state.product.key}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="row">
            <button
              type="submit"
              className="btn btn-primary col-md-1 offset-md-3"
              onClick={this.onSubmit}
            >
              Войти
            </button>
          </div>
        </div>
      </form>
    );
  }

  render() {
    return (
      <React.Fragment>
        <PageHeader 
          headerClass='bg-warning'
        />

        <main className="row">
          <div className="col-md-10 offset-md-1 col-sm-12 bg-light paper">
          <Breadcrumbs />

            { this.renderForm() }

          </div>
        </main>

        <PageFooter />
      </React.Fragment>
    );
  }
}
