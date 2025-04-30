import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Toaster} from "./components/ui/sonner.tsx";
import Login from "./pages/Login.tsx";
import Header from "./shared/Header.tsx";
import { ReportsPage } from "./pages/ReportsPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import PostsPage from "./pages/PostsPage.tsx";
import UserDetailsPage from "./pages/UserDetailsPage.tsx";
import PostDetailsPage from "./pages/PostDetailsPage.tsx";

function App() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/reports" element={<ReportsPage/>}/>
                <Route path="/users" element={<UsersPage/>}/>
                <Route path="/users/:userId" element={<UserDetailsPage/>}/>
                <Route path="/posts" element={<PostsPage/>}/>
                <Route path="/posts/:postId" element={<PostDetailsPage/>}/>
                <Route path="*" element={<div>404</div>}/>
            </Routes>
            <Toaster/>
        </Router>
    )
}

export default App
