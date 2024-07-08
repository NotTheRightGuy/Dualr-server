import axios from "axios";

const judge0server = axios.create({
    baseURL: "http://localhost:2358",
});

export default judge0server;
