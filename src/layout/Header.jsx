import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.name}</h1>
        <p className="main-logo">
          <img
            src={this.props.logo}
            alt={this.props.name}
            srcSet={this.props.logo}
            width={500}
            height={500}
          />
        </p>
      </div>
    );
  }
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string,
};
