import React from 'react';
// import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

class App extends React.Component {
    constructor() {
        super();
        let url = new URL(window.location.href);
        let articleId = url.searchParams.get("articleId");
        this.state = {
            articleId: articleId,
            error: null,
            isLoading: true,
            title: '',
            content: [],
        };
        this.updateContent = this.updateContent.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddField = this.handleAddField.bind(this);
        this.deleteContent = this.deleteContent.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8000/admin/edit-article/' + this.state.articleId)
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
        console.log(index);

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
        console.log(index);
        content.splice(index, 1);
        this.setState({
            content: content
        });
        this.forceUpdate();
    }

    updateTitle(e) {
        this.setState({
            title: e.target.value
        })
    }

    handleSubmit(event) {
        let body = JSON.stringify({
            title: this.state.title,
            content: this.state.content
        });
        fetch('http://localhost:8000/admin/submit-edit-article/' + this.state.articleId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        });
        event.preventDefault();
    }

    handleAddField(type) {
        let content = this.state.content;
        let newField = {
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
            type: type,
            value: ''
        };
        content.push(newField);
        this.setState({
            content: content
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
                                ref="title"
                                value={this.state.title}
                                onChange={this.updateTitle}
                            />
                        </label>
                        <hr/>
                        {content.map(item =>
                            <div key={item.id}>
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
                    <AddContentField addField={this.handleAddField}/>
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
        this.props.addField(this.state.value);
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