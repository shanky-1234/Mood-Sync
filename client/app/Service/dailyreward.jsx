const { default: api } = require("./api")

const dailyRewardSystem = {
    getTodayReward:async()=>{
        try {
            const response = await api.get('/rewards/getTodayReward')
            return response.data
        } catch (error) {
            console.error(error)
        const errorMessage = error.response?.data?.message || 'Failed to get Rewards';
      throw new Error(errorMessage);
        }
    }
}

export default dailyRewardSystem