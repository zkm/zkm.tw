import React from 'react';
import TagManager from 'react-gtm-module';

const Tracking = () => {
  React.useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-KTW7DXZ' });
  }, []);

  return null;
};

export default Tracking;
