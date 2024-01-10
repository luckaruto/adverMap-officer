import React from "react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

const Heading2 = (props) => {
  const { children, className } = props;
  const classes = twMerge(`
  font-bold text-blue-700 text-[24px] text-center uppercase 
    ${className ?? ""}
  `);
  return <h1 className={classes}>{children}</h1>;
};

Heading2.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Heading2;
