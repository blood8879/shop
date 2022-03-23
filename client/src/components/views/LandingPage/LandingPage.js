import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import { continents } from './Sections/Datas'

function LandingPage(props) {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(2)
    const [PostSize, setPostSize] = useState(0)

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }
        
        getProducts(body)
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success) {
                    if(body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert("상품 가져오기 실패")
                }
            })
    }

    const loadMoreHandler = () => {

        let skip = Skip + Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)
        setSkip(skip)
    }

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
        
        <Card
            cover={<ImageSlider images={product.images}/>}
        >
            <Meta 
                title={product.title}
                description={`${product.price}`}
            />
        </Card>
        </Col>
    })

    const handleFilters = () => {
        
    }
    
    return (
        <div style={{ width: '75%', margin: '3rem auto'}}>
            <div style={{ textAlign: 'center'}}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /></h2>
            </div>

            {/* Filter */}

            {/* CheckBox */}
            <CheckBox list={continents} handleFilters={filter => handleFilters(filters, "continents")}/>
            {/* RadioBox */}

            {/* Search */}

            {/* Cards */}

            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>

            <br />

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center '}}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }

        </div>
    )
}

export default LandingPage
