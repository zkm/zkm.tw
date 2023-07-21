// Tracking.tsx

import React from 'react';
import TagManager from 'react-gtm-module';

const Tracking = () => {
  React.useEffect(() => {
    const gtmId = process.env.REACT_APP_GTM_ID;
    if (gtmId) {
      TagManager.initialize({ gtmId });
    }
  }, []);

  return null;
};

export default Tracking;
