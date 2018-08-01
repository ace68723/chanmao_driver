import AppConstants from '../../Constants/AppConstants';
export default  {
  getHistory(reqData){
    // const url = 'https://www.cmapi.ca/cm_driver/dev/api/v1/history'
    const url = AppConstants.API_HISTORY;
    let options = {
        method: 'GET',
        mode:'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    options.headers = Object.assign(options.headers,{
        authortoken: reqData.token,
    })

    return fetch(url,options)
            .then((res) => res.json())
            .catch((error) => {throw error})
  },
}
