import { apiPrivate } from "../Ultils/AxiosCustomize"

export const updateQuantity = async (id, quantity) => {
  return await apiPrivate.put('invoicesDetail/' + id + '/changeQuantity',null, {
      params: {
          quantity: quantity,
      },
  });
  
}

export const deleteInvoiceDetail = async (id) => {
    return await apiPrivate.delete('invoicesDetail/' + id);
};