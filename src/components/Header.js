/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getUserCart, logout } from "../features/customer/user/authSlice";
import { getProduct } from "../features/customer/products/productSlice";
import { CiHeart } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { formatCurrencyVND } from "utils/formator";
import { TiShoppingCart } from "react-icons/ti";
import { Badge } from "react-rainbow-components";
import { Button, Drawer, Space, Tooltip } from "antd";
import { FaPhoneAlt } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { TbJewishStarFilled } from "react-icons/tb";
import { RiFileList3Fill } from "react-icons/ri";
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { getCategorys } from "features/category/categorySlice";
import Dropdown from "antd/es/dropdown/dropdown";
import { MenuOutlined, RightCircleTwoTone } from '@ant-design/icons';

const Header = ({ history }) => {
  // Get the history object from React Router
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const [paginate, setPaginate] = useState(true);
  const [total, setTotal] = useState(null);
  const [productOpt, setProductOpt] = useState([]);
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const productState = useSelector((state) => state?.product?.products);
  const categoriesState = useSelector((state) => state?.category?.categories);
  const [scrollDirection, setScrollDirection] = useState(
    null
  );
  const [visible, setVisible] = useState(true);
  const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("customer"))
  const [open, setOpen] = useState(false);


  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum =
        sum +
        Number(cartState[index].quantity * Number(cartState[index].price));
      setTotal(sum);
    }
  }, [cartState]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener('scroll', updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener('scroll', updateScrollDirection); // clean up
    };
  }, [scrollDirection]);

  const handleScroll = React.useCallback(() => {
    const currentScrollY = window.scrollY;
    setVisible(currentScrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    getCart();
    dispatch(getCategorys())
  }, []);

  const getCart = () => {
    dispatch(getUserCart());
  };

  useEffect(() => {
    let data = [];
    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      data.push({ id: index, prod: element?.productId, name: element?.productName });
    }
    setProductOpt(data);
    console.log(productState)
  }, [productState]);

  const handleLogout = () => {
    // localStorage.clear();
    // window.location.reload();
    dispatch(logout());
  };

  return (
    <div className="" style={{
      top: 0,
      position: "sticky",
      zIndex: 1000,
    }}>
      <header className="header-top-strip py-1" >
        <div className="container-xxl">
          <div className="row">
            <div className="col-sm-6 col-12">
              <h5 className="gradient-yellow-text mb-0">
                Kính Nhà Làm
              </h5>
            </div>
            <div className="col-sm-6 col-12 text-end align-items-end d-flex justify-content-end gap-3">
              <div className="menu-links">
                <a className="text-end text-white mb-0 link-light" href="tel: 0904866118">
                  <FaPhoneAlt className="me-2 mb-1" />
                  {" "}
                  0904866118
                </a>
              </div>
              <div className="menu-links">
                <Tooltip placement="leftBottom" title={"Danh sách yêu thích"}>
                  <Link
                    to="wishlist"
                    className="d-flex align-items-center gap-10 nav-item"
                  >
                    <RiFileList3Fill className="fs-4 orange-text" />
                  </Link>
                </Tooltip>
              </div>
              <div className="menu-links">
                <Link
                  to={authState?.user === null ? "/login" : "/profile"}
                  className="d-flex align-items-center gap-10 nav-item"
                >
                  {authState?.user === null ? (
                    <p className="mb-0 orange-text">
                      Đăng nhập
                    </p>
                  ) : (
                    <Tooltip placement="bottom" title={"Tài khoản"}>

                      <FaRegUser className="fs-4 orange-text" />
                    </Tooltip>

                  )}
                </Link>
              </div>
              <div className="menu-links">
                {authState?.user === null ? (
                  <p className="mb-0"></p>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="border border-0 bg-transparent text-white text-uppercase justify-content-end"
                    type="button"
                  >
                    <LuLogOut className="fs-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <header className="header-upper py-1" style={{
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
      }}>
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-md-1 col-5">
              <h2>
                <Link className="mw-100 d-flex align-items-center gap-2" to="/">
                  <img src="images/logo.png" alt="logo" style={{ width: '70px', height: '70px' }} />
                  {/* <p className=" mb-0 gradient-yellow-text" style={{ fontWeight: '500' }}>Kính Nhà Làm</p> */}

                </Link>
              </h2>
            </div>

            <div className="col-4 d-md-block d-none">
              <div className="input-group">

                <Typeahead
                  id="pagination-example"
                  onPaginate={() => console.log("Results paginated")}
                  onChange={(selected) => {
                    navigate(`/product/${selected[0]?.prod}`);
                    dispatch(getProduct(selected[0]?.prod));
                  }}
                  options={productOpt}
                  labelKey={"name"}
                  minLength={2}
                  paginate={paginate}
                  placeholder="Tìm kiếm sản phẩm tại đây..."
                />
                <span className="input-group-text p-3" id="basic-addon2">
                  <BsSearch className="fs-8 text-light" />
                </span>
              </div>
            </div>
            <div className="col-7 ">
              <Button style={{
                float: "right",
              }} className="d-md-none d-block" icon={<MenuOutlined />} onClick={() => setOpen(true)}>
              </Button>
              <div className="header-upper-links d-flex align-items-center justify-content-between ms-2 d-md-flex d-none">
                <NavLink className="fs-5 nav-link" to="/">Trang chủ</NavLink>
                <NavLink className="fs-5 nav-link dropdown-link" to="/product">
                  Sản phẩm
                </NavLink>
                <NavLink className="fs-5 nav-link" to="/blogs">Tin tức</NavLink>
                <NavLink className="fs-5 nav-link" to="/contact">Liên hệ</NavLink>
                {getTokenFromLocalStorage?.role === 'ADMIN' || authState?.user === null ? (
                  <p className="mb-0"></p>
                ) : (
                  <NavLink className="nav-link fs-5" to="/my-orders">Lịch sử mua</NavLink>
                )}
                {getTokenFromLocalStorage?.role === 'ADMIN' && (
                  <NavLink className="nav-link fs-5" to="/admin">Quản Lý</NavLink>
                )}
                <div>
                  <Badge showZero>
                    <Tooltip title="Giỏ hàng" color={"#000000"} key={"#000000"}>
                      <Link to="cart" className="d-flex align-items-center gap-10">
                        <TiShoppingCart className="fs-4 black-text" />
                        <div className="d-flex flex-column">
                          <span className="badge bg-white text-dark mb-1">
                            {cartState?.length ? cartState?.length : 0}
                          </span>
                          <p className="mb-0">{formatCurrencyVND(total ? total : 0)}</p>
                        </div>
                      </Link>
                    </Tooltip>
                  </Badge>
                </div>
              </div>
              <Drawer style={{
                background: "#444444"
              }} closeIcon={<RightCircleTwoTone twoToneColor="#FFFBDA" />} title={<h4 className="text-light">Điều Hướng</h4>} onClose={() => setOpen(false)} open={open}>
                <div className="input-group">
                  <Typeahead
                    id="pagination-example"
                    onPaginate={() => console.log("Results paginated")}
                    onChange={(selected) => {
                      navigate(`/product/${selected[0]?.prod}`);
                      dispatch(getProduct(selected[0]?.prod));
                    }}
                    options={productOpt}
                    labelKey={"name"}
                    minLength={2}
                    paginate={paginate}
                    placeholder="Tìm kiếm sản phẩm tại đây..."
                  />
                  <span className="input-group-text p-3" id="basic-addon2">
                    <BsSearch className="fs-8" />
                  </span>
                </div>
                <div className="header-upper-links d-flex flex-column align-items-start mt-3">
                  <NavLink onClick={() => setOpen(false)} className="fs-5 nav-link link-light" to="/">Trang chủ</NavLink>
                  <NavLink onClick={() => setOpen(false)} className="fs-5 nav-link link-light dropdown-link" to="/product">
                    Sản phẩm
                  </NavLink>
                  <NavLink onClick={() => setOpen(false)} className="fs-5 nav-link link-light" to="/blogs">Tin tức</NavLink>
                  <NavLink onClick={() => setOpen(false)} className="fs-5 nav-link link-light" to="/contact">Liên hệ</NavLink>
                  {getTokenFromLocalStorage?.role === 'ADMIN' || authState?.user === null ? (
                    <p className="mb-0"></p>
                  ) : (
                    <NavLink onClick={() => setOpen(false)} className="nav-link link-light fs-5" to="/my-orders">Lịch sử mua</NavLink>
                  )}
                  {getTokenFromLocalStorage?.role === 'ADMIN' && (
                    <NavLink onClick={() => setOpen(false)} className="nav-link link-light fs-5" to="/admin">Quản Lý</NavLink>
                  )}

                </div>
              </Drawer>
            </div>
          </div >
        </div >
      </header >
      {/* <header className="header-bottom py-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="menu-bottom d-flex align-items-center gap-30">
                <div className="col-sm-10">
                </div>


              </div>
            </div>
          </div>
        </div>
        <div></div>
      </header> */}
    </div >
  );
};

export default Header;
