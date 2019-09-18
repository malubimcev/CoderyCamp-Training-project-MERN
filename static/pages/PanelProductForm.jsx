import React from "react";

export default class PanelProductForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      product: {
        key: 0,
        title: 'no title',
        description: 'no description',
        img: '',
        slug: ''
      },
      handler: this.props.submitHandler
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  setData(product) {
    if (product.key) {
      this.setState({
        product: {
          key: product.key,
          slug: product.slug,
          title: product.title,
          description: product.description,
          img: product.img
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
  }

  onSave(event) {
    event.preventDefault();
    this.state.handler(this.state.product);
  }

  render() {
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

}