import React from 'react';
import { Link } from "react-router-dom";

function Logout() {
    // remove data token dan user dari local storage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
}
export default function Navbar(props) {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand">
                        Laundry.in
                    </a>

                    {/* button toggler */}
                    <button className="navbar-toggler"
                        data-bs-toggle="collapse"
                        data-bs-target="#myNav"
                        aria-controls="myNav"
                        aria-expanded="false">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* define menus */}
                    <div className="collapse navbar-collapse" id="myNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/outlet" className="nav-link">
                                    Outlet
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/member" className="nav-link">
                                    Member
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/paket" className="nav-link">
                                    Paket
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/user" className="nav-link">
                                    User
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/form_transaksi" className="nav-link">
                                    Transaksi Baru
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/transaksi" className="nav-link">
                                    Transaksi
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/resi" className="nav-link">
                                    Resi
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/auth" className="nav-link"
                                    onClick={() => Logout()}>
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav><br />
            {props.children}
        </div>
    )
}