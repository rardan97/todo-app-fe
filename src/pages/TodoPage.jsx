import { useEffect, useState } from 'react'
import HeaderComponents from '../components/HeaderComponents'
import { createTodo, deleteTodo, getValueById, listTodo, updateTodo } from '../services/todoService';
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdBookmarkAdd } from "react-icons/md";

const TodoPage = () => {
  const [isEdit, setIsEdit] = useState(false);
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

  useEffect(() => {
    getListAllTodo();
  }, []);

  const handleChange = (event) => {
    console.log("select :"+ event.target.value)
    setStatus(event.target.value);
  };

  function getListAllTodo(){
    listTodo().then((response) => {
      setTodos(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  function saveTodo(e){
    e.preventDefault();
    console.log("proccess save");
    if(validateForm()){
      console.log("validation save");
      const todoData = {title, description, status}
      console.log("data todo :"+todoData)
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



function openEditModal(todoId){
  console.log(todoId);
  
  if(todoId){
      getValueById(todoId).then((response) => {
        setId(response.data.id);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setStatus(response.data.status);
        setIsEdit(true);
      }).catch(error => {
          console.error(error); 
      })
  }
}

function editTodo(e){
    e.preventDefault();
    if(validateForm()){
        const todoData = {title, description, status}
        const todoIdParam = id;
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
  console.log("proccess validation");
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

    if (!status || status === "0") {
      errorsCopy.status = "Please select a valid status.";
      valid = false;
    }else{
      errorsCopy.status = '';
      
  }
    setErrors(errorsCopy);
    return valid;
}

const resetForm = () => {
  setId('');
  setTitle('');
  setDescription('');
  setStatus(0);
  setErrors({});
  setIsEdit(false);
};


const openAddModal = () => {
  resetForm();
  setIsEdit(false);
};

const getTodoStatus = (statusx) => {
  console.log("statusx : "+statusx)
  if (statusx == 1) {
    console.log("statusx hasil 1: "+statusx)
    return 'in progress'; 
  } else if (statusx == 2) {
    console.log("statusx hasil 2: "+statusx)
    return 'done'; 
  }
};



  return (
    <div>
        <HeaderComponents />
        <div>
        <div className='m-4'>
            <div className="container">
                <div className="card" >
                    
                    <div className="card-body">
                       
                    
                        <div className="row justify-content-center">
                        
                            <div className="col-sm-12">
                                <div className='my-4'>
                                    <button type="button" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={openAddModal}>
                                    <MdBookmarkAdd size={20}/> Add Todo 
                                    </button>
                                </div>
                                <table className="table ">
                                      <thead>
                                        <tr>
                                          <th>No</th>
                                          <th>Todo Item</th>
                                          <th>Todo Desc</th>
                                          <th>Status</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                      {
                                      todos.map(todo => 
                                        <tr key={todo.id}>
                                          <th>1</th>
                                          <td>{todo.title}</td>
                                          <td>{todo.description}</td>
                                          <td>{getTodoStatus(todo.status)}</td>
                                          <td>
                                            <div><button className='btn btn-success btn-sm mx-2'  onClick={() => openEditModal(todo.id)} data-bs-toggle="modal" data-bs-target="#exampleModal"><MdEdit size={20}/> Edit</button>
                                            <button className='btn btn-danger btn-sm' onClick={() => delTodo(todo.id)}><MdDelete size={20}/> Delete</button></div>
                                          </td>
                                        </tr>
                                        )
                                      }
                                      </tbody>
                                  </table>
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
                    <h1 className="modal-title fs-5" id="exampleModalLabel">{isEdit ? 'Edit Todo' : 'Tambah Todo'}</h1>
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
                            <select 
                              className="form-select" 
                              aria-label="Default select example"  
                              value={status} 
                              onChange={handleChange}>
                                <option value={0}>Open this select menu</option>
                                <option value={1}>In Progress</option>
                                <option value={2}>Done</option>
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
                    <button type="submit" className="btn btn-primary" onClick={isEdit ? editTodo : saveTodo}>{isEdit ? 'Update' : 'Submit'}</button>
                </div>
                </div>
            </div>
        </div>
        </div>
      
    </div>
  )
}

export default TodoPage
