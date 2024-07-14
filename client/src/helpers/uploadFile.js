import conf from '../conf/conf';

const uploadFile = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${conf.cloudName}/auto/upload`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'chat-app-file');

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  const responseData = await response.json();
  return responseData;
};

export default uploadFile;
