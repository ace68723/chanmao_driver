export default  {
  getTaskDetail(io_data){
    const url = 'https://www.cmapi.ca/cm_driver/api/v1/orders/' + io_data.oid

    let options = {
        method: 'GET',
        mode:'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    options.headers = Object.assign(options.headers,{
        Authortoken:'w6jqxH/*M9eR~Q:*$(qfk^m`E"5fGXj'
    })

    return fetch(url,options)
            .then((res) => res.json())
            .catch((error) => {throw error})
  },
}
