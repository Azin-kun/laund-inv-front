import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, formatNumber, authorization } from "../config.js";

class Paket extends React.Component {
    constructor() {
        super()
        this.state = {
            action: "",
            id_paket: "",
            jenis_paket: "",
            harga: "",
            user: "",
            visible: "",
            pakets: []
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    tambahData() {
        this.modalPaket = new Modal(document.getElementById("modal_paket"))
        this.modalPaket.show() // menampilkan modal

        // reset state untuk form paket
        this.setState({
            action: "tambah",
            id_paket: Math.random(1, 1000),
            jenis_paket: "",
            harga: ""
        })
    }

    ubahData(id_paket) {
        this.modalPaket = new Modal(document.getElementById("modal_paket"))
        this.modalPaket.show() // menampilkan modal

        // mencari index posisi dari data paket yang akan diubah
        let index = this.state.pakets.findIndex(
            paket => paket.id_paket === id_paket
        )

        this.setState({
            action: "ubah",
            id_paket: id_paket,
            jenis_paket: this.state.pakets[index].jenis_paket,
            harga: this.state.pakets[index].harga
        })

    }

    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            let endpoint = `${baseUrl}/paket/` + id_paket

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // mencari posisi index dari data yang akan dihapus
            // let temp = this.state.pakets
            // let index = temp.findIndex(paket => paket.id_paket === id_paket)

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
            let endpoint = `${baseUrl}/paket`
            // menampung data isian dalam user
            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
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
            this.modalPaket.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/paket/` + this.state.id_paket

            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.pakets
            // let index = temp.findIndex(
            //     paket => paket.id_paket === this.state.id_paket
            // )

            // temp[index].nama = this.state.nama
            // temp[index].alamat = this.state.alamat
            // temp[index].jenis_kelamin = this.state.jenis_kelamin
            // temp[index].telepon = this.state.telepon

            // this.setState({pakets: temp})

            this.modalPaket.hide()
        }
    }

    getData() {
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ pakets: response.data })
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
                                List of paket
                            </h3>
                        </div>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.pakets.map(paket => (
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <small className="text-info">Jenis Paket</small> <br />
                                            <h5>{paket.jenis_paket}</h5>
                                        </div>
                                        <div className="col-lg-5">
                                            <small className="text-info">Harga <br /></small>
                                            <h5>{formatNumber(paket.harga)}</h5>
                                        </div>
                                        <div className="col-lg-2">
                                            <small className={`text-info ${this.state.visible ? `` : `d-none`}`}>Action <br /></small>
                                            <button className={`btn btn-warning btn-sm mx-1 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(paket.id_paket)}>
                                                Edit
                                            </button>

                                            <button className={`btn btn-danger btn-sm ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(paket.id_paket)}>
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
                    <div className="modal" id="modal_paket">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-secondary">
                                    <h4 className="text-title">
                                        Form Data paket
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        Jenis Paket
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.jenis_paket}
                                            onChange={(ev) => this.setState({ jenis_paket: ev.target.value })} />


                                        Harga
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.harga}
                                            onChange={(ev) => this.setState({ harga: ev.target.value })} />


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
export default Paket