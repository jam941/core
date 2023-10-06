import axios from 'axios';

async function  getJobs(){

    const id = '1HFIApiXWF4GFkZhXYddPyUa41n3EktbkDc0hz_x4gMQ'
    let data = await axios.get('https://api.fureweb.com/spreadsheets/'+id)
    return data


}   
export default getJobs