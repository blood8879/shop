import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import { continents, price } from './Sections/Datas'
import RadioBox from './Sections/RadioBox';

function LandingPage(props) {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(2)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

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

    const showFilteredResults = (filters) => {
        let body = {
            sikp: 0,
            limit: Limit,
            filters: filters
        }
        
        getProducts(body)
        setSkip(0)
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}

        newFilters[category] = filters

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }
    
    return (
        <div style={{ width: '75%', margin: '3rem auto'}}>
            <div style={{ textAlign: 'center'}}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /></h2>
            </div>

            {/* Filter */}
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}    
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col>
            </Row>
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
