import { apiPublic } from "../Ultils/AxiosCustomize"

export const getAllStores = () => {
    return apiPublic.get("/stores")
}