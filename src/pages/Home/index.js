import React from 'react';
import { Link } from 'react-router-dom';
import Template from '../../templates/template'
import TemplateTwo from '../../templates/templateTwo';

class Home extends React.Component {
  render() {
    return (
      <div style={{textAlign: 'center' }}>
        <Template />
        <div>As for the API https://exchangeratesapi.io is used</div>
      </div>
    )
  }
}

export default Home;