//? REACT
import React from "react";

const Footer: React.FC = () => {

  //* Get current year using Intl.DateTimeFormat
  const currentYear: string = new Date().toLocaleDateString("en-US", {
    year: "numeric",
  });

  //* VAR: company name as dynamic variable
  const companyName: string = "KONOHA PROJECT";

  return (
    <footer className="border-t border-gray-500 text-center py-4 text-sm">
      <small>Copyright &copy; {currentYear} {companyName}</small>
    </footer>
  );
}

export default Footer;
