import axios from "axios";

const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

// const deleteNote = id => {
//     return axios.delete(`${baseUrl}/${id}`)
// }


export default {getAll, create, update}

//duzi oblik od gore :) ovo gore je ES6
// export default {  
    // getAll : getAll,
    // create : create,
    // update : update
// }

//ES6
// const name = `levi`
// const age = 0
// stara javascript kreiranje objekta
// const person = {
//     name: name,
//     age: age
// }
// ES6 kreiranje objekta
// const person = {name, age}