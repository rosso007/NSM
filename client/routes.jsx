import React from 'react';
import {mount} from 'react-mounter';

import {MainLayout} from './layouts/MainLayout.jsx';
import Admin from './admin/Admin.jsx';

FlowRouter.route('/', {
  action() {
    mount(MainLayout, {
      content: (<Admin />),
    });
  },
});
