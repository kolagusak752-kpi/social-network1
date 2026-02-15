import LoginPage from "../pages/loginPage"
import RegistrPage from "../pages/registrPage"
import LandingPage from "../pages/landingPage"
import {Routes, Route} from "react-router-dom"

export default function App() {
    return (
        <Routes>
            <Route path = "/" element = {<LandingPage />} />
            <Route path = "/login" element ={<LoginPage />} />
            <Route path = "/registration" element = {<RegistrPage />} />
        </Routes>
    )
}
