import React from "react"
import axios from "axios"
import { baseUrl, formatNumber, authorization } from "../config.js";
import domToPdf from "dom-to-pdf";

export default class Laporan extends React.Component {
    constructor() {
        super()
        this.state = {
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    render() {
        const target = React.createRef()
        const optionPDF = {
            orientation: `landscape`,
            unit: `cm`,
            format: [21, 29.7]
        }
        return (
            <div className="container">
                a
            </div>
        )
    }
}
                        