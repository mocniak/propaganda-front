import React from 'react';
// import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

class App extends React.Component {
    constructor() {
        super();
        let articleId = document.getElementById("articleId").innerHTML;
        this.state = {
            articleId: '864f0681-e60c-49d4-bfe6-86c689f207ca',
            error: null,
            isLoading: true,
            title: '',
            coverImage: '',
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
        fetch('http://127.0.0.1:8000/admin/get-article-data/' + this.state.articleId)
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

    updateContent(e) {
        let content = this.state.content;
        let index = content.findIndex((item) => {
            return e.target.id === item.id
        });
        content[index].value = e.target.value;
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
            content: this.state.content,
            coverImage: this.state.coverImage
        });
        fetch('http://127.0.0.1:8000/admin/submit-edit-article/' + this.state.articleId, {
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
                                <label>{item.type}
                                    <br/>
                                    <input
                                        id={item.id}
                                        defaultValue={item.value}
                                        onChange={this.updateContent}
                                    />
                                </label>
                                <p><span id={item.id} onClick={this.deleteContent}>[delete]</span></p>
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
            <div>
                <select value={this.state.value} onChange={this.handleChange} name="newContent">
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                </select>
                <p onClick={this.handleSubmit}>Add content</p>
            </div>
        )
    }
}

export default App