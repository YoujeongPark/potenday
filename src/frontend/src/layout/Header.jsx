import { logo } from '../assets/images.js';
console.log(logo);

const Header = () => {
  return (
    <header>
      <h1><img src={String(logo)} alt="로고" /></h1>
    </header>
  );
};

export default Header;