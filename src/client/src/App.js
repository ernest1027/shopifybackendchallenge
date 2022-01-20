import HomePage from "./Pages/Homepage";
import {Route, BrowserRouter as Router, Switch, useHistory} from "react-router-dom";
import DataDetailsPage from "./Pages/DataDetailsPage";
import AddEditDataPage from "./Pages/AddEditDataPage";


function App() {
    const history = useHistory();
    return (
        <Router>
            <div className={"App"}>
                <Switch>
                    <Route exact path="/item/view/:id"><DataDetailsPage/></Route>
                    <Route exact path="/item/new"><AddEditDataPage/></Route>
                    <Route exact path="/location/view/:id"><DataDetailsPage isLocation={true}/></Route>
                    <Route exact path="/location/new"><AddEditDataPage isLocation={true} /></Route>
                    <Route exact path="/item/edit/:id"><AddEditDataPage isEditPage={true}/></Route>
                    <Route exact path="/location/edit/:id"><AddEditDataPage isLocation={true} isEditPage={true}/></Route>
                    <Route path="/*"><HomePage/></Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
