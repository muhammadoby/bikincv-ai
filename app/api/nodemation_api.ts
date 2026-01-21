import env from "#start/env";
import axios from "axios";

// nodemation config api
const nodemationApiConfig = axios.create({
  baseURL: env.get('NODEMATION_AI_URL'),
  headers: {
    Accept: 'application/json',
    'x-api-token': env.get('NODEMATION_AI_APIKEY')
  }
})

export default nodemationApiConfig
