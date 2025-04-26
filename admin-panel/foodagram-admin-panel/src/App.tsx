import './App.css'
import {AppProvider} from "./context/AppContext.tsx";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Toaster} from "./components/ui/sonner.tsx";
import Login from "./pages/Login.tsx";
import Header from "./shared/Header.tsx";

function App() {
    return (
        <Router>
            <AppProvider>
                <Header/>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="*" element={<div>404</div>}/>
                </Routes>
                <Toaster/>
            </AppProvider>
        </Router>
    )
}

export default App
