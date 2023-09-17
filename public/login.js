async function login(e){
    e.preventDefault();
    let obj = {
        Email:e.target.Email.value,
        Password:e.target.Password.value
    }
    try{
        let res = await axios.post('/user/login',obj)
        let msg=document.getElementById('alert');
        if(res.status===201){
            msg.style="color: green;";
            msg.innerHTML=res.data;
            setTimeout(() => msg.innerHTML='', 2000);
        }else{
            msg.style="color: red;";
            msg.innerHTML=res.data;
            setTimeout(() => msg.innerHTML='', 2000);
        }
    }catch(err){
        console.log(err)
    }
}