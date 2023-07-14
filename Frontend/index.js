const baseURL = 'https://zany-teal-brown-bear-belt.cyclic.app'
var register_form = document.querySelector('#register>form')
var update_form = document.querySelector('#updates>form')
var login_form = document.querySelector('#login>form');
var total;
var itemPerRow;
var end;
var start;
render();
async function render() {
    try {
        let data = await fetch(`${baseURL}/api/user`);
        data = await data.json();
        total = data.length;
        document.querySelector('#total').innerText = total
        data = await fetch(`${baseURL}/api/pages?page=1&limit=5`);
        data = await data.json();
        itemPerRow = 5
        render_data(data)
    } catch (err) {

        (err)
    }
};
async function limits() {
    itemPerRow = document.querySelector("#itemPerRow").value;

    document.querySelector('#end').innerText = +itemPerRow > +total ? total : itemPerRow;
    let data = await fetch(`${baseURL}/api/pages?page=1&limit=${itemPerRow}`);
    data = await data.json();
    render_data(data)
}
async function pageDec() {
    end = document.querySelector('#end').innerText;
    start = document.querySelector('#start').innerText;
    if (start > itemPerRow) {
        start = Number(start) - itemPerRow;
        end = Number(end) - itemPerRow
        let data = await fetch(`${baseURL}/api/startend?start=${start}&end=${end}`);
        data = await data.json();
        render_data(data)
        document.querySelector('#start').innerText = start;
        document.querySelector('#end').innerText = end
    }
}
async function pageInc() {
    end = document.querySelector('#end').innerText;
    start = document.querySelector('#start').innerText;
    if (total - end >= itemPerRow) {
        start = Number(start) + itemPerRow;
        end = Number(end) + itemPerRow
        let data = await fetch(`${baseURL}/api/startend?start=${start}&end=${end}`);
        data = await data.json();
        render_data(data)
        document.querySelector('#start').innerText = start;
        document.querySelector('#end').innerText = end
    }
};
async function itemDec() {
    end = document.querySelector('#end').innerText;
    start = document.querySelector('#start').innerText;
    if (start > 1) {
        start = Number(start) - 1;
        end = Number(end) - 1
        let data = await fetch(`${baseURL}/api/startend?start=${start}&end=${end}`);
        data = await data.json();
        render_data(data)
        document.querySelector('#start').innerText = start;
        document.querySelector('#end').innerText = end
    }
}
async function itemInc() {
    end = document.querySelector('#end').innerText;
    start = document.querySelector('#start').innerText;
    if (end < total) {
        start = Number(start) + 1;
        end = Number(end) + 1
        let data = await fetch(`${baseURL}/api/startend?start=${start}&end=${end}`);
        data = await data.json();
        render_data(data)
        document.querySelector('#start').innerText = start;
        document.querySelector('#end').innerText = end
    }
}



async function render_data(arr) {
    let tbody = document.querySelector("#tbody");
    tbody.innerHTML = arr.map((item) => {
        return `<tr>
    <td>${item._id}</td>
    <td>${item.fullname}</td>
    <td>${item.address}</td>
    <td>${item.email}</td>
    <td>${item.mobileno}</td>
    <td>${item.gender}</td>
    <td>${item.city}</td>
    <td><div id="action"><i class="fa-solid fa-pen-to-square" data=${item._id} onClick="updates(event)"></i><i data=${item._id} class="fa-solid fa-trash-can" onClick="deletes(event)"></i> </div></td>
</tr>`
    }).join("")
};

function newuser() {
    document.querySelector('#container').style.filter = 'blur(5px)'
    document.getElementById('register').style.display = "flex"
    register_form.addEventListener('submit', async (event) => {
        event.preventDefault()
        let fullname = document.querySelector('#fullname').value
        let address = document.querySelector('#address').value
        let email = document.querySelector('#email').value
        let mobileno = document.querySelector('#mobileno').value
        let gender = document.querySelector('input[name="gender"]:checked')
        let city = document.querySelector('#city').value
        let password = document.querySelector('#password').value
        let condition = document.querySelector('#myCheckbox').checked
        if (!gender) {
            swal({
                title: "Error!",
                text: "please select gender",
                type: "error",
                confirmButtonText: "OK"
            });
        } else {
            if (city == "-Select-") {
                swal({
                    title: "Error!",
                    text: "Please Select City",
                    type: "error",
                    confirmButtonText: "OK"
                });

            } else {
                if (condition) {
                    gender = gender.value
                    let payload = { fullname, address, email, mobileno, gender, city, password };
                    await fetch(`${baseURL}/api/user`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    }).then(response => {
                        return response.json()
                    }).then((res) => {
                        if (res.msg == "User Exist") {
                            swal({
                                title: "Email already exist",
                                text: "try another email",
                                type: "error",
                            });
                        } else {
                            swal({
                                title: "User register successful✅",
                                text: "welcome",

                            });
                            setTimeout(()=>{
                                setTimeout(()=>{
                                    window.location.reload()
                                },1000)
                                
                            },1000)
                        }

                    })
                        .catch(error => {
                            swal({
                                title: `Something Went wrong`,
                                text: "error",
                                type: "error",
                                confirmButtonText: "OK"
                            });

                        });
                } else {
                    swal({
                        title: `Please aggree term and condition`,
                        text: "error",
                        type: "error",
                        confirmButtonText: "OK"
                    });
                }
            }
        }

    });
};


function toogle1() {
    document.getElementById('register').style.display = "none"
    document.querySelector('#container').style.filter = 'blur(0px)'
}
function toogle3() {
    document.getElementById('updates').style.display = "none"
    document.querySelector('#container').style.filter = 'blur(0px)'
}
function toogle2() {
    document.getElementById('login').style.display = "none"
    document.querySelector('#container').style.filter = 'blur(0px)'
}
function resetForm() {
    document.getElementById("myForm").reset();
    document.getElementById("update_form").reset();
}
async function updates(event) {
    let id = event.target.attributes[1].nodeValue;
    if( localStorage.getItem('token')==null || !localStorage.getItem('token')){
        swal({
            title: "Login Again",
            text: "Authentication error",
            type: "error",
        });
        login()
        return
    }
    document.querySelector('#container').style.filter = 'blur(5px)'
    document.getElementById('updates').style.display = "flex"
    update_form.addEventListener('submit', async (event) => {
        event.preventDefault()
        let fullname = document.querySelector('#update_fullname').value
        let address = document.querySelector('#update_address').value
        let email = document.querySelector('#update_email').value
        let mobileno = document.querySelector('#update_mobileno').value
        let gender = document.querySelector('input[name="gender"]:checked')
        let city = document.querySelector('#update_city').value
        let password = document.querySelector('#update_password').value
        let condition = document.querySelector('#update_myCheckbox').checked
        if (!gender) {
            swal({
                title: "Error!",
                text: "please select gender",
                type: "error",
                confirmButtonText: "OK"
            });
        } else {
            if (city == "-Select-") {
                swal({
                    title: "Error!",
                    text: "Please Select City",
                    type: "error",
                    confirmButtonText: "OK"
                });

            } else {
                if (condition) {
                    gender = gender.value
                    let payload = { fullname, address, email, mobileno, gender, city, password };
                    await fetch(`${baseURL}/api/user/${id}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                            "token": `${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(payload)
                    }).then(response => {
                        return response.json()
                    }).then((res) => {
                        if (res.msg == "Login Again") {
                            swal({
                                title: "Login Again",
                                text: "Authentication error",
                                type: "error",
                            });
                            login()
                        } else {
                            swal({
                                title: "User Update successful✅",
                                text: "welcome",
                            });
                            setTimeout(()=>{
                                setTimeout(()=>{
                                    window.location.reload()
                                },1000)
                                
                            },1000)
                        }
                    })
                        .catch(error => {

                            swal({
                                title: `Something Went wrong`,
                                text: "error",
                                type: "error",
                                confirmButtonText: "OK"
                            });
                        });
                } else {
                    swal({
                        title: `Please aggree term and condition`,
                        text: "error",
                        type: "error",
                        confirmButtonText: "OK"
                    });
                }
            }
        }

    });

}
async function deletes(event) {

    let id = event.target.attributes[0].nodeValue;
    await fetch(`${baseURL}/api/user/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            "token": `${localStorage.getItem("token")}`
        },
    }).then(response => {
        return response.json();
    }).then((res) => {
        if (res.error) {
            login()
        } else if (res._id == id) {
            swal({
                title: `user Deleted`,
                text: "User removed",
                type: "error",
                confirmButtonText: "OK"
            });
            setTimeout(()=>{
                setTimeout(()=>{
                    window.location.reload()
                },1000)
                
            },1000)
        }
        

    })
        .catch(error => {
            swal({
                title: `Something Went wrong`,
                text: "error",
                type: "error",
                confirmButtonText: "OK"
            });
        });

};

async function login() {
    document.getElementById('login').style.display = "flex"
    document.querySelector('#container').style.filter = 'blur(8px)';

}
login_form.addEventListener('submit', async (event) => {
    event.preventDefault()
    let email = document.querySelector("#login_email").value;
    let password = document.querySelector("#login_password").value;
    let payload = { email, password }
    await fetch(`${baseURL}/api/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "token": `${localStorage.getItem("token")}`,

        },
        body: JSON.stringify(payload),
    }).then(response => {
        return response.json();

    }).then((res) => {
        if (res.msg == "LOGGIN SUCCESSFUL") {
            localStorage.setItem('token', res.token);
            swal({
                title: `Login Successful`,
                text: "Welcome",
                confirmButtonText: "OK"
            });
            setTimeout(()=>{
                setTimeout(()=>{
                    window.location.reload()
                },1000)
                
            },1000)

        } else {
            swal({
                title: `Please enter valid details`,
                text: "error",
                type: "error",
                confirmButtonText: "OK"
            });
        }
    })
        .catch(error => {
            swal({
                title: `Something Went wrong`,
                text: "check It",
                type: "error",
                confirmButtonText: "OK"
            });
        
        });

});

document.querySelector('.search-input').addEventListener('input', async () => {
    let input = document.querySelector('.search-input').value;
    let data = await fetch(`${baseURL}/api/user`);
    data = await data.json();
    data = data.filter((item) => {
        return item.fullname.includes(input.toLowerCase()) || item.address.includes(input.toLowerCase()) || item.city.includes(input.toLowerCase())
    });
    render_data(data)
});
function overid(event) {
    let id = event
    document.querySelector(`#${id}`).innerHTML = `${id} <i style="color: grey;" class="fa-solid fa-down-long"></i>`
};
async function toogleid(event) {
    let id = event
    let data = await fetch(`${baseURL}/api/user`);
    data = await data.json();
    if (document.querySelector(`#${id}`).innerHTML == `${id} <i style="color: grey;" class="fa-solid fa-down-long"></i>`) {
        document.querySelector(`#${id}`).innerHTML = `${id} <i style="color: grey;" class="fa-solid fa-up-long"></i>`
        if (id == "Id") {
            id = "_id"
        } else if (id == "Name") {
            id = "fullname"
        } else if (id == "Mobile") {
            id = "Mobileno"
        }
        id = id.toLowerCase();
        data.sort((a, b) => {

            return a[id].localeCompare(b[id])


        });
        render_data(data)
    } else {
        document.querySelector(`#${id}`).innerHTML = `${id} <i style="color: grey;" class="fa-solid fa-down-long"></i>`
        if (id == "Id") {
            id = "_id"
        } else if (id == "Name") {
            id = "fullname"
        } else if (id == "Mobile") {
            id = "Mobileno"
        }
        id = id.toLowerCase();
        data.sort((a, b) => {

            return b[id].localeCompare(a[id])


        });

        render_data(data)
    }
};
function leaveid(event) {
    let id = event
    document.querySelector(`#${id}`).innerHTML = `${id}`
};
