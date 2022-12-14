const loadInitialTemplate = () => {
    const template = `
    <div style="border: 2px solid black;  width: 30%; padding: 10px; background-color: aquamarine;">
        <h1>Animales</h1>
        <form id="animal-form">
          <div>
              <label>Nombre</label>
              <input style="margin-left:10px" name="name" /> 
          </div>
          <br>
          <div>
              <label>Tipo</label>
              <input style="margin-left:32px" name="type" /> 
          </div>
          <button type="submit" style="padding: 10px; margin-top: 30px; margin-bottom: 30px">Guardar</button>
          <a href="#" id="login"></a>
        </form>
        <ul id="animal-list"></ul>
  `
  const body = document.getElementsByTagName("body")[0]
  body.innerHTML = template
}   

const getAnimals = async () => {
    const response = await fetch("/animals", {
        headers: {
            Authorization: localStorage.getItem("jwt")
        }
    })
    const animals = await response.json()
    const template = animal => `
        <li>
            ${animal.name} ${animal.type} <button data-id="${animal._id}">Eliminar</button>
        </li>
    `

    const animalList = document.getElementById("animal-list")
    animalList.innerHTML = animals.map(animal => template(animal)).join("")
    animals.forEach(animal => {
        animalNode = document.querySelector(`[data-id="${animal._id}"]`)
        animalNode.onclick = async e => {
            await fetch(`/animals/${animal._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem("jwt")
                }
            })
            animalNode.parentNode.remove()
            alert("Eliminado con exito")
        }   
    })
}
const addFormListener = () => {
    const animalForm = document.getElementById("animal-form")
    animalForm.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(animalForm)
        const data = Object.fromEntries(formData.entries())
        await fetch("/animals", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt")
            }
        })
        animalForm.reset()
        getAnimals()
    }
}

const checkLogin = () =>
    localStorage.getItem("jwt")

const animalsPage = () => {
    loadInitialTemplate()
    addFormListener()
    getAnimals()
}




const loadRegisterTemplate = () => {
    const template = `
    <div style="border: 2px solid black;  width: 30%; padding: 10px; background-color: aquamarine;">
        <h1>Register</h1>
        <form id="register-form">
          <div>
              <label>Correo</label>
              <input style="margin-left:28px" name="email" /> 
          </div>
          <br>
          <div>
              <label>Contrase??a</label>
              <input name="password" /> 
          </div>
          <button type="submit" style="padding: 10px; margin-top: 30px; margin-bottom: 30px">Enviar</button>
        </form>
        <a href="#" id="login">Iniciar Sesion</a>
        <div id="error"></div>
    </div>
    `

    const body = document.getElementsByTagName("body")[0]
    body.innerHTML = template
}


const addRegisterListener = () => {
        const registerForm = document.getElementById("register-form")
        registerForm.onsubmit = async (e) => {
            e.preventDefault()
            const formData = new FormData(registerForm)
            const data = Object.fromEntries(formData.entries())
    
            const response = await fetch("/register", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const responseData = await response.text()
            if (response.status >= 300) {
                const errorNode = document.getElementById("error")
                errorNode.innerHTML = responseData
            } else {
                localStorage.setItem("jwt", `Bearer ${responseData}`)
                animalsPage()
            }
        }
    }
const gotoLoginListener = () => {
        const gotoLogin = document.getElementById("login")
        gotoLogin.onclick = (e) => {
            e.preventDefault()
            loginPage()
        }
    }



const registerPage = () => {
    console.log("Pagina de Registro")
    loadRegisterTemplate()
    addRegisterListener()
    gotoLoginListener()
}

const loginPage = () => {
    loadLoginTemplate()
    addLoginListener()
    gotoRegisterListener()
}

const loadLoginTemplate = () => {
        const template = `
        <div style="border: 2px solid black;  width: 30%; padding: 10px; background-color: aquamarine;">
            <h1>Login</h1>
            <form id="login-form">
              <div>
                  <label>Correo</label>
                  <input style="margin-left:28px" name="email" /> 
              </div>
              <br>
              <div>
                  <label>Contrase??a</label>
                  <input  name="password" /> 
              </div>
              <button type="submit" style="padding: 10px; margin-top: 30px; margin-bottom: 30px" >Enviar</button>
            </form>
            <a href="#" id="register">Registrarse</a>
            <div id="error"></div>
        </div>
    `

    const body = document.getElementsByTagName("body")[0]
    body.innerHTML = template
}

const gotoRegisterListener = () => {
    const gotoRegister = document.getElementById("register")
    gotoRegister.onclick = (e) => {
        e.preventDefault()
        registerPage()
    }
}





const addLoginListener = () => {
    const loginForm = document.getElementById("login-form")
    loginForm.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(loginForm)
        const data = Object.fromEntries(formData.entries())

        const response = await fetch("/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        })
        const responseData = await response.text()
        if (response.status >= 300) {
            const errorNode = document.getElementById("error")
            errorNode.innerHTML = responseData
        } else {
            localStorage.setItem("jwt", `Bearer ${responseData}`)
            animalsPage()
        }
    }
}

window.onload = () => {
    const isloggedIn = checkLogin()
    if(isloggedIn) {
        animalsPage()
    } else {
        loginPage()
    } 
}