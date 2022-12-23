import React from 'react';
import PropTypes from 'prop-types';
import ConnectLinks from '../components/ConnectLinks';

export default class PageContainer extends React.Component {
  render() {
    return (
      <div className="main-connect">
        <h2>{this.props.title}</h2>
        <ConnectLinks />
      </div>
    );
  }
}

PageContainer.propTypes = {
  title: PropTypes.string,
};
