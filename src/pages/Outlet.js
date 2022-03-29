import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, formatNumber, authorization } from "../config.js";

class Outlet extends React.Component {
    constructor() {
        super()
        this.state = {
            action: "",
            id_outlet: "",
            nama_outlet: "",
            alamat: "",
            user: "",
            visible: "",
            outlet: []
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    tambahData() {
        this.modalOutlet = new Modal(document.getElementById("modal_outlet"))
        this.modalOutlet.show() // menampilkan modal

        // reset state untuk form outlet
        this.setState({
            action: "tambah",
            id_outlet: Math.random(1, 1000),
            nama_outlet: "",
            alamat: ""
        })
    }

    ubahData(id_outlet) {
        this.modalOutlet = new Modal(document.getElementById("modal_outlet"))
        this.modalOutlet.show() // menampilkan modal

        // mencari index posisi dari data outlet yang akan diubah
        let index = this.state.outlet.findIndex(
            outlet => outlet.id_outlet === id_outlet
        )

        this.setState({
            action: "ubah",
            id_outlet: id_outlet,
            nama_outlet: this.state.outlet[index].nama_outlet,
            alamat: this.state.outlet[index].alamat
        })

    }

    hapusData(id_outlet) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            let endpoint = `${baseUrl}/outlet/` + id_outlet

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // mencari posisi index dari data yang akan dihapus
            // let temp = this.state.outlet
            // let index = temp.findIndex(outlet => outlet.id_outlet === id_outlet)

            // menghapus data pada array
            // temp.splice(index,1)

            // this.setState({outlet: temp})
        }
    }

    simpanData(event) {
        event.preventDefault();
        // preventDefault -> mencegah aksi default dari form submit

        // cek aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/outlet`
            // menampung data isian dalam user
            let data = {
                id_outlet: this.state.id_outlet,
                nama_outlet: this.state.nama_outlet,
                alamat: this.state.alamat
            }

            // tambahkan ke state array outlet
            // let temp = this.state.outlet
            // temp.push(data) // menambah data pada array
            // this.setState({ outlet: temp })
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // menghilangkan modal
            this.modalOutlet.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/outlet/` + this.state.id_outlet

            let data = {
                id_outlet: this.state.id_outlet,
                nama_outlet: this.state.nama_outlet,
                alamat: this.state.alamat
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.outlet
            // let index = temp.findIndex(
            //     outlet => outlet.id_outlet === this.state.id_outlet
            // )

            // temp[index].nama = this.state.nama
            // temp[index].alamat = this.state.alamat
            // temp[index].jenis_kelamin = this.state.jenis_kelamin
            // temp[index].telepon = this.state.telepon

            // this.setState({outlet: temp})

            this.modalOutlet.hide()
        }
    }

    getData() {
        let endpoint = `${baseUrl}/outlet`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ outlet: response.data })
            })
            .catch(error => console.log(error))
    }


    componentDidMount() {
        // fungsi ini dijalankan setelah fungsi render berjalan
        this.getData()
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
                                List of outlet
                            </h3>
                        </div>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.outlet.map(outlet => (
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <small className="text-info">Nama Outlet</small> <br />
                                            <h5>{outlet.nama_outlet}</h5>
                                        </div>
                                        <div className="col-lg-5">
                                            <small className="text-info">Alamat Outlet <br /></small>
                                            <h5>{outlet.alamat}</h5>
                                        </div>
                                        <div className="col-lg-2">
                                            <small className={`text-info ${this.state.visible ? `` : `d-none`}`}>Action <br /></small>
                                            <button className={`btn btn-warning btn-sm mx-1 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(outlet.id_outlet)}>
                                                Edit
                                            </button>

                                            <button className={`btn btn-danger btn-sm ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(outlet.id_outlet)}>
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
                    <div className="modal" id="modal_outlet">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-secondary">
                                    <h4 className="text-title">
                                        Form Data outlet
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        Nama Outlet
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.nama_outlet}
                                            onChange={(ev) => this.setState({ nama_outlet: ev.target.value })} />


                                        Alamat Outlet
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.alamat}
                                            onChange={(ev) => this.setState({ alamat: ev.target.value })} />


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
export default Outlet