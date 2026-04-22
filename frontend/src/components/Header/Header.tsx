import { Settings, User, MessageCircle} from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
export default function Header() {
  const {user} = useAuth()
  return(
    <div className = "header">
      <div className = "nav-buttons">
        <Link to = {`/profile/${user?.id}`} className = "link">
          <User className = "nav-btn" />
        </Link>

        <Link to = "/settings" className="link"> <Settings className="nav-btn" />
        </Link>
        <NavLink to="/messenger"><MessageCircle className = "nav-btn" /></NavLink>
      
      </div>
    </div>
  )
}