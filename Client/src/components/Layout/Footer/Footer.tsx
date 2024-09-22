import { AiFillMail, AiFillPhone } from "react-icons/ai";

const Footer = () => {
  return (
    <>
      <ul className="flex justify-between items-center lg:max-w-[30%] mx-auto mt-4">
        <li className="flex items-center">
          <AiFillMail className="mr-2" />
          realmail@mail.com
        </li>
        <li className="flex items-center">
          <AiFillPhone className="mr-2" />
          111 111 111
        </li>
      </ul>
    </>
  );
};

export default Footer;
