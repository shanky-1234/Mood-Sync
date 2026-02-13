
import api from "./api";

const jounralService = {
    getJournalById:async(journalId) =>{
        try {
            const response = await api.get(`journal/getJournalById/${journalId}`)
            console.log(response.data)
            return response.data
        } catch (error) {
              console.error('Getting Journal Error:', error);
      const errorMessage = error.response?.data?.message || 'Cannot Get the Journal';
      throw new Error(errorMessage);
        }
    },
    getJournalofUser:async()=>{
        try {
            const response = await api.get('journal/getAllJournal')
            console.log(response.data)
            return response.data
        } catch (error) {
              console.error('Getting Journal Error:', error);
      const errorMessage = error.response?.data?.message || 'Cannot Get the Journal';
      throw new Error(errorMessage);
        }
    },

    createJournal:async (title, color) =>{
        try {
            const response = await api.post('journal/createJournal',{title,content:'',color,status:'draft'})
            console.log(response.data)
            return response.data
        } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Failed Creating Journal';
      throw new Error(errorMessage);
        }
    },
    updateJournal:async(journalId,data) =>{
        try {
            const response = await api.put(`journal/updateJournal/${journalId}`,data)
            return response.data
        } catch (error) {
            console.error(error)
             const errorMessage = error.response?.data?.message || 'Failed Updating Journal';
      throw new Error(errorMessage);
        }
    },
    deleteJournal:async(id)=>{
        try {
            const response = await api.delete(`journal/deleteJournal/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
             const errorMessage = error.response?.data?.message || 'Failed Updating Journal';
      throw new Error(errorMessage);
        }
    },
    getTodayJournal:async()=>{
        try {
             const response = await api.delete(`journal/getTodayJournal`)
            return response.data
        } catch (error) {
            console.error(error)
             const errorMessage = error.response?.data?.message || 'Failed Updating Journal';
      throw new Error(errorMessage);
        }
    },
    analyzeJournal:async(id)=>{
        try{
            const response = await api.post(`journal/analyseJournal/${id}`)
            return response.data
        }
        catch(error){
            console.error(error)
             const errorMessage = error.response?.data?.message || 'Failed Updating AI';
      throw new Error(errorMessage);
        }
    },
    uploadPhoto:async(id,formData)=>{
        try {
            const response = await api.put(`journal/${id}/photos`,formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            return response.data
        } catch (error) {
             console.error(error)
             const errorMessage = error.response?.data?.message || 'Failed Uploading Pictures';
      throw new Error(errorMessage);
        }
    },
    deletePhotos:async(id,photoId)=>{
        try {
            const response = await api.delete(`journal/${id}/photos/${photoId}`)
            return response.data;
        } catch (error) {
              console.error(error)
             const errorMessage = error.response?.data?.message || 'Failed Deleting Photo';
      throw new Error(errorMessage);
        }
    }

    
}

export default jounralService