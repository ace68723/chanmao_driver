export default {
    changeOrderStatus(io_data) {
        const url = 'https://www.chanmao.ca/index.php?r=MobDriver10/OrderChange';

        let options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        options.headers = Object.assign(options.headers, {
            authortoken: io_data.token,
        });

        options.body = JSON.stringify({
            oid: io_data.oid,
            task: io_data.change,
        });
        console.log(options);
        return fetch(url, options)
                .then((res) => res.json())
                .catch((error) => {throw error;});
    },
};
