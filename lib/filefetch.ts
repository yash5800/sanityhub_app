import axios from 'axios';

export const fetchPosts = async (key: string) => {


  const projectId = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.EXPO_PUBLIC_SANITY_DATASET;
  const token = process.env.EXPO_PUBLIC_SANITY_TOKEN;

  console.log(projectId,dataset,token);
  

  const query = `*[_type == "post" && (!defined($search) || key match $search)] | order(_createdAt desc) {
    _id, key, filename, "fileUrl": file.asset->url, _createdAt
  }`;
  const encodedQuery = encodeURIComponent(query);

  const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${encodedQuery}&$search="${key || ''}"`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.result;
  } catch (error:any) {
    console.error('Error in API call:', error.response || error.message);
    throw error;
  }
};
