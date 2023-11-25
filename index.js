
fetch("http://localhost:3031/v1/token", {
    method : "POST",
    mode : "cors",
    headers: {
        'Content-Type': 'application/json' // JSON形式のデータのヘッダー
    },
    body : JSON.stringify({
        token : "Bearer eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MDA5MTIzNzB9"
    })
})
.catch((err) => console.log(err))
.then((respose) => respose.text())
.then((body) => {
    console.log(body)
})