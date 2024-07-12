import axios from "axios";
import { judge0Url } from "../config";

const judge0server = axios.create({
    baseURL: judge0Url,
});

export default judge0server;
