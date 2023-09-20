async function resetPassword(e){
    e.preventDefault();
    const email = e.target.email.value;
    try{
        let res = await axios.post('http://localhost:5000/password/resetPassword',{email:email})
        document.getElementById('msg').innerHTML='Password reset link sent to your registered Email id'
    }
    catch(err){
        console.log(err)
        document.getElementById('msg').innerHTML='Something Wrong, Try Again';
    }
}