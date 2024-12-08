import {Navigate, Route, Routes} from 'react-router-dom';

import './App.css'
import {Navbar} from './components/Navbar/Navbar.tsx';
import {WelcomePage} from './pages/WelcomePage/WelcomePage.tsx';
import {Sidebar} from './components/Sidebar/Sidebar.tsx';
import {NewPayment} from './pages/NewPayment/NewPayment.tsx';
import {LoginPage} from "./pages/LoginPage/LoginPage.tsx";
// import {ReportPage} from "./pages/ReportPage/ReportPage.tsx";
import {NewCategory} from "./pages/NewCategory/NewCategory.tsx";
import {ProfileSettings} from "./pages/ProfileSettings/ProfileSettings.tsx";
// import {GeneralOverview} from "./pages/GeneralOverview/GeneralOverview.tsx";
import {useEffect, useState} from "react";
import {RegularTransactions} from "./pages/RegularTransactions/RegularTransactions.tsx";
import {Transactions} from "./pages/Transactions/Transactions.tsx";

function App() {

  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true);


    useEffect(() => {
      const token = localStorage.getItem("authTokenCashFlow")
      if (token) {
          const parsedUser = parseJWT(token);
          setUser(parsedUser);
      }
      setLoading(false);
      console.log(user)
  }, []);

  const parseJWT = (token: string) => {
      try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          return JSON.parse(jsonPayload);
      } catch (error) {
          console.error('Invalid token:', error);
          return null;
      }
  }

    if (loading) {
        return null
    }

  return (
    <>
      <Navbar user={user}/>
        <div className={'flex justify-between max-w-screen-xl mx-auto'}>
            {user && <Sidebar />}
            <Routes>
                <Route path={"/"} element={ <Navigate to={'/transactions/all'}/> }/>
                <Route path={'/registration'} element={<WelcomePage />}/>
                <Route path={'/login'} element={<LoginPage />}/>
                <Route path={'/login'} element={user ? <Navigate to={'/transactions/all'}/> : <LoginPage/>} />
                <Route path={'/new_payment'} element={user ? <NewPayment user={user}/> : <Navigate to="/login" />} />
                <Route path={'/new_category'} element={user ? <NewCategory user={user}/> : <Navigate to="/login" />} />
                <Route path={'/profile_settings'} element={user ? <ProfileSettings user={user}/> : <Navigate to="/login" />} />
                <Route path={'/regular/:type'} element={user ? <RegularTransactions user={user}/> : <Navigate to="/login" />} />
                <Route path={'/transactions/:type'} element={user ? <Transactions user={user}/> : <Navigate to="/login" />} />
            </Routes>
        </div>
    </>
  )
}

export default App
