import { apiPrivate } from "../Ultils/AxiosCustomize"

export const updateQuantity = async (id, quantity) => {
  return await apiPrivate.put('invoicesDetail/' + id + '/changeQuantity',null, {
      params: {
          quantity: quantity,
      },
  });
  
}