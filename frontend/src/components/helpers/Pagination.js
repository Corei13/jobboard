import React from 'react';

const Page = ({ children, className, onClick }) => <a className={className} target="_blank" style={{ cursor: 'pointer' }} onClick={onClick}>{children}</a>

const Pagination = ({ pages, current, setPage }) => (
  <div className="pagination-list text-center">
    <nav className="navigation pagination">
      <div className="nav-links">
        {current > 1 && <Page className="page-numbers prev" onClick={() => setPage(current - 1)}><i className="fas fa-angle-left" /></Page>}
        {
          Array(7).fill()
            .map((_, i) => current + i - 3)
            .filter(p => p >= 1 && p <= pages)
            .map(p => current === p
              ? <span key={p} aria-current="page" className="page-numbers current">{p}</span>
              : <Page key={p} className="page-numbers" onClick={() => setPage(p)}>{p}</Page>
            )
        }
        {current < pages && <Page className="page-numbers next" onClick={() => setPage(current + 1)}><i className="fas fa-angle-right" /></Page>}
      </div>
    </nav>
  </div>
);

export default Pagination;