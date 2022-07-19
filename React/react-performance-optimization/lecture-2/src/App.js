import React, { useState, Suspense, useEffect } from 'react'
import styled from 'styled-components'
import Header from './components/Header'
import InfoTable from './components/InfoTable'
import SurveyChart from './components/SurveyChart'
import Footer from './components/Footer'

function lazyWithPreload(importFunction) {
    const Component = React.lazy(importFunction)
    Component.preload = importFunction
    return Component
}

const LazyImageModal = lazyWithPreload(() => import('./components/ImageModal'))

function App() {
    const [showModal, setShowModal] = useState(false)

    // const handlerMouseEnter = () => {
    //     const component = import('./components/ImageModal')
    // }

    useEffect(() => {
        LazyImageModal.preload()
    }, [])

    return (
        <div className='App'>
            <Header />
            <InfoTable />
            <ButtonModal
                onClick={() => {
                    setShowModal(true)
                }}>
                올림픽 사진 보기
            </ButtonModal>
            <SurveyChart />
            <Footer />
            <Suspense fallback={null}>
                {showModal ? (
                    <LazyImageModal
                        closeModal={() => {
                            setShowModal(false)
                        }}
                    />
                ) : null}
            </Suspense>
        </div>
    )
}

const ButtonModal = styled.button`
    border-radius: 30px;
    border: 1px solid #999;
    padding: 12px 30px;
    background: none;
    font-size: 1.1em;
    color: #555;
    outline: none;
    cursor: pointer;
`

export default App
