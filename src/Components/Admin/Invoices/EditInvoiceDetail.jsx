import { Link } from 'react-router-dom';
import Tittle from '../../Fragments/Tittle';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getInvoice } from '../../../Services/InvoiceService';


export default function EditInvoiceDetail() {

  const { id } = useParams();
  
  const [invoice, setInvoice] = useState("");

  useEffect ( () => {
    fetchInvoice();
  }, [])
  
  const fetchInvoice = async () => {
    await getInvoice(id)
      .then((res) => {
       
      setInvoice(res.data);
    })
  }
    return (
        <>
            <Tittle tittle="Chi tiết đơn hàng" />
            <div className="mt-5 bg-white p-5 shadow border">
                <div class="col-12 mt-3 mb-3 d-flex justify-content-between align-items-center">
                    
            
                </div>
            </div>
        </>
    );
}
