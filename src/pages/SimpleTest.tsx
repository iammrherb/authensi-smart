import React from 'react';

const SimpleTest = () => {
  console.log('SimpleTest component rendered');
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <p>If you can see this, the basic React rendering is working.</p>
      <p>Check the console for any errors.</p>
    </div>
  );
};

export default SimpleTest;