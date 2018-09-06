import React, { Component } from 'react';
import Toolbar from '../../Components/Navigation/Toolbar';
import SideDrawer from '../../Components/Navigation/SideDrawer/SideDrawer';
import Modal from '../../Components/UI/Modal/Modal';
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
                <Modal>
                    <main className={classes.content}>
                        {this.props.children}
                    </main>
                </Modal>

            </React.Fragment>
        );
    }
}

export default Layout;