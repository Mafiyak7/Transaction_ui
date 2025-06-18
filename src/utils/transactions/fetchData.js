import axiosInstance from '../axios'

export async function fetchData({
  pagination,sorting
}) {
    const res = await axiosInstance.get("transaction",{params:{pageNumber:pagination.pageIndex,sort: sorting[0]?.desc ? "des" : "asc" }});
    return {transactions:res.data.transactions,totalCount:res.data.totalCount}
    
  }