import conf from "../conf/conf";

export class CommentService {
    async createComment(postId,{content}) {
        try {
            const response= await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/comments/p/${postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({content})
            })
            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async updateComment(commentId,{content}) {
        try {
            const response= await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/comments/c/${commentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({content})
            })
            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async deleteComment(commentId) {
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/comments/c/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async getAllComments(postId) {
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/comments/p/${postId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const resJSON = await response.json()
            if(response.status==200){
                return resJSON.data
            }else{
                return null
            }
        } catch (error) {
            throw error
        }
    }
}

const commentService = new CommentService()
export default commentService