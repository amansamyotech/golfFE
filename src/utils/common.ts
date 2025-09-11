import { toast } from 'react-toastify';

export async function handleApiResponse(response: any, method = '') {
  switch (response?.status) {
    case 200:
      if (method === 'UPDATE' || method === 'DELETE') {
        toast.success(response?.message || 'Data Updated Successfully');
      }
      return response.data;

    case 201:
      toast.success(response?.message || 'Data Added Successfully');
      return response.data;

    case 404:
    case 409:
    case 422:
    case 400:
      toast.info(response?.message);
      return response;

    case 401:
      toast.info(response?.message || 'Unauthorized');
      return response;

    case 500:
      toast.error(response?.message || 'Something went wrong');
      return response;

    default:
      return response;
  }
}
