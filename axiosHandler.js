
let axios = require("axios");
const token = `3f187adaecf428c2c72ac61bd6245537ca51900d`;


exports.makeAPICall = async (method, url, payload = {}, attachHeaders = false) => {
  const host ='https://dev-api.rizort.net/api/v1';
  const headers= {
                   'Content-Type':'application/json',
                   Authorization: `Token ${token}`
                 }
  switch (method) {
    case "GET": {
      let { data } =  await axios({ method: "GET", url: host + url });
      return data;
    };
    case "POST": {
      let { data } = await axios({ method: "POST", url: host + url, headers: attachHeaders ? headers :{}, data: payload });
      return data;
    };
    case "PUT": {
      let { data } = await axios({ method: "PUT", url: host + url, headers: headers, data: payload });
      return data;
    };
  };
};

// correct without axios handler
  // const {data } = await axios({
   //               method:'POST',
   //               url: `${host}/api/v1/spotlight/user_details/`,
   //               headers: {
   //                 'Content-Type':'application/json',
   //                 Authorization: `Token 3f187adaecf428c2c72ac61bd6245537ca51900d`,
   //               },
   //               data:{
   //                 "name":"santhini",
   //             "team_id":'T24RCNG31'
   //               },
   //             } );  