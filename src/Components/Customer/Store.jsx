import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function Store() {
    const [listStore, setListStore] = useState([
        {
            id: 1,
            name: 'TORANO TRƯƠNG ĐỊNH',
            address: 'Số 179 Trương Định, Quận Hoàng Mai, Hà Nội',
            time: '8h30 - 20h00 (kể cả CN và ngày lễ)',
            phone: '098989999',
            api: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.0480498187626!2d105.84330438099062!3d20.990710939209666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad2d85f4d157%3A0xb342677bf9ee0d68!2zVE9SQU5PIDE3OSBUUsavxqBORyDEkOG7ik5I!5e0!3m2!1svi!2s!4v1705909366457!5m2!1svi!2s',
            city: 'Hà Nội',
        },
        {
            id: 2,
            name: 'TORANO 425A SƯ VẠN HẠNH NỐI DÀI',
            address: '425A SƯ VẠN HẠNH NỐI DÀI, P.12, Q.10',
            time: '8h30 - 20h00 (kể cả CN và ngày lễ)',
            phone: '096968696',
            api: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3919.509913521864!2d106.669631!3d10.772203!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f5b255f0b29%3A0x9c61555ce8088f5a!2zVE9SQU5PIDQyNUEgU8avIFbhuqBOIEjhuqBOSA!5e0!3m2!1svi!2sus!4v1705923884646!5m2!1svi!2sus',
            city: 'Thành phố Hồ Chí Minh',
        },
        {
            id: 3,
            name: 'TORANO ĐÀ NẴNG',
            address: '281 Điện Biên Phủ, Q. Thanh Khê',
            time: '8h30 - 20h00 (kể cả CN và ngày lễ)',
            phone: '0998999999',
            api: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3833.9981268069027!2d108.193418!3d16.065587!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142191253cf72b3%3A0xd5167753b8ddac4f!2zVG9yYW5vIMSQw6AgTuG6tW5n!5e0!3m2!1svi!2sus!4v1705923998699!5m2!1svi!2sus',
            city: 'Đà Nẵng',
        },
        {
            id: 4,
            name: 'TORANO 35 NGUYỄN PHONG SẮC',
            address: 'Số 35 Nguyễn Phong Sắc, Cầu Giấy, Hà Nội',
            time: '8h30 - 22h00 (kể cả CN và ngày lễ)',
            phone: '0978361786',
            api: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3723.8900233858894!2d105.789871!3d21.037086!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab23cb755bf9%3A0xf10ea9cb5e5101c4!2sTorano!5e0!3m2!1svi!2sus!4v1705924309896!5m2!1svi!2sus',
            city: 'Hà Nội',
        },
        {
            id: 5,
            name: 'TORANO VẠN PHÚC',
            address: 'Số 178 Vạn Phúc, Q. Hà Đông, Hà Nội',
            time: '8h30 - 20h00 (kể cả CN và ngày lễ)',
            phone: '0989786959',
            api: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1862.6291204576075!2d105.770733!3d20.982283!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134533079da2b41%3A0x3c0fb1a30fda48c!2zMTc4IMSQxrDhu51uZyBW4bqhbiBQaMO6YywgVuG6oW4gUGjDumMsIEjDoCDEkMO0bmcsIEjDoCBO4buZaSAxMDAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2sus!4v1705924376967!5m2!1svi!2sus',
            city: 'Hà Nội',
        },
    ]);
    
    const [citySelected, setCitySelected] = useState('');
    const [filteredStores, setFilteredStores] = useState(listStore);
    const [mapSrc, setMapSrc] = useState('');
    const cities = [...new Set(listStore.map((store) => store.city))];

    useEffect(() => {
        const filtered = listStore.filter(
            (store) => store.city === citySelected
        );
        setFilteredStores(filtered);
        if (filtered.length > 0) {
            setMapSrc(filtered[0].api);
        }
    }, [citySelected, listStore]);

    const handleCityChange = (event) => {
        const selectedCity = event.target.value;
        setCitySelected(selectedCity);
    };
    return (
        <div className="container-xl my-5">
            <Helmet>
                <title>Hệ thống cửa hàng</title>
            </Helmet>
            <h2 className="col-12 d-flex justify-content-center">
                Hệ thống cửa hàng
            </h2>
            <div className="col-12 d-flex justify-content-around mt-5">
                <div className="col-5 border p-5">
                    <h4>Tìm cửa hàng</h4>
                    <div className="mb-3">
                        <p>Chọn tỉnh thành</p>
                        <select
                            className="col-12 form-control"
                            value={citySelected}
                            onChange={handleCityChange}
                        >
                            <option value="">Chọn thành phố</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div id="store-info">
                        {filteredStores.map((store) => (
                            <div key={store.id} className="border d-flex mt-5">
                                <div className="m-3">
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div>
                                    <div className="mt-3">{store.name}</div>
                                    <div className="mt-3">{store.address}</div>
                                    <div className="mt-3">
                                        Thời gian hoạt động:{' '}
                                        <span className="fw-bold">
                                            {store.time}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        Số điện thoại:{' '}
                                        <span className="fw-bold">
                                            {store.phone}
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-dark mt-3 mb-3 view-map"
                                        onClick={() => setMapSrc(store.api)}
                                    >
                                        Xem bản đồ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {mapSrc && (
                    <iframe
                        title="map"
                        id="map-api"
                        src={mapSrc}
                        className="border col-6"
                        height="800"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                )}
            </div>
        </div>
    );
}
