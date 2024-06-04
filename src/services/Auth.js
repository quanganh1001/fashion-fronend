import axiosInstance from "../ultils/axiosCustomize"

const postLogin = (username, password) => {
    return axiosInstance.post("login", {username,password})
}

export {postLogin} ; 