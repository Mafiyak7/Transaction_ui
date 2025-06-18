import axiosInstance from '../axios'

export async function fetchInstallments({
    transactionId,
  }) {
    const res = await axiosInstance.get(`transaction/${transactionId}`);
    return res.data
    
  }