import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

/*function dlData(csv) {
  for (let i = csv.length - 1; i >= 0; i--) {
    link = document.createElement('a');
    link.setAttribute('href', csv.data[i]);
    link.setAttribute('download', csv.filename[i]);
    link.click();
  }
}*/

export default class Admin extends TrackerReact(React.Component) {

  getIndicators(event) {
    event.preventDefault();
    Meteor.call('getIndicators', function getInds(error, result) {
      console.log(result);
    });
  }

/*  downloadData(event) {
    event.preventDefault();
    Meteor.call('downloadData', function cb(error, result) {
      if(error) {
        throw error;
      }
      dlData(result);
    });
  }
*/
  render() {
    return (
      <div>
      <h1>Admin</h1>
      <button className="getIndicators" onClick={this.getIndicators.bind(this)}>
        Get Indicators
      </button>
{/*    <button className="downloadData"
        onClick={this.downloadData.bind(this)}>
        Download Data
      </button>*/}
      </div>
    );
  }
}
