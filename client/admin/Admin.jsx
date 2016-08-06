import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';


export default class Admin extends TrackerReact(React.Component) {

  render() {
    return (
      <div>
      <h1>Admin</h1>
      <button name="getIndicators" class="getIndicators">Get Indicators</button>
      <button name="downloadData" class="downloadData">Download Data</button>
      </div>
    );
  }
}

