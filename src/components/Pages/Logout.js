import React from 'react';
import LogoutRun from './Logout.run';

class Logout extends React.Component {
	componentDidMount() {
        LogoutRun();
    }
	
    render() {
        return (
            <div className="block-center mt-xl wd-xl">
            </div>
        );
    }

}

export default Logout;