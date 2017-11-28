import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {items: []}
    }

    componentWillMount() {
        fetch('http://127.0.0.1:8000/admin/edit-article/0226c31c-a1a6-4e69-96e7-463d26071b33')
            .then(response => response.json())
            .then(data => this.setState({items}))
    }

    filter(e) {
        console.log(e.target.value);
        this.setState({filter: e.target.value})
    }

    render() {
        let items = this.state.items;
        if (this.state.filter) {
            items = items.filter(item =>
                item.name.toLowerCase()
                    .includes(this.state.filter.toLowerCase()))
        }
        return (
            <div>
                <input
                    type="text"
                    onChange={this.filter.bind(this)}/>
                {items.map(item =>
                    <Person key={item.name} person={item}/>
                )}
            </div>
        )
    }
}

const Person = (props) => <h4>{props.person.name}</h4>

export default App