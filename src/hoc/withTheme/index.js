/* eslint-disable module-resolver/use-alias */
import React from 'react';
import {ThemeContext} from '@hoc/withRedux';

export const withTheme = Component => {
  class ThemedComponent extends React.Component {
    render() {
      return (
        <ThemeContext.Consumer>
          {({theme}) => {
            return <Component theme={theme} />;
          }}
        </ThemeContext.Consumer>
      );
    }
  }

  return ThemedComponent;
};
