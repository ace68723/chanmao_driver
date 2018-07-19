export default  {
  getHistory(){
    const url = 'https://www.cmapi.ca/cm_driver/dev/api/v1/history'

    let options = {
        method: 'GET',
        mode:'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    options.headers = Object.assign(options.headers,{
        authortoken:'123'
    })

    return fetch(url,options)
            .then((res) => res.json())
            .catch((error) => {throw error})
  },
}
