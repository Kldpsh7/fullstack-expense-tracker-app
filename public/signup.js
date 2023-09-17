function signup(e){
    e.preventDefault();
    let obj={
        Name:e.target.Name.value,
        Email:e.target.Email.value,
        Password:e.target.Password.value
    }
    axios.post('/user/signup',obj)
    .then(res=>{
        let showMsg = document.getElementById('status');
        console.log(res.status)
        if(res.status===201){
            showMsg.style="color:green"
            showMsg.innerHTML=res.data;
            setTimeout(() => window.location.href='/user/login', 1000);
        }else{
            showMsg.style="color:red"
            showMsg.innerHTML=res.data;
            setTimeout(() => showMsg.innerHTML='', 3000);
        }
    }).catch(err=>console.log(err))
}