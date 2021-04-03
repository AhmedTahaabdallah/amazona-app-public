import axios from 'axios';

const instance = axios.create({
    //baseURL: 'http://127.0.0.1:8000'
    //baseURL: 'https://amazona-apps.herokuapp.com/'
    baseURL: ''
});

// instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// instance.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';
// instance.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';

export default instance;