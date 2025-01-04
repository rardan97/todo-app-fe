import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/todo";

export const listTodo = () => axios.get(REST_API_BASE_URL + '/getListAll');

export const getValueById = (todoId) => axios.get(REST_API_BASE_URL + '/getValueById/' + todoId);

export const createTodo = (todo) => axios.post(REST_API_BASE_URL+'/createTodo', todo);

export const updateTodo = (todoId, todo) => axios.put(REST_API_BASE_URL +'/updateTodo/'+todoId, todo);

export const deleteTodo = (todoId) => axios.delete(REST_API_BASE_URL +'/deleteTodo/'+todoId);