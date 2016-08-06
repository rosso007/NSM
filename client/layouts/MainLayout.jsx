import React from 'react';

export const MainLayout = ({content}) => (
  <div className="main-layout">
    <header>
      <h2>ASX Data</h2>
      <nav>
        <a href="/500">500%'s</a>
        <a href="/">Admin</a>
      </nav>
    </header>
    {content}
  </div>
)