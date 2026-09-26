import "./admin.css";
import { Link } from "react-router-dom";

function AdminPage() {
    return (
      <div className="adminlayout">
        <h1 className="adminheader">Welcome Admin</h1>

        <div className="container">
            <div className="row">
                <div className="column">
                  <div className="admin-activity">
                        <h3>View Products</h3>
                        <Link className="adminlinks-design" to="/products">&#8594;</Link>
                    </div>   
                </div>
                <div className="column">
                  <div className="admin-activity">
                        <h3>View Categories</h3>
                        <Link className="adminlinks-design" to="/categories">&#8594;</Link>
                    </div>   
                </div>
                <div className="column">
                  <div className="admin-activity">
                        <h3>Modify Products</h3>
                        <Link className="adminlinks-design" to="/admin/products">&#8594;</Link>
                    </div>   
                </div>
                <div className="column">
                  <div className="admin-activity">
                        <h3>My Orders</h3>
                        <Link className="adminlinks-design" to="/my-orders">&#8594;</Link>
                    </div>   
                </div>
            </div>
        </div>
      </div>
    );
  }
  
  export default AdminPage;