import React from 'react';
import Content from './content';

import PdfUploadForm from './LoginForm';


const Body = () => {
  return (
    <main className="body">
      <div className="row">
        <div className="column">
          <Content />
        </div>
        <div className="column">
          
          <PdfUploadForm></PdfUploadForm>
        </div>
      </div>
    </main>
  );
};

export default Body;
