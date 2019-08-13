import React from 'react';

const Sidebar = ({ menu, onSelect }) => (
  <div className="post-sidebar">
    <h5><i data-feather="arrow-down-circle"></i>Navigation</h5>
    <ul className="sidebar-menu">
      {menu.map((title, step) => <li><a href="" onClick={e => { e.preventDefault(); return onSelect(step) }}>{title}</a></li>)}
    </ul>
  </div>
);

export default Sidebar;