import React from "react";

export default class PanelProductForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: {
        key: 0,
        title: '',
        description: '',
        img: '',
        slug: '',
        price: 0
      },
      submitHandler: this.props.submitHandler,
      changeHandler: this.props.changeHandler
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  setData(data) {
    if (data.key) {
      this.setState({
        product: {
          key: data.key,
          slug: data.slug,
          title: data.title,
          description: data.description,
          img: data.img,
          price: data.price
        }
      });
    }
  }
  
  componentDidMount() {
    this.setData(this.props.product);
  }

  handleInputChange(event) {
    const name = event.target.name;
    this.state.product[name] = event.target.value;
    this.forceUpdate();
    this.state.changeHandler(event);
  }

  onSave(event) {
    event.preventDefault();
    this.state.submitHandler(event);
  }

  render() {
    return <form>
      <div className="form-group">
        <div className="form-group row">
          <label className="col-md-2 offset-md-1 col-sm-1 offset-sm-1 col-form-label">Наименование товара</label>
          <input
            name="title"
            type="text"
            className="col-md-8 col-sm-7 form-control form-control-lg"
            placeholder="Наименование товара"
            value={this.state.product.title}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group row">        
          <label className="col-md-2 offset-md-1 col-sm-1 offset-sm-1 col-form-label">Описание товара</label>
          <textarea
            name="description"
            className="col-md-8 col-sm-7 form-control form-control-lg"
            rows="4"
            placeholder="Описание товара"
            value={this.state.product.description}
            onChange={this.handleInputChange}
          ></textarea>
        </div>
        <div className="form-group row"> 
          <label className="col-md-2 offset-md-1 col-sm-1 offset-sm-1 col-form-label">Изображение</label>
          <input
            name="img"
            type="text"
            className="col-md-8 col-sm-7 form-control form-control-lg"
            placeholder="image"
            value={this.state.product.img}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group row"> 
          <label className="col-md-2 offset-md-1 col-sm-1 offset-sm-1 col-form-label">Ключ</label>
          <input
            name="key"
            type="text"
            className="col-md-8 col-sm-7 form-control form-control-lg"
            placeholder="Ключ"
            value={this.state.product.key}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group row">           
          <label className="col-md-2 offset-md-1 col-sm-1 offset-sm-1 col-form-label">Слаг</label>
          <input
            name="slug"
            type="text"
            className="col-md-8 col-sm-7 form-control form-control-lg"
            placeholder="Слаг"
            value={this.state.product.slug}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group row">           
          <label className="col-md-2 offset-md-1 col-sm-1 offset-sm-1 col-form-label">Цена</label>
          <input
            name="price"
            type="text"
            className="col-md-8 col-sm-7 form-control form-control-lg"
            placeholder="Цена"
            value={this.state.product.price}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="row">
          <button type="submit" className="btn btn-primary col-md-1 offset-md-3" onClick={this.onSave}>Сохранить</button>
        </div>
      </div>
    </form>    
  }

}