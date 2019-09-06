import React from "react";

export default class Nav extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        activeIndex: 0
      }
    }
  
    onLinkClick(event) {
      this.setState({
        activeIndex: Number(event.currentTarget.dataset.index)
      })
    }
    
    render() {
      return <ul className={this.props.navClass}>
        { 
          this.props.tabs.map((title, index) => {
            return <li className="nav-item" key={index}>
              <a onClick={this.onLinkClick.bind(this)}
                className={index === this.state.activeIndex ? "nav-link active" : "nav-link"}
                href="#"
                data-index={index}
              >{title}</a>
            </li>
          })
        }
      </ul>
    }
}