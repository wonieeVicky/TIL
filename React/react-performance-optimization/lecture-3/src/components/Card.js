import React, { useEffect, useRef } from 'react'

function Card(props) {
  const imgRef = useRef(null)

  useEffect(() => {
    const options = {}
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target
          const previousSibling = target.previousSibling
          // console.log('is intersecting', entry.target.dataset.src)
          // data-set에 넣어둔 src를 실제 src에 주입 - 이미지 로드
          target.src = target.dataset.src
          previousSibling.srcset = previousSibling.dataset.srcset
          // 이미지를 로드한 후 unobserve 처리
          observer.unobserve(target)
        }
      })
    }
    const observer = new IntersectionObserver(callback, options)
    observer.observe(imgRef.current)
  }, [])
  return (
    <div className="Card text-center">
      <picture>
        <source data-srcset={props.webp} type="image/webp" />
        <img ref={imgRef} data-src={props.image} />
      </picture>
      <div className="p-5 font-semibold text-gray-700 text-xl md:text-lg lg:text-xl keep-all">{props.children}</div>
    </div>
  )
}

export default Card
