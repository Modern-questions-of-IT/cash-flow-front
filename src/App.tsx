import {Route, Routes} from 'react-router-dom';

import './App.css'
import {Navbar} from './components/Navbar/Navbar.tsx';
import {WelcomePage} from './pages/WelcomePage/WelcomePage.tsx';
import {Sidebar} from './components/Sidebar/Sidebar.tsx';
import {NewPayment} from './pages/NewPayment/NewPayment.tsx';

function App() {
  const user = true

  return (
    <>
      <Navbar user={user}/>
        <div className={'flex justify-between max-w-screen-xl mx-auto'}>
            {user && <Sidebar/>}
            <Routes>
                <Route path={'/registration'} element={<WelcomePage />}/>
                <Route path={'/new_payment'} element={<NewPayment />}/>
            </Routes>
        </div>
    </>
  )
}

export default App
