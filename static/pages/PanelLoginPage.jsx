import React from "react";
import PageHeader from "../components/PageHeader.jsx";
import PageFooter from "../components/PageFooter.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

const Cookie = require('cookie');
const jwt = require('jsonwebtoken');

export default class PanelLoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      credentials: {
        login: '',
        password: ''
      },
      status: 'idle' // idle | pending | logged | error
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderErrorAlert = this.renderErrorAlert.bind(this);
    this.renderPendingAlert = this.renderPendingAlert.bind(this);
    this.renderLoggedAlert = this.renderLoggedAlert.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    try {
      const cookies = Cookie.parse(document.cookie);
      const payload = jwt.decode(cookies.token);
      const timestampInMilliseconds = new Date().getTime();
      if (payload.exp && (1000 * payload.exp > timestampInMilliseconds)) {
        this.setState({
          credentials: {
            login: payload.email,
            password: ''
          },
          status: 'logged'
        });  
      } else {
        this.setState({
          status: 'idle'
        });        
      }
    } catch (err) {
      console.log(err.message);
      this.setState({
        status: 'idle'
      });
    }
    this.forceUpdate();
  }

  handleInputChange(event) {
    const name = event.target.name;
    this.state.credentials[name] = event.target.value;
    this.forceUpdate();
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({
      status: 'pending'
    });
    fetch('/api/login', {
      method: 'post',
      credentials: 'same-origin',
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
            password: ''
          },
          status: 'logged'
        });
        this.forceUpdate();
      })
      .catch(err => {
        this.setState({
          status: 'error'
        });
        console.log(err.message);
      });
  }

  onLogout(event) {
    event.preventDefault();
    this.setState({
      status: 'idle'
    });
    document.cookie = 'token=; Path=/; Max-Age=0;';
  }

  renderForm() {
    return <React.Fragment>
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
              //value={this.state.credentials.login}
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
              placeholder="Password"
              //value={this.state.credentials.password}
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
    </React.Fragment>
  }

  renderErrorAlert() {
    return <div className="alert alert-danger" role="alert">
      Доступ запрещен.
    </div>;    
  }

  renderIdleAlert() {
    return <div className="alert alert-primary" role="alert">
      Авторизация пользователя
    </div>;    
  }

  renderPendingAlert() {
    return <div className="alert alert-secondary" role="alert">
      Загрузка...
    </div>;    
  }

  renderLoggedAlert() {
    return <div className="alert alert-success" role="alert">
      {`Пользователь ${this.state.credentials.login} авторизован.`}
    </div>;    
  }

  renderLogoutButton() {
    return <div className="row">
      <button
        type="submit"
        className="btn btn-primary col-md-1 offset-md-3"
        onClick={this.onLogout}
      >
        Выйти
      </button>
    </div>;    
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
            { this.state.status === "error" && this.renderErrorAlert() }
            { this.state.status === "idle" && this.renderIdleAlert() }
            { this.state.status === "pending" && this.renderPendingAlert() }
            { this.state.status === "logged" && this.renderLoggedAlert() }
            { this.state.status === "logged" && this.renderLogoutButton() }
            { this.state.status !== "logged" && this.renderForm() }
          </div>
        </main>

        <PageFooter />
      </React.Fragment>
    );
  }
}
