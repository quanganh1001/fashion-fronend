import { apiPrivate } from "../Ultils/AxiosCustomize"

export const updateQuantity =  (id, quantity) => {
  return  apiPrivate.put('invoicesDetail/' + id + '/changeQuantity',null, {
      params: {
          quantity: quantity,
      },
  });
  
}

export const deleteInvoiceDetail =  (id) => {
    return  apiPrivate.delete('invoicesDetail/' + id);
};