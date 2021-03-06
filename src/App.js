import React from 'react';
// import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

class App extends React.Component {
  constructor() {
    super();
    let articleId = document.getElementById("articleId").innerHTML;
    this.state = {
      articleId: articleId,
      error: null,
      isLoading: true,
      title: '',
      coverImage: '',
      author: '',
      slug: '',
      content: [],
    };
    this.updateContent = this.updateContent.bind(this);
    this.updateField = this.updateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddField = this.handleAddField.bind(this);
    this.deleteContent = this.deleteContent.bind(this);
    this.findContentIndex = this.findContentIndex.bind(this);
  }

  componentDidMount() {
    fetch('/api/get-article-data/' + this.state.articleId)
      .then(response => response.json())
      .then(
        (data) => {
          this.setState({
            content: data.content.map(function (item) {
              return {
                id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
                type: item.type,
                value: item.value
              }
            }),
            title: data.title,
            author: data.author,
            slug: data.slug,
            coverImage: data.coverImage,
            isLoading: false
          });
        },
        (error) => {
          this.setState({
            isLoading: false,
            error
          });
        }
      )
  }

  updateContent(id, value) {
    let content = this.state.content;
    let index = content.findIndex((item) => {
      return id === item.id
    });
    content[index].value = value;
    this.setState({
      content: content
    });
    this.forceUpdate();
  }

  deleteContent(e) {
    let content = this.state.content;
    let index = content.findIndex((item) => {
      return e.target.id === item.id
    });
    content.splice(index, 1);
    this.setState({
      content: content
    });
    this.forceUpdate();
  }

  updateField(e) {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit(event) {
    let body = JSON.stringify({
      title: this.state.title,
      author: this.state.author,
      slug: this.state.slug,
      content: this.state.content,
      coverImage: this.state.coverImage
    });
    fetch('/api/submit-edit-article/' + this.state.articleId, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body
    });
    event.preventDefault();
  }

  handleAddField(type, index) {
    let content = this.state.content;
    let newField = {
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      type: type,
      value: ''
    };
    content.splice(index, 0, newField);
    this.setState({
      content: content
    });
  }

  findContentIndex(id) {
    return this.state.content.findIndex((item) => {
      return id === item.id
    });
  }

  render() {
    const {error, isLoading, content} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoading) {
      return <div>Loading...</div>;
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Title
              <br/>
              <input
                id='title'
                ref='title'
                value={this.state.title}
                onChange={this.updateField}
              />
            </label>
            <label>Author
                <br/>
                <input
                    id='author'
                    ref='author'
                    value={this.state.author}
                    onChange={this.updateField}
                />
            </label>
            <label>Slug
                <br/>
                <input
                    id='slug'
                    ref='slug'
                    value={this.state.slug}
                    onChange={this.updateField}
                />
            </label>
            <hr/>
            <label>Cover Image
              <br/>
              <input
                id='coverImage'
                ref="coverImage"
                value={this.state.coverImage}
                onChange={this.updateField}
              />
            </label>
            <hr/>
            {content.map(item =>
              <div key={item.id}>
                <AddContentField addField={this.handleAddField} index={this.findContentIndex(item.id)}/>
                <hr/>
                <label className={item.type}>{item.type} | <span id={item.id}
                                                                 onClick={this.deleteContent}>[delete]</span>
                  <br/>
                  <Input
                    id={item.id}
                    value={item.value}
                    type={item.type}
                    updateCallback={this.updateContent}
                  />
                </label>
                <hr/>
              </div>
            )}
          </div>
          <AddContentField addField={this.handleAddField} index={this.state.content.length}/>
          <hr/>
          <input type="submit" value="Submit"/>
        </form>
      )
    }
  }
}

class AddContentField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'text'};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  handleSubmit(event) {
    this.props.addField(this.state.value, this.props.index);
    event.preventDefault();
  }

  render() {
    return (
      <div className="add-content-widget">
        <select value={this.state.value} onChange={this.handleChange} name="newContent">
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <div className="add-content-button" onClick={this.handleSubmit}>Add content</div>
      </div>
    )
  }
}

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  update(e) {
    this.props.updateCallback(this.props.id, e.target.value)
  }

  render() {
    if (this.props.type === 'text') return (
      <textarea
        id={this.props.id}
        defaultValue={this.props.value}
        onChange={this.update}
      />
    );
    return (
      <input
        id={this.props.id}
        defaultValue={this.props.value}
        onChange={this.update}
      />
    )
  }
}

export default App