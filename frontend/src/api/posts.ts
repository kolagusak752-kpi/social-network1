import { api } from './apiFetch';
export const postsApi = {
    sharePost: (formData: FormData) => {  
        console.log(formData.get("post-description"))
        console.log(formData.get("post-files"))
        return api.postFormData('/api/posts/sharePost', formData)
    }
}