async function login(e){
    e.preventDefault();
    let obj = {
        Email:e.target.Email.value,
        Password:e.target.Password.value
    }
    try{
        let res = await axios.post('/user/login',obj)
        let msg=document.getElementById('alert');
        msg.style="color: green;";
        msg.innerHTML=res.data.message;
        setTimeout(() => msg.innerHTML='', 2000);
    }catch(err){
        let msg=document.getElementById('alert');
        msg.style="color: red;";
        msg.innerHTML=err.response.data.message;
        setTimeout(() => msg.innerHTML='', 2000);
    }
}