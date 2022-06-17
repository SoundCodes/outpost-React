import React from 'react';

export const LoginUser = async (username, password, fcmtoken) => {
  try {
    console.log(username, password);
    const collection = new FormData();
    collection.append('email', username);
    collection.append('password', password);

    const response = await fetch(`https://sound.codes/?rest_route=/simple-jwt-login/v1/auth&AUTH_KEY=sc-outpost-react@2022`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: collection,
    });
    const json = await response.json();
    if (json.success) {
      const saveResponse = await fetch('https://outpost.sound.codes/outpost-app/backend/api/login_controller/save_userdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': json.data.jwt,
          'Authkey': 'sc-outpost-react@2022'
        },
      }).catch(error => {
        console.log(error);
        throw error;
      });
      const userDet = (await saveResponse.json()).data;
      userDet.token = json.data.jwt;
      const tokenColl = new FormData();
      tokenColl.append('fcm_token', fcmtoken);
      await fetch('https://outpost.sound.codes/outpost-app/backend/api/login_controller/fcmtoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': json.data.jwt,
          'Authkey': 'sc-outpost-react@2022'
        },
        body: tokenColl
      }).catch(error => {
        console.log(error);
        throw error;
      });
      return userDet;
    } else {
      console.warn(json);
      throw json;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const RegisterUser = async (data, email, password) => {
  const response = await fetch('https://sound.codes/?rest_route=/simple-jwt-login/v1/users&AUTH_KEY=sc-outpost-react@2022', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    },
    body: data,
  }).catch(err => {
    console.log(err);
    throw err;
  });
  const result = await response.json();
  console.log(result);
  if (result.success) {
    const saveResponse = await fetch('https://outpost.sound.codes/outpost-app/backend/api/login_controller/save_userdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': result.jwt,
        'Authkey': 'sc-outpost-react@2022'
      },
    }).catch(error => {
      console.log(error);
      throw error;
    });
    console.log('Here');
    const userDet = (await saveResponse.json()).data;
    console.log(userDet);
    userDet.token = result.jwt
    return userDet;
  } else {
    throw result;
  }
}

export const ResetPassword = async (email) => {
  console.log(`https://sound.codes/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${email}&AUTH_KEY=sc-outpost-react@2022`);
  try {
    const response = await fetch(`https://sound.codes/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${email}&AUTH_KEY=sc-outpost-react@2022`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });
    const json = await response.json();
    if (json.data !== undefined && json.data.success) {
      console.log(json);
      return json;
    } else {
      throw json;
    }

  } catch (error) {
    console.log(error);
    return error;
  }
}

export const sendCallData = async (id, data, type, message, token) => {
  try {
    const collection = new FormData();
    collection.append('receiver_id', id);
    collection.append('data', JSON.stringify(data));
    collection.append('type', type);
    collection.append('message', message);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/calldata`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token,
        'Authkey': 'sc-outpost-react@2022'
      },
      body: collection
    });
    const json = await response.json();
    console.log(json);
    if (json.status == 1) {
      return json.data;
    } else {
      console.warn(json);
      throw json;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getCallData = async (id, token) => {
  try {
    const collection = new FormData();
    collection.append('offer_id', id);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/offerdata`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token,
        'Authkey': 'sc-outpost-react@2022',
        'Accept': 'application/json',
      },
      body: collection
    });
    console.log(response.body);
    const json = await response.json();
    console.log(json);
    if (json.status == 1) {
      console.log(json.data);
      return json.data;
    } else {
      console.warn(json);
      throw json;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const makeCall = async (id, offer, token) => {
  console.log(JSON.stringify(offer));
  try {
    const collection = new FormData();
    collection.append('receiver_id', id);
    collection.append('offer', JSON.stringify(offer));
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/call`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token,
        'Authkey': 'sc-outpost-react@2022'
      },
      body: collection
    });
    const json = await response.json();
    console.log(json);
    if (json.status == 1) {
      return json.data;
    } else {
      console.warn(json);
      throw json;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getOffer = async (id, token) => {
  try {
    const collection = new FormData();
    collection.append('offer_id', id);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/offerdata`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token,
        'Authkey': 'sc-outpost-react@2022'
      },
      body: collection
    });
    const json = await response.json();
    if (json.status == 1) {
      return json.data;
    } else {
      console.warn(json);
      throw json;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// export const getIceServers = async () => {
//   try {
//     const tokenRes = await fetch(`https://subspace.auth0.com/oauth/token`, {
//       method: 'POST', // or 'PUT'
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify({
//         client_id: "gawBN14rkR4XVzXhS0VCXmTSF9ybNMGT",
//         client_secret: "MdIt0r43nIyOS3zhxD0vTuxnaeTCfOcnL1YOSkLowAQkb2y9X5yrvB3KhJ4stYqy",
//         audience: "https://api.subspace.com/",
//         grant_type: "client_credentials"
//       }),
//     });
//     const json = await tokenRes.json();
//     console.log(json);
//     if(json.access_token) {
//       const auth = json.token_type + ' ' + json.access_token;
//       console.log(auth);
//       const response = await fetch(`https://api.subspace.com/v1/webrtc-cdn`, {
//         method: 'POST', // or 'PUT'
//         headers: {
//           authorization: auth
//         },
//       });
//       const res = await response.json();
//       console.log(res.iceServers);
//       return res.iceServers;
//     } else {
//       throw json;
//     }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

export const getIceServers = async (token) => {
  try {
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/getice`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token,
        'Authkey': 'sc-outpost-react@2022'
      },
    });
    const json = await response.json();
    if (json.status == 1) {
      console.log(json.data);
      return json.data;
    } else {
      console.warn(json);
      throw json;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const logout = () => {
  this.props.setToken(null);
  this.props.navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: 'login' }],
    }),
  );
}