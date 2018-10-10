import AppConstants from '../../Constants/AppConstants';
export default  {
  getHistory(reqData){
    const url = 'https://www.cmapi.ca/cm_backend/index.php/api/driver/v1/get_dr_summary'
    // const url = AppConstants.API_HISTORY;
    let options = {
        method: 'POST',
        mode:'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    options.body = JSON.stringify({
        authortoken: reqData.token,
        start_time: reqData.start_time,
        end_time : reqData.end_time
    })
    console.log(options);
    return fetch(url,options)
            .then((res) => res.json())
            .catch((error) => {throw error})
  },
}
