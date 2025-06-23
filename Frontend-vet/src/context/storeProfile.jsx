import { create } from "zustand"
import axios from "axios"

const getAuthHeaders = () => {
    const storeUser = JSON.parse(localStorage.getItem("auth-token"))
    return {
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${storeUser.state.token}`
        }
    }
}


const storProfile = create(set => ({
    user: null,
    clearUser: () => set({ user: null }),

    profile: async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/perfil`
            const respuesta = await axios.get(url,getAuthHeaders())
            set({ user: respuesta.data })
            console.log(respuesta.data)
        } catch (error) {
            console.log(error)
        }
    }
}))

export default storProfile
    