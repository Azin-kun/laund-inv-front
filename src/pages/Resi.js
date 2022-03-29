import React from "react"
import axios from "axios"
import { baseUrl, formatNumber, authorization } from "../config.js";
import domToPdf from "dom-to-pdf";
import logo from "../components/asset/logo.png"

export default class Print extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: [],
            detail_transaksi: [],
            paket: [],
            visible: "",
            user: "",
            resi: "",
            customer: "",
            resi: "",
            petugas: "",
            tgl: "",
            paket: "",
            dibayar: "",
            total: ""

        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    convertPdf() {
        // ambil element yang akan diconvert ke pdf
        let element = document.getElementById(`target`)
        let options = {
            filename: "resi.pdf"
        }

        domToPdf(element, options, () => {
            window.alert("file will download soon")
        })
    }

    getTransaksiPrint(ev) {
        ev.preventDefault()
        let endpoint = `${baseUrl}/transaksi/print`
        let newData = {
            resi: this.state.resi
        }
        axios
            .post(endpoint, newData, authorization)
            .then(response => {
                this.setState({
                    visible: true,
                    outlet: response.data.user.outlet.nama_outlet,
                    resi: response.data.resi,
                    customer: response.data.member.nama,
                    petugas: response.data.user.nama,
                    tgl: response.data.tgl,
                    paket: "",
                    dibayar: response.data.dibayar,
                })

                let dataTransaksi = response.data
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)

                        // tambahkan key total
                        dataTransaksi[i].total = total
                    }
                }
            })
            .catch(error => console.log(error))

    }

    convertTime = tgl => {
        let date = new Date(tgl)
        return `${date.getDate()}/${Number(date.getMonth()) + 1}/${date.getFullYear()}`
    }

    convertStatusBayar(dibayar) {
        if (dibayar === 0) {
            return (
                <div>
                    Belum Dibayar
                </div>
            )
        } else if (dibayar === 1) {
            return (
                <div>
                    Sudah Dibayar
                </div>
            )
        }
    }

    render() {
        const target = React.createRef()
        const optionPDF = {
            orientation: `potrait`,
            unit: `cm`,
            format: [12,8]
        }
        return (
            <div className="container">

                <form onSubmit={(ev) => this.getTransaksiPrint(ev)} className="form-inline">
                    <div className="form-group mx-sm-3 mb-2">
                        <label for="resi" className="sr-only">Resi</label>
                        <input className="form-control" id="resi" placeholder="nomer resi"
                            onChange={ev => this.setState({ resi: ev.target.value })} />
                    </div>
                    <button className="btn btn-primary mb-2"
                        type="submit">
                        input
                    </button>
                    <button className={`btn btn-success mb-2 ${this.state.visible ? `` : `d-none`}`}
                        onClick={() => this.convertPdf()}>
                        Print Resi
                    </button>
                </form>




                <div className={`print ${this.state.visible ? `` : `d-none`}`}>
                    <div ref={target} id="target">
                        <center><img src={logo} className="img-print" /></center><br />
                        <p><b>Info Pesanan</b></p><hr />
                        <table>
                            <tr>
                                <td>Resi</td>
                                <td>:</td>
                                <td>{this.state.resi}</td>
                            </tr>
                            <tr>
                                <td>Outlet</td>
                                <td>:</td>
                                <td>{this.state.outlet}</td>
                            </tr>
                            <tr>
                                <td>Nama Customer</td>
                                <td>:</td>
                                <td>{this.state.customer}</td>
                            </tr>
                            <tr>
                                <td>Nama Petugas</td>
                                <td>:</td>
                                <td>{this.state.petugas}</td>
                            </tr>
                            <tr>
                                <td>Tanggal Pemesanan</td>
                                <td>:</td>
                                <td>{this.convertTime(this.state.tgl)}</td>
                            </tr>
                        </table><br />
                        <p><b>Rincian Pesanan</b></p><hr />
                        <table>
                                
                                
                            
                            <tr>
                                <td>Paket yang dipesan</td>
                                <td>:</td>
                                {/* <td>{detail.paket.harga}</td>    */}
                            </tr>
                            <tr>
                                <td>Paket</td>
                                <td>:</td>
                                <td>{this.state.paket}</td>
                            </tr>
                            
                        </table><br />
                        <p><b>Pembayaran</b></p><hr />
                        <table>
                            <tr>
                                <td>Status Pembayaran</td>
                                <td>:</td>
                                <td>{this.convertStatusBayar(this.state.dibayar)}</td>
                            </tr>
                            <tr>
                                <td>Total Harga</td>
                                <td>:</td>
                                <td>Rp {formatNumber(this.state.total)}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
