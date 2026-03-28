import { Settings, User } from "lucide-react"
import { Link } from "react-router-dom"
export default function Header() {
  return(
    <div className = "header">
      <div className = "nav-buttons">
        <Link to = "userProfile" className = "profile">
          <User />
        </Link>

        <Link to = "/settings"> <Settings />
        </Link>
      
      </div>
    </div>
  )
}