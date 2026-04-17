import { Settings, User, MessageCircle} from "lucide-react"
import { Link, NavLink } from "react-router-dom"
export default function Header() {
  return(
    <div className = "header">
      <div className = "nav-buttons">
        <Link to = "userProfile" className = "link">
          <User className = "nav-btn" />
        </Link>

        <Link to = "/settings" className="link"> <Settings className="nav-btn" />
        </Link>
        <NavLink to="/messenger"><MessageCircle className = "nav-btn" /></NavLink>
      
      </div>
    </div>
  )
}