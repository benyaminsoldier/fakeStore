export function sendHttpRequest (method, url){
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest()
        xhr.open(method, url, true)
        xhr.responseType = 'json'
        xhr.onload = ()=>{
            if(xhr.status >= 300) {
                reject('Error obtaining data...')
                return
            }
            resolve(xhr.response)
        }
        xhr.send()
    })
}