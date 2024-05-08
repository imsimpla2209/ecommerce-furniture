/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      {/* <footer className='footer py-4'>
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-5">
              <div className="footer-top-data d-flex gap-30 align-items-center">
                <img src="images\newsletter.png" alt='newsleter' />
                <h2 className='mb-0 text-white'>Đăng ký để nhận báo giá </h2>
              </div>
            </div>
            <div className="col-7">
              <div className='input-group'>
                <input type='text'
                  className='form-control py-1'
                  placeholder='Nhập địa chỉ email'
                  aria-label='Your Email Address'
                  aria-describedby='basic-addon2'
                />
                <span className='input-group-text p-2' id='basic-addon2'>
                  Subcribe
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
      <footer className='footer py-3'>
        <div className="container-xxl">
          <div className="row">
            <div className="col-5">
              <h4 className='text-white mb-4'>Liên hệ</h4>
              <div >
                <a className="text-white fs-6">Cửa hàng </a>
                <address className="text-white py-2 mb-1"><br />Địa chỉ: 112 đường Nước Phần Lan, Tứ Liên, Tây Hồ, Hà Nội</address>
                <a href="tel: +84345532150"
                  className="mt-4 d-block mb-2 text-white">Số điện thoại: +84332459430</a>
                <a href="mailto: ducanh@gmail.com"
                  className="mt-4 d-block mb-2 text-white">Email: ducanh@gmail.com</a>
                {/* <div class="social-icons d-flex align-items-center gap-30">
                  <a href="#"><i class="fa fa-apple" id="apple"></i></a>
                  <a href="#"><i class="fa fa-twitter" id="twitter"></i></a>
                  <a href="#"><i class="fa fa-github-square github" id="github"></i></a>
                  <a href="#"><i class="fa fa-facebook-square" id="facebook"></i></a>
                </div> */}
              </div>
            </div>
            <div className="col-4">
              <h4 className='text-white mb-4'>Thông tin</h4>
              <div className="footer-link d-flex flex-column">
                <Link className="text-white py-2 mb-1">Chính sách bảo mật</Link>
                <Link className="text-white py-2 mb-1">Chính sách điều khoản dịch vụ</Link>
              </div>

            </div>
            <div className="col-3">
              <h4 className='text-white mb-4'>Giới thiệu</h4>
              <div className="footer-link d-flex flex-column">
                <Link className="text-white py-2 mb-1">Tài khoản</Link>
                <Link className="text-white py-2 mb-1">Liên hệ</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className='footer py-4'>
        <div className='container-xxl'>
          <div className="row">
            <div className="col-12 mb-0 text-white ">
              <p className="text-end">&copy; {new Date().getFullYear()} Powered by Đức Anh Glass</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer