import React from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import LazyLoad from "react-lazyload"
import { showModal } from "../redux/imageModal"

function PhotoItem({ photo: { id, urls, alt } }) {
  const dispatch = useDispatch()

  const openModal = () => {
    dispatch(showModal({ src: urls.full, alt, id }))
  }

  return (
    <ImageWrap>
      <LazyLoad offset={500}>
        <Image crossOrigin="*" id={id} src={urls.small + "&t=" + new Date().getTime()} alt={alt} onClick={openModal} />
      </LazyLoad>
    </ImageWrap>
  )
}

const ImageWrap = styled.div`
  width: 100%;
  padding-bottom: 56.25%;
  position: relative;
`

const Image = styled.img`
  cursor: pointer;
  width: 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`

export default PhotoItem
