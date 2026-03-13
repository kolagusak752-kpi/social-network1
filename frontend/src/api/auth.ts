interface Auth{
    email:string,
    password:string
}

export async function login(data:Auth) {
    const response = await fetch(`http://localhost:4200/auth/login`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
    return await response.json()
}
export  async function register(data:Auth) {
    const response= await fetch(`http://localhost:4200/auth/register`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
    return await response.json()
}