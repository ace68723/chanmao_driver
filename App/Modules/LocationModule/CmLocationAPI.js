export default  {
    sendLocation(io_data){
      const url = 'https://norgta.com/api/general/v2/get_geolocation';
  
      let options = {
          method: 'POST',
          mode:'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
      };
  
      options.body = JSON.stringify({
        driver_id: io_data.driver_id,
        lat: io_data.lat,
        log: io_data.log
      })
  
      return fetch(url,options)
              .then((res) => res.json())
              .catch((error) => {throw error})
    },
  }
  