import React, { Component } from 'react';
import Toolbar from '../Navigation/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
import classes from './Layout.css';

/*
    Wrapper component that sets how the application will be displayed
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

    onMenuClicked(){
        this.setState((prevState=>{
            return {showSideDrawer: !prevState.showSideDrawer}
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

export default Layout;