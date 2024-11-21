import { Helmet } from "react-helmet-async";

export default function Introduce() {
  return (
      <>
          <Helmet>
              <title>Giới thiệu</title>
          </Helmet>
          <div class="container-xxl d-flex flex-column align-items-center mb-5 my-5">
              <p style={{ letterSpacing: '5px' }}>VỀ CHÚNG TÔI</p>
              <div class="fw-bold h4">THƯƠNG HIỆU THỜI TRANG NAM AKIRA</div>

              <div class="d-flex justify-content-around mt-4">
                  <p class="col-5">
                      AKIRA là thương hiệu thời trang cho phái mạnh hàng đầu
                      Việt Nam thành lập vào năm 2015 bởi công ty CP đầu tư T&L
                      Việt Nam., hướng tới sự phóng khoáng, lịch lãm và trẻ
                      trung. Sau nhiều năm hoạt động và phát triển, đến nay,
                      AKIRA đã có cho mình 30 cửa hàng chi nhánh khắp cả nước
                      để phục vụ cho khách hàng trên toàn quốc.
                  </p>
                  <p class="col-5">
                      AKIRA luôn đầu tư mạnh về đội ngũ kinh doanh, thiết kế để
                      cho ra những sản phẩm quần áo đẹp mắt. Chất liệu vải được
                      ưu tiên hàng đầu, cửa hàng luôn tìm những loại vải mềm,
                      thoáng mát, thoải mái khi mặc. Form dáng may chuẩn size,
                      là hàng VNXK nên đường may đều tỉ mỉ, gọn gàng.
                  </p>
              </div>

              <div class="d-flex justify-content-around mt-5  ">
                  <div class="col-6">
                      <img
                          src={
                              process.env.PUBLIC_URL +
                              '/about01_introduce1_img.jpg'
                          }
                          alt=""
                          style={{ width: '100%' }}
                      />
                  </div>
                  <div class="col-6 d-flex flex-column justify-content-center align-items-center ps-5">
                      <div class="fw-bold h4">CÂU CHUYỆN THƯƠNG HIỆU</div>
                      <p>
                          Theo đuổi phong cách lịch lãm, sang trọng và trẻ trung
                          cũng như muốn đem đến cho các quý ông vẻ ngoài luôn tự
                          tin cuốn hút mọi lúc mọi nơi, vào năm 2015 AKIRA đã
                          được thành lập được thành lập bởi công ty CP đầu tư
                          T&L Việt Nam. Trong suốt 7 năm hoạt động AKIRA vô
                          cùng tự hào đã đem đến cho các quý khách hàng hơn 1
                          triệu chiếc áo Polo, khẳng định vị thế cũng như thương
                          hiệu và chất lượng sản phẩm trên thị trường hiện nay.
                      </p>
                  </div>
              </div>

              <div class="d-flex justify-content-around mt-5 ">
                  <div class="col-6 d-flex flex-column justify-content-center align-items-center pe-5">
                      <div class="fw-bold h4">GIÁ TRỊ CỐT LÕI</div>
                      <p>
                          Lorem ipsum dolor sit amet. Est nihil obcaecati et
                          reiciendis obcaecati aut quaerat soluta ut tempora
                          vero ab autem dolor. Et distinctio facere aut
                          perferendis aperiam qui porro tempore aut nihil
                          voluptas. Non doloremque rerum ea facere quia sed
                          error nostrum et consequuntur libero non tenetur
                          aperiam!
                      </p>
                  </div>
                  <div class="col-6">
                      <img
                          src={
                              process.env.PUBLIC_URL +
                              '/about01_introduce2_img.jpg'
                          }
                          alt=""
                          style={{ width: '100%' }}
                      />
                  </div>
              </div>
          </div>
      </>
  );
 }
