import React from "react"
import { useSelector, shallowEqual } from "react-redux"
import ImageModal from "../components/ImageModal"

function ImageModalContainer() {
  const { modalVisible, bgColor, src, alt, id } = useSelector(
    (state) => ({
      modalVisible: state.imageModal.modalVisible,
      bgColor: state.imageModal.bgColor,
      src: state.imageModal.src,
      alt: state.imageModal.alt,
      id: state.imageModal.id,
    }),
    shallowEqual // 각 데이터가 달라졌는지 하나하나 확인해주는 equality Func
  )
  return <ImageModal modalVisible={modalVisible} bgColor={bgColor} src={src} alt={alt} id={id} />
}

export default ImageModalContainer
