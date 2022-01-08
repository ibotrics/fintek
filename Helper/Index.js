import axios from "axios";
var instance = axios.create({
    baseURL: '',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });

export const getApi = (url) =>{
    console.log("this is get");
}

export const postApi = (data, url) =>{
    console.log("this is get");
}

export const putApi = (data, url) =>{
    console.log("this is get");
}

export const deleteApi = (data, url) =>{
    console.log("this is get");
}