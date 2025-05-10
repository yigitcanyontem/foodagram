import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Toaster} from "./components/ui/sonner.tsx";
import Login from "./pages/Login.tsx";
import Header from "./shared/Header.tsx";
import {ReportsPage} from "./pages/ReportsPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import PostsPage from "./pages/PostsPage.tsx";
import UserDetailsPage from "./pages/UserDetailsPage.tsx";
import PostDetailsPage from "./pages/PostDetailsPage.tsx";
import PrivateRoute from "./PrivateRoute.tsx";

function App() {
    return (
        <Router>
            <Header/>
            <div className={"fg-page"}>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/reports" element={
                        <PrivateRoute>
                            <ReportsPage/>
                        </PrivateRoute>
                    }/>
                    <Route path="/users" element={
                        <PrivateRoute>
                            <UsersPage/>
                        </PrivateRoute>
                    }/>
                    <Route path="/users/:userId" element={
                        <PrivateRoute>
                            <UserDetailsPage/>
                        </PrivateRoute>
                    }/>
                    <Route path="/posts" element={
                        <PrivateRoute>
                            <PostsPage/>
                        </PrivateRoute>
                    }/>
                    <Route path="/posts/:postId" element={
                        <PrivateRoute>
                            <PostDetailsPage/>
                        </PrivateRoute>
                    }/>
                    <Route path="*" element={
                        <PrivateRoute>
                            <UsersPage/>
                        </PrivateRoute>
                    }/>
                </Routes>
            </div>
            <Toaster/>
        </Router>
    )
}

export default App
