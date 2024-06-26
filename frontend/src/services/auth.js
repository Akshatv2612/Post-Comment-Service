import conf from "../conf/conf";

export class AuthService {
    async register(fullname, username, email, password) {
        try {
            const res = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fullname, username, email, password }),
            })
            const response= await res.json()
            if(response.success==true){
                return await this.login(email, password)
            }else{
                return response
            }
        } catch (error) {
            throw error
        }
    }

    async login(email, password) {
        try {
            const res = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const resJSON= await res.json()
            return resJSON
        } catch (error) {
            throw error
        }
    }

    async logout() {
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/users/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            return response.json()
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser() {
        try {
            const response = await fetch(`${conf.serverUrl}${conf.type}/${conf.version}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const resJSON=await response.json()
            if(resJSON.statusCode==200){
                return resJSON.data
            }else{
                return null
            }

        } catch (error) {
            throw error
        }
    }
}

const authService = new AuthService();
export default authService