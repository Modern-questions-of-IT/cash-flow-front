import {Route, Routes} from 'react-router-dom';

import './App.css'
import {Navbar} from './components/Navbar/Navbar.tsx';
import {WelcomePage} from './pages/WelcomePage/WelcomePage.tsx';
import {Sidebar} from './components/Sidebar/Sidebar.tsx';
import {NewPayment} from './pages/NewPayment/NewPayment.tsx';
import {LoginPage} from "./pages/LoginPage/LoginPage.tsx";
import {ReportPage} from "./pages/ReportPage/ReportPage.tsx";
import {NewCategory} from "./pages/NewCategory/NewCategory.tsx";
import {ProfileSettings} from "./pages/ProfileSettings/ProfileSettings.tsx";
import {GeneralOverview} from "./pages/GeneralOverview/GeneralOverview.tsx";
import {useEffect, useState} from "react";
import {RegularTransactions} from "./pages/RegularTransactions/RegularTransactions.tsx";
import {Transactions} from "./pages/Transactions/Transactions.tsx";

function App() {

  const [user, setUser] = useState()

  useEffect(() => {
      const token = localStorage.getItem("authToken")
      setUser(parseJWT(token))
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

  return (
    <>
      <Navbar user={user}/>
        <div className={'flex justify-between max-w-screen-xl mx-auto'}>
            {user && <Sidebar/>}
            <Routes>
                <Route path={'/registration'} element={<WelcomePage />}/>
                <Route path={'/login'} element={<LoginPage />}/>
                <Route path={'/new_payment'} element={<NewPayment user={user}/>}/>
                <Route path={'/new_category'} element={<NewCategory user={user} />}/>
                <Route path={'/profile_settings'} element={<ProfileSettings user={user}/>}/>
                <Route path={'/general_overview'} element={<GeneralOverview user={user}/>}/>
                <Route path={'/regular/:type'} element={<RegularTransactions user={user}/>}/>
                <Route path={'/transactions/:type'} element={<Transactions user={user}/>}/>
                <Route path={'/report'} element={<ReportPage user={user} />}/>
            </Routes>
        </div>
    </>
  )
}

export default App
