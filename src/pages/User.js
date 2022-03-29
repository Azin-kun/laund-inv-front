import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config.js";

class User extends React.Component {
    constructor() {
        super()
        this.state = {
            id_user: "",
            nama: "",
            username: "",
            password: "",
            id_outlet: "",
            role: "",
            user: "",
            visible: "",
            users: [],
            outlets: [],
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    tambahData() {
        this.modalUser = new Modal(document.getElementById("modal_user"))
        this.modalUser.show() // menampilkan modal

        // reset state untuk form user
        this.setState({
            action: "tambah",
            id_user: Math.random(1, 1000),
            nama: "",
            id_outlet: "",
            username: "",
            password: "",
            role: "Admin"
        })
    }

    ubahData(id_user) {
        this.modalUser = new Modal(document.getElementById("modal_user"))
        this.modalUser.show() // menampilkan modal

        // mencari index posisi dari data user yang akan diubah
        let index = this.state.users.findIndex(
            user => user.id_user === id_user
        )

        this.setState({
            action: "ubah",
            id_user: id_user,
            nama: this.state.users[index].nama,
            id_outlet: this.state.users[index].id_outlet,
            username: this.state.users[index].username,
            password: this.state.users[index].password,
            role: this.state.users[index].role
        })

    }

    hapusData(id_user) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            let endpoint = `${baseUrl}/users/` + id_user

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // mencari posisi index dari data yang akan dihapus
            // let temp = this.state.pakets
            // let index = temp.findIndex(user => user.id_paket === id_paket)

            // menghapus data pada array
            // temp.splice(index,1)

            // this.setState({pakets: temp})
        }
    }

    simpanData(event) {
        event.preventDefault();
        // preventDefault -> mencegah aksi default dari form submit

        // cek aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/users`
            // menampung data isian dalam user
            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                id_outlet: this.state.id_outlet,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }

            // tambahkan ke state array pakets
            // let temp = this.state.pakets
            // temp.push(data) // menambah data pada array
            // this.setState({ pakets: temp })
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // menghilangkan modal
            this.modalUser.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/users/` + this.state.id_user

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                id_outlet: this.state.id_outlet,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role

            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.pakets
            // let index = temp.findIndex(
            //     user => user.id_paket === this.state.id_paket
            // )

            // temp[index].nama = this.state.nama
            // temp[index].alamat = this.state.alamat
            // temp[index].jenis_kelamin = this.state.jenis_kelamin
            // temp[index].telepon = this.state.telepon

            // this.setState({pakets: temp})

            this.modalUser.hide()
        }
    }

    getData() {
        let endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ users: response.data })
            })
            .catch(error => console.log(error))
    }

    getOutlet() {
		let endpoint = `${baseUrl}/outlet`
		axios.get(endpoint, authorization)
			.then(response => {
				this.setState({ outlets: response.data })
			})
			.catch(error => console.log(error))
	}

    componentDidMount() {
        // fungsi ini dijalankan setelah fungsi render berjalan
        this.getData()
        this.getOutlet()
        let user = JSON.parse(localStorage.getItem("user"))

        // cara kedua
        if (user.role === 'Admin') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <div className="card-header bg-secondary">
                            <h3 className="text-white">
                                List of User
                            </h3>
                        </div>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.users.map(user => (
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-2">
                                            <small className="text-info"> Nama </small> <br />
                                            <h5>{user.nama}</h5>
                                        </div>
                                        <div className="col-lg-2">
                                            <small className="text-info"> Outlet </small> <br />
                                            <h5>{user.outlet.nama_outlet}</h5>
                                        </div>
                                        <div className="col-lg-2">
                                            <small className="text-info"> Username <br /></small>
                                            <h5>{user.username}</h5>
                                        </div>
                                        <div className="col-lg-3">
                                            <small className="text-info"> Role <br /></small>
                                            <h5>{user.role}</h5>
                                        </div>
                                        <div className="col-lg-3">
                                            <small className={`text-info ${this.state.visible ? `` : `d-none`}`}>Action <br /></small>
                                            <button className={`btn btn-warning btn-sm mx-1 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(user.id_user)}>
                                                Edit
                                            </button>

                                            <button className={`btn btn-danger btn-sm ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(user.id_user)}>
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className={`btn btn-outline-success my-2 ${this.state.visible ? `` : `d-none`}`}
                            onClick={() => this.tambahData()}>
                            Tambah Data
                        </button>
                    </div>
                    <div className="modal" id="modal_user">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-secondary">
                                    <h4 className="text-title">
                                        Form Data User
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        Nama
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.nama}
                                            onChange={(ev) => this.setState({ nama: ev.target.value })} />

                                        Outlet
                                        <select className="form-control mb-2"
                                            value={this.state.id_outlet}
                                            onChange={e => this.setState({ id_outlet: e.target.value })}>
                                            <option value="">--Pilih Outlet--</option>
                                            {this.state.outlets.map(outlet => (
                                                <option value={outlet.id_outlet}>
                                                    {outlet.nama_outlet}
                                                </option>
                                            ))}
                                        </select>


                                        Username
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.username}
                                            onChange={(ev) => this.setState({ username: ev.target.value })} />

                                        Password
                                        <input type="password" className="form-control mb-2"
                                            value={this.state.password}
                                            onChange={(ev) => this.setState({ password: ev.target.value })} />

                                        Role
                                        <select className="form-control mb-2"
                                            value={this.state.role}
                                            onChange={(ev) => this.setState({ role: ev.target.value })}>
                                            <option value="Kasir">Kasir</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Owner">Owner</option>
                                        </select>


                                        <button className="btn btn-success" type="submit">Simpan</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default User