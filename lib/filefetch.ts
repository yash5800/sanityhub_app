import axios from 'axios';

export const fetchPosts = async (key: string) => {
  const projectId = 'qvz6ecd3';
  const dataset = 'production';
  const token = 'skASxqccKDelTIIHlyy6dI6piE9sAPEIClGNgJbpIviw8SVKn8I9ETCyZkXKG3uHETUG3s0yzVvyiFi8eC4R3Ye3w20sQK00yy0ir0aq0GC5SHxP6Kd73qL6gl8z5m8DBrb5bBAvQmHkzOebc7Hb3yO65FCZQBTwGDKQ9UxkxOQuEY2ds120';
  console.log(projectId,dataset,token)

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
