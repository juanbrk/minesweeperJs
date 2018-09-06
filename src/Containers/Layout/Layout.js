import React, { Component } from 'react';
import Toolbar from '../../Components/Navigation/Toolbar';
import SideDrawer from '../../Components/Navigation/SideDrawer/SideDrawer';
import classes from './Layout.css';

/*
    Wrapper component that sets how the application will be displayed and works as a state holder to pass
    data between components. 
*/

class Layout extends Component {
    constructor(props) {
        super(props);

        this.onMenuClicked = this.onMenuClicked.bind(this);
    }
    state = {
        showSideDrawer: false,
    }

    //Method that will be passed as prop from <SideDrawer> down to <Backdrop> to close it when clicked. 
    handleSideDrawerClosed = () => {
        this.setState({ showSideDrawer: false });
    }

    onMenuClicked() {
        this.setState((prevState => {
            return { showSideDrawer: !prevState.showSideDrawer }
        }))

    }

    render() {
        return (
            <React.Fragment>
                <Toolbar
                    clicked={this.onMenuClicked} />
                <SideDrawer
                    open={this.state.showSideDrawer}
                    close={this.handleSideDrawerClosed} />
                <main className={classes.content}>
                    {this.props.children}
                </main>


            </React.Fragment>
        );
    }
}

// TODO pasar gameResults como prop a GameSummary con el contenido del state de main. Obtener el estado de
// Game y pasarlo para Modal como prop. 

export default Layout;