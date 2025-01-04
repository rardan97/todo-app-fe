import React, { useEffect, useState } from 'react'
import HeaderComponents from '../components/HeaderComponents'
import { createTodo, deleteTodo, getValueById, listTodo, updateTodo } from '../services/todoService';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({
    title:'',
    description:'',
    status:''
  });

  const [selectedOption, setSelectedOption] = useState('1');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    getListAllTodo();
  }, []);

  function getListAllTodo(){
    listTodo().then((response) => {
      setTodos(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  function saveTodo(e){
    e.preventDefault();
    if(validateForm()){
      const todoData = {title, description, status}
      createTodo(todoData).then((response) => {
        console.log(response.data);
        getListAllTodo();
      }).catch(error => {
        console.log(error);
      })
    }
  }

  function clearInput(){
    setTitle('');
    setDescription('');
    setStatus('');
  }

  function getTodoById(todoId){
    console.log(todoId);
    
    if(todoId){
        getValueById(todoId).then((response) => {
          setId(response.data.id);
          setTitle(response.data.title);
          setDescription(response.data.description);
          setStatus(response.data.status);
        }).catch(error => {
            console.error(error); 
        })
    }
}

function editTodo(e){
    e.preventDefault();
    

    console.log("proccess");
        // console.log(kategoriId);
    if(validateForm()){
        console.log("proccess11");
        const todoData = {title, description, status}
        const todoIdParam = id;
        console.log("proccess12 :" + id);
        updateTodo(todoIdParam, todoData).then((response) => {
            console.log(response.data);
            getListAllTodo();
            document.getElementById('closeModal').click();
            clearInput();
        }).catch(error => {
            console.log(error);
        })
    }
}

function delTodo(todoId){
    deleteTodo(todoId).then((response) => {
        console.log(response.data);
        getListAllTodo();
    })
}

function validateForm(){
    let valid = true;
    const errorsCopy = {... errors}
    
    if(title.trim()){
        errorsCopy.title = '';
    }else{
        errorsCopy.title = 'title is required';
        valid = false;
    }

    if(description.trim()){
        errorsCopy.description = '';
    }else{
        errorsCopy.description = 'description is required';
        valid = false;
    }

    if(status.trim()){
      errorsCopy.title = '';
  }else{
      errorsCopy.title = 'status is required';
      valid = false;
  }

    setErrors(errorsCopy);
    return valid;
}





  return (
    <div>
        <HeaderComponents />
        <div>
        <div className='m-3'>
            <div className="container">
                <div className="card border-0">
                    <div className="card-body">
                       
                        
                        <div className="row justify-content-center">
                            
                            <div className="col-sm-7">
                                <div className='my-4'>
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Add Todo
                                    </button>
                                </div>
                                {
                                  todos.map(todo => 
                                    <div className="card my-3" key={todo.id}>
                                      <div className="card-body">
                                          <div className="d-flex">
                                              <div className="flex-grow-1">
                                                  <h5 className="card-title">{todo.title}</h5>
                                                  <p className="card-text">{todo.description}</p>
                                              </div>
                                              <div className="p-2"><button className='btn btn-primary'  onClick={() => getTodoById(todo.id)} data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></div>
                                              <div className="p-2"><button className='btn btn-danger' onClick={() => delTodo(todo.id)}>Delete</button></div>
                                          </div>
                                      </div>
                                  </div>
                                  )
                                }
                                
                                
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
 
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Tambah Todo</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form>
                      <input 
                                type="hidden" 
                                name='id'
                                value={id}
                                onChange={(e) => setId(e.target.value)} 
                            />
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="title" 
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                            {errors.title && <div className='invalid-feedback'>{errors.title}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <select className="form-select" aria-label="Default select example"  value={selectedOption} onChange={handleChange}>
                                <option>Open this select menu</option>
                                <option value="1">In Progress</option>
                                <option value="2">Done</option>
                            </select>
                            {errors.status && <div className='invalid-feedback'>{errors.status}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Deskripsi</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="description" 
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                            {errors.description && <div className='invalid-feedback'>{errors.description}</div>}
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary" onClick={saveTodo}>Submit</button>
                    <button type="submit" className="btn btn-primary" onClick={editTodo}>Update</button>
                </div>
                </div>
            </div>
        </div>
        </div>
      
    </div>
  )
}

export default TodoPage
