import React from 'react';

export const UploadFile = async (file, filename, userSent, token, lat, long) => {
  try {
    const collection = new FormData();
    collection.append('user_sent', userSent);
    collection.append('latitude', lat);
    collection.append('longitude', long);
    collection.append('audio_file', {
      uri:
        Platform.OS === 'android'
          ? 'file://'+file
          : file.replace('file://', ''),
      name: filename,
      type: 'audio/wav',
    });
    // collection.append('audio_file', file, filename);
    console.log(JSON.stringify(collection));
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/upload_file`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': token,
        'Authkey': 'sc-outpost-react@2022'
      },
      body: collection,
    });
    console.log(response);
    const json = await response.json();
    if (json.status == 1) {
      console.log(json);
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

export const GetFiles = async (token) => {
    try {
  
      const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/user_all_files`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token,
          'Authkey': 'sc-outpost-react@2022'
        }
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

  export const GetPublicFiles = async (token) => {
    try {
  
      const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/public_files`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token,
          'Authkey': 'sc-outpost-react@2022'
        }
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

  export const GetFriends = async (token) => {
    try {
  
      const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/friends_list`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token,
          'Authkey': 'sc-outpost-react@2022'
        }
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

export const deleteFile = async (token, recordingId) => {
  try {
    const collection = new FormData();
    collection.append('recording_id', recordingId);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/delete_recording`, {
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

export const saveMetaDesc = async (token, recordingId, meta) => {
  try {
    console.log('Here');
    const collection = new FormData();
    collection.append('recording_id', recordingId);
    collection.append('meta', meta);
    console.log(collection);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/update_meta`, {
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

export const makePublic = async (token, recordingPath) => {
  try {
    console.log('Here');
    const collection = new FormData();
    collection.append('file_path', recordingPath);
    console.log(collection);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/makepublic_file`, {
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

export const changeOwner = async (token, recordingId, ownerId) => {
  try {
    console.log('Here');
    const collection = new FormData();
    collection.append('recording_id', recordingId);
    collection.append('owner_id', ownerId);
    console.log(collection);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/change_owner`, {
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

export const getSignedUrl = async (token, recordingUrl) => {
  try {
    console.log('Here');
    const collection = new FormData();
    collection.append('file_path', recordingUrl);
    console.log(collection);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/signed_url`, {
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

export const sendFriendRequest = async (token, email) => {
  try {
    const collection = new FormData();
    collection.append('receiver_email', email);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/friend_request`, {
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
      return json;
    } else {
      console.warn(json);
      throw json;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const acceptFriendRequest = async (token, code) => {
  try {
    const collection = new FormData();
    collection.append('acceptance_code', code);
    const response = await fetch(`https://outpost.sound.codes/outpost-app/backend/api/login_controller/accept_friend_request`, {
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