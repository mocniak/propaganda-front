import React from 'react';
// import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            error: null,
            isLoading: true,
            title: '',
            content: [],
        };
        this.updateContent = this.updateContent.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log('pre fetch');
        fetch('http://localhost:8000/admin/edit-article/c3079f45-f1b4-4104-ac38-48a897d84e8c')
            .then(console.log('fetched'))
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
            console.log(item.id);
            return e.target.id === item.id
        });
        content[index].value = e.target.value;
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
        alert('A name was submitted: ' + this.state.title);
        event.preventDefault();
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
                                <hr/>
                            </div>
                        )}
                    </div>
                    <input type="submit" value="Submit"/>
                </form>
            )
        }
    }
}

export default App