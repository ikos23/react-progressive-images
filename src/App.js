import React, { useEffect, useRef, useState, Fragment } from "react";
import "./App.css";

import images from "./images.json";

// we need this custom hook to be able to keep
// track of when an image enters the vieport.
// for this Intersection Observer API is used.
const useIntersectionObserver = ({
  onIntersect,
  target,
  threshold = 0.6,
  rootMargin = "0px",
}) => {
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin,
      threshold,
    });

    const current = target.current;
    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  });
};

// renders an image (aka image container)
const Image = (props) => {
  const imgRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useIntersectionObserver({
    target: imgRef,
    onIntersect: ([{ isIntersecting }], observer) => {
      if (isIntersecting) {
        setIsVisible(true);
        observer.unobserve(imgRef.current);
      }
    },
  });

  const { height, width } = props;
  const aspectRatio = (height / width) * 100;
  return (
    <div
      ref={imgRef}
      className="Image"
      style={{ paddingBottom: `${aspectRatio}%` }}
    >
      {isVisible && (
        <Fragment>
          <img
            src={props.urls.thumb}
            alt={props.alt}
            style={{
              visibility: isLoaded ? "hidden" : "visible",
              width: "100%",
              height: "100%",
              filter: "blur(10px)",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <img
            onLoad={() => {
              // to see the difference locally
              // setTimeout(() => {
              //   setIsLoaded(true);
              // }, 1500);
              setIsLoaded(true);
            }}
            src={props.urls.regular}
            alt={props.alt}
            style={{
              opacity: isLoaded ? 1 : 0,
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </Fragment>
      )}
    </div>
  );
};

// our app
function App() {
  return (
    <div className="App">
      <div style={{ width: "100%", maxWidth: "600px" }}>
        {images.map((i) => {
          return (
            <div key={i.id} style={{ padding: "10px" }}>
              <Image
                urls={i.urls}
                height={i.height}
                width={i.width}
                alt={i.alt_description}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
