/* eslint-disable module-resolver/use-alias */
import React from 'react';

function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {}

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  return LogProps;
}
export default logProps;
