export default function  getCurrentDate(){
    const date = new Date()
    const day= date.getDate()
    const month = date.toLocaleString("en-US",{month:'long'})
    const year = date.getFullYear()

    return `${day} ${month} ${year}`
}