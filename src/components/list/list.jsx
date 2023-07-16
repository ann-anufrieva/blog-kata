import React from "react";

import './list.css';

function List({ children }) {
  return <section className="wrapper">{children}</section>;
}

export default List;