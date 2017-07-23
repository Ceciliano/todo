import React, {Component} from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm'
import TodoList from './todoList'

const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component {
  constructor(props){
    super(props)
    this.state = {description:'', list:[]}

    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleMarkAsDone = this.handleMarkAsDone.bind(this);
    this.handleMarkAsPending = this.handleMarkAsPending.bind(this);

    this.refresh()
  }

  refresh(description = ''){
    axios.get(`${URL}?sort=-createdAt&description__regex=/${description}/i`)
         .then(resp => this.setState({...this.state, description, list: resp.data}))
  }

  handleAdd(){
    console.log(this.state.description)
    const description = this.state.description
    axios.post(URL, {description}).then(resp =>this.refresh())
  }

  handleChange(e){
    this.setState({...this.state, description: e.target.value})
  }

  handleSearch(){
    this.refresh(this.state.description);
  }

  handleClear(){
    this.refresh();
  }

  handleRemove(todo){
    axios.delete(`${URL}/${todo._id}`).then(resp => this.refresh(this.state.description))
  }

  handleMarkAsDone(todo){
    axios.put(`${URL}/${todo._id}`, { ...todo, done: true }).then(resp => this.refresh(this.state.description))
  }

  handleMarkAsPending(todo){
    axios.put(`${URL}/${todo._id}`, { ...todo, done: false }).then(resp => this.refresh(this.state.description))
  }

  render(){
    return (
      <div>
        <PageHeader name='Rafael' small='Braga'></PageHeader>
        <TodoForm handleAdd={this.handleAdd}
                  handleChange={this.handleChange}
                  handleSearch={this.handleSearch}
                  handleClear={this.handleClear}
                  description={this.state.description}/>
        <TodoList list={this.state.list}
                  handleRemove={this.handleRemove}
                  handleMarkAsDone={this.handleMarkAsDone}
                  handleMarkAsPending={this.handleMarkAsPending} />
      </div>
    )
  }
}
