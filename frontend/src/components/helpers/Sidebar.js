import React from 'react';

const Sidebar = ({ menu, current, onSelect }) => (
  <div className="post-sidebar">
    <h5><i data-feather="arrow-down-circle"></i>Navigation</h5>
    <ul className="sidebar-menu">
      {menu.map(({ title, done, active }, step) => (
        <li className={`justify-content-between d-flex align-items-center ${active ? 'active' : ''}`}>
          <a href="" onClick={e => { e.preventDefault(); return onSelect(step) }}>{title}</a>
          { done && <i className="fas fa-check-circle" /> }
        </li>
      ))}
    </ul>
  </div>
);

export default Sidebar;