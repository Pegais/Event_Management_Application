import axios from "axios"

const ApiUrl =axios.create({
    baseURL:'http://localhost:8000/'
})

export default ApiUrl