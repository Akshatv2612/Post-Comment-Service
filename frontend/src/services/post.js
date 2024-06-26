import conf from "../conf/conf";

export class PostService {
    async createPost({ title, content, status, thumbnail }) {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('status', status)
        formData.append("thumbnail", thumbnail[0])
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/posts/createPost`, {
                method: "POST",
                credentials: "include",
                body: formData
            })

            const resJSON = await response.json()
            if (resJSON.success == true) {
                return resJSON.data
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async updatePost(postId, { title, content, status, thumbnail }) {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('status', status)
        formData.append("thumbnail", thumbnail[0])
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/posts/${postId}`, {
                method: "PATCH",
                credentials: "include",
                body: formData
            })
            const resJSON = await response.json()
            if (resJSON.success == true) {
                return resJSON.data
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async deletePost(postId) {
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const resJSON = await response.json()
            if (resJSON.success == true) {
                return resJSON.data
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async getPost(postId) {
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/posts/${postId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const resJSON = await response.json()
            if (resJSON.success == true) {
                return resJSON.data
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async getPosts() {
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/posts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const resJSON = await response.json()
            if (resJSON.success == true) {
                return resJSON.data.docs
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async getCurrentUserPosts() {
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/posts/currentUserPosts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const resJSON = await response.json()
            if (resJSON.success == true) {
                return resJSON.data.docs
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }
}

const postService = new PostService()
export default postService